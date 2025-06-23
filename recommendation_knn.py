import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import requests
import time
import joblib
import ast
from sklearn.preprocessing import MultiLabelBinarizer


def load_games_dataset():
    games_df = pd.read_csv('Processed_Games_Dataset2.csv', usecols=["gameid", "title", "genres"])
    games_df.dropna(subset=['genres', 'gameid', 'title'], inplace=True)
    games_df['gameid'] = games_df['gameid'].astype(str)
    games_df['genres'] = games_df['genres'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else [])
    games_df['genres'] = games_df['genres'].apply(lambda genre_list: [g.strip(" []'\"") for g in genre_list])
    mlb = MultiLabelBinarizer()
    genre_vectors = pd.DataFrame(mlb.fit_transform(games_df['genres']), columns=mlb.classes_)
    games_df = pd.concat([games_df.reset_index(drop=True), genre_vectors], axis=1)
    return games_df, mlb


def get_user_game_data(api_key, steam_id):
    url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"
    params = {"key": api_key, "steamid": steam_id, "format": "json", "include_appinfo": 1}
    
    try:
        response = requests.get(url, params=params)
        
        # 요청 제한에 따른 처리
        if response.status_code == 429:
            print("[ERROR] Steam API 요청 제한 초과, 잠시 대기 중...")
            time.sleep(5)  
            response = requests.get(url, params=params)
        
        if response.status_code != 200:
            print("[ERROR] Steam API fail:", response.status_code)
            return []  # 빈 리스트 반환, 실패 시 데이터가 없다고 처리
        
        games = response.json().get("response", {}).get("games", [])
        
        # 게임 데이터가 없으면 빈 리스트 반환
        if not games:
            print("[ERROR] no game data.")
            return []
        
        # 정상적으로 데이터를 가져오면 게임 데이터 반환
        return [{"appid": str(g["appid"]), "name": g.get("name", ""), "playtime": g.get("playtime_forever", 0)} for g in games]
    
    except Exception as e:
        print("[ERROR] API 요청 failure:", e)
        return []  # 예외 발생 시 빈 리스트 반환

def enrich_user_games_with_genres(user_games):
    enriched = []
    for game in user_games:
        appid = game["appid"]
        url = f"https://store.steampowered.com/api/appdetails?appids={appid}"
        genres = []
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json().get(str(appid), {}).get("data", {})
                genres = [g["description"] for g in data.get("genres", [])]
        except Exception as e:
            print(f"[EXCEPTION] AppID {appid} - {e}")
        enriched.append({"gameid": appid, "name": game["name"], "playtime": game["playtime"], "genres": genres})
        time.sleep(1)
    return enriched


def compute_genre_score(user_games, games_df, mlb):
    vectors, weights = [], []
    for g in user_games:
        if g["genres"]:
            try:
                vec = mlb.transform([g["genres"]])[0]
                vectors.append(vec)
                weights.append(g["playtime"])
            except:
                continue
    if not vectors:
        return np.zeros(len(games_df))
    weights = np.array(weights) / sum(weights)
    avg_vec = np.average(np.array(vectors), axis=0, weights=weights).reshape(1, -1)
    genre_matrix = games_df[mlb.classes_].fillna(0).values
    return cosine_similarity(avg_vec, genre_matrix).flatten()


def predict_with_model(user_games, mlb):
    try:
        model = joblib.load("xgb_game_preference_model.pkl")
        print("Model loaded successfully!")

        genre_vectors = []
        for g in user_games:
            if g["genres"]:
                vec = mlb.transform([g["genres"]])[0]
                genre_vectors.append(vec)
        
        if not genre_vectors:
            return np.zeros(len(user_games))  
        
        X = np.array(genre_vectors)  

        model_scores_proba = model.predict_proba(X)
        model_scores = model_scores_proba[:, 1]
        print(f"Class 1 Probabilities: {model_scores}")
        
        # 예측 확률이 2D 배열인 경우
        if model_scores_proba.ndim == 2:  # 2D 배열
            return model_scores_proba[:, 1]  # 클래스 1의 확률 반환
        else:  # 1D 배열일 경우
            return model_scores_proba  # 1D 배열 그대로 반환
        
    except Exception as e:
        print("[ERROR] 모델 예측 실패:", e)
        return np.zeros(len(user_games))  # 예측 실패 시 0값 반환


