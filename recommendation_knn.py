import pandas as pd
import requests
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
import numpy as np
import time
import ast
from xgboost import XGBRegressor
import joblib

# 1. 게임 데이터 불러오기
games_df = pd.read_csv('Processed_Games_Dataset.csv', usecols=["gameid", "title", "genres"])
games_df.dropna(subset=['genres', 'gameid', 'title'], inplace=True)
games_df['gameid'] = games_df['gameid'].astype(str)
games_df['genres'] = games_df['genres'].apply(lambda x: ast.literal_eval(x) if isinstance(x, str) else [])
games_df['genres'] = games_df['genres'].apply(lambda genre_list: [g.strip(" []'\"") for g in genre_list])

mlb = MultiLabelBinarizer()
genre_vectors = pd.DataFrame(mlb.fit_transform(games_df['genres']), columns=mlb.classes_)
games_df = pd.concat([games_df.reset_index(drop=True), genre_vectors], axis=1)

# 2. 유저 게임 가져오기
def get_user_game_data(api_key, steam_id):
    url = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/"
    params = {
        "key": api_key,
        "steamid": steam_id,
        "format": "json",
        "include_appinfo": 1
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        print("[ERROR] Steam API 실패:", response.status_code)
        return []
    games = response.json().get("response", {}).get("games", [])
    return [
        {"appid": str(g["appid"]), "name": g.get("name", ""), "playtime": g.get("playtime_forever", 0)}
        for g in games
    ]

# 3. 장르 정보 보강
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
        enriched.append({
            "gameid": appid,
            "name": game["name"],
            "playtime": game["playtime"],
            "genres": genres
        })
        time.sleep(1)
    return enriched

# 4. 장르 기반 추천
def recommend_from_user_genres(user_games, games_df, mlb, top_n=6):
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
        return []
    weights = np.array(weights) / sum(weights)
    avg_vec = np.average(np.array(vectors), axis=0, weights=weights).reshape(1, -1)
    genre_matrix = games_df[mlb.classes_].fillna(0).values
    similarities = cosine_similarity(avg_vec, genre_matrix).flatten()
    return similarities

# 5. XGBoost 기반 모델 점수 예측 (사전 학습된 모델 사용)
def predict_with_model(avg_vec, games_df):
    try:
        model = joblib.load("xgb_model.pkl")  # 미리 학습한 모델 경로
        X = games_df[mlb.classes_].fillna(0).values
        predictions = model.predict(X)
        return predictions
    except Exception as e:
        print("[ERROR] 모델 예측 실패:", e)
        return np.zeros(len(games_df))

# 6. 하이브리드 추천

def hybrid_recommendation(user_games, games_df, mlb, alpha=0.5, top_n=6):
    genre_scores = recommend_from_user_genres(user_games, games_df, mlb, top_n=None)
    model_scores = predict_with_model(None, games_df)
    hybrid_scores = alpha * genre_scores + (1 - alpha) * model_scores
    sorted_idx = np.argsort(hybrid_scores)[::-1]

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

# 7. 실행
if __name__ == "__main__":
    steam_api_key = "C634EC0EFBF99B5431F2D16C71ECB481"
    steam_id = "76561198349731562"

    user_data = get_user_game_data(steam_api_key, steam_id)
    enriched_data = enrich_user_games_with_genres(user_data[:10])
    recommendations = hybrid_recommendation(enriched_data, games_df, mlb, alpha=0.5, top_n=6)

    print("\n[Hybrid Recommended Games]")
    for appid, name, score in recommendations:
        print(f"{name} (Game ID: {appid}) - Final Score: {score:.4f}")