def hybrid_recommendation(user_games, games_df, mlb, alpha=0.5, top_n=10):
    # 1. 장르 점수 계산
    genre_scores = compute_genre_score(user_games, games_df, mlb)
    
    # 2. 유저 게임에 대한 모델 예측
    model_scores_proba = predict_with_model(user_games, mlb)  # user_games를 넘겨야 함

    # model_scores_proba가 1D 배열일 경우 바로 사용
    if model_scores_proba.ndim == 2:
        model_scores = model_scores_proba[:, 1]  # 클래스 1에 대한 확률만 추출
    else:
        model_scores = model_scores_proba  # 1D 배열이면 그대로 사용

    # 3. model_scores 배열을 전체 게임 수에 맞게 확장
    model_scores_full = np.zeros(len(games_df))  # 전체 게임 수에 맞는 배열
    recommended_game_ids = [g["gameid"] for g in user_games]  # 'appid' 대신 'gameid' 사용

    recommended_scores = np.array(model_scores)  # 모델 예측 확률

    # 추천된 게임의 인덱스를 찾아서 확장된 model_scores_full에 할당
    for idx, game_id in enumerate(recommended_game_ids):
        game_id_str = str(game_id)  # game_id를 str로 변환하여 일치시킴

        # game_id에 해당하는 인덱스를 찾기
        game_idx = games_df[games_df["gameid"] == game_id_str].index

        if game_idx.empty:  # 게임이 없다면
            print(f"[SKIP] Game ID {game_id_str} not found in games_df. Finding similar game...")
            
            # 장르 벡터가 유사한 게임을 찾아서 대체
            similar_game_idx = find_similar_game(game_id_str, user_games, games_df, mlb)
            if similar_game_idx is not None:
                print(f"[INFO] Replacing with similar game: {games_df.iloc[similar_game_idx]['title']}")
                game_idx = [similar_game_idx]  # 유사한 게임 인덱스를 사용
            
        model_scores_full[game_idx[0]] = recommended_scores[idx]

    # 4. 장르 점수와 모델 예측값 결합
    hybrid_scores = alpha * genre_scores + (1 - alpha) * model_scores_full
    sorted_idx = np.argsort(hybrid_scores)[::-1]  # 추천된 게임들을 정렬
    
    # 5. 상위 추천 게임 출력
    owned_ids = set(g["gameid"] for g in user_games if "gameid" in g)
    recommended = []
    for idx in sorted_idx:
        row = games_df.iloc[idx]
        gameid = str(row["gameid"])
        title = row["title"]
        score = hybrid_scores[idx]
        if gameid not in owned_ids:
            recommended.append((gameid, title, score))
            if len(recommended) >= top_n:
                break
    
    return recommended



def find_most_similar_user_game_for_each_recommendation(recommended, processed_df, user_vector_df, genre_cols):
    similar_games = []

    # 대상 유저 장르 행렬 준비
    user_genre_matrix_all = user_vector_df[genre_cols].fillna(0).values
    user_game_ids_all = user_vector_df['game_id'].values

    already_matched_ids = set()

    for gameid, title, score in recommended:
        vec = processed_df.loc[processed_df['gameid'] == gameid, genre_cols].fillna(0).values
        if vec.shape[0] == 0:
            print(f"[SKIP] {gameid} not found in processed_df")
            continue

        # 아직 매칭되지 않은 user_game만 필터링
        valid_indices = [i for i, uid in enumerate(user_game_ids_all) if uid not in already_matched_ids]
        if not valid_indices:
            print(f"[SKIP] No remaining user games for matching {gameid}")
            continue

        filtered_user_matrix = user_genre_matrix_all[valid_indices]
        filtered_user_ids = user_game_ids_all[valid_indices]

        # 코사인 유사도 계산
        sim_scores = cosine_similarity(vec, filtered_user_matrix).flatten()
        best_idx = np.argmax(sim_scores)

        matched_id = filtered_user_ids[best_idx]
        matched_score = sim_scores[best_idx]
        already_matched_ids.add(matched_id)

        similar_games.append({
            "recommended_game_id": gameid,
            "recommended_title": title,
            "matched_user_game_id": matched_id,
            "similarity_score": matched_score
        })

    return similar_games

def find_similar_game(game_id, user_games, games_df, mlb):
    """
    게임이 games_df에 없을 경우, 장르 벡터가 유사한 게임을 찾는 함수.
    """
    # 유저 게임의 장르 벡터
    user_game = next((g for g in user_games if str(g["gameid"]) == game_id), None)
    
    if not user_game or not user_game["genres"]:
        return None
    
    # 유저 게임의 장르 벡터를 변환
    user_game_vector = mlb.transform([user_game["genres"]])[0]
    
    # games_df에서 장르 벡터 가져오기
    game_vectors = games_df[mlb.classes_].values
    
    # 유사도 계산
    sim_scores = cosine_similarity([user_game_vector], game_vectors).flatten()
    
    # 자신을 제외한 유사도 상위 1개 게임 찾기
    similar_game_idx = np.argmax(sim_scores)  # 가장 유사한 게임 인덱스
    if sim_scores[similar_game_idx] > 0:  # 유사도가 0보다 크면 유효한 유사 게임
        return similar_game_idx
    return None