import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
import joblib
import requests
import time
import ast
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

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
        if response.status_code == 429:
            print("[WARNING] API request error - wait for second...")
            time.sleep(5)
            response = requests.get(url, params=params)
        if response.status_code != 200:
            print("[ERROR] Steam API 오류:", response.status_code)
            return []
        games = response.json().get("response", {}).get("games", [])
        return [{"appid": str(g["appid"]), "name": g.get("name", ""), "playtime": g.get("playtime_forever", 0)} for g in games]
    except Exception as e:
        print("[ERROR] Steam API exception:", e)
        return []

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
            print(f"[EXCEPTION] {appid}: {e}")
        enriched.append({
            "gameid": appid,
            "name": game["name"],
            "playtime": game["playtime"],
            "genres": genres
        })
        time.sleep(1)
    return enriched

def hybrid_recommendation(user_games, games_df, mlb, model, alpha=0.5, top_n=6):
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
    user_pref_vec = np.average(np.array(vectors), axis=0, weights=weights).reshape(1, -1)

    game_vectors = games_df[mlb.classes_].fillna(0).values
    genre_scores = cosine_similarity(user_pref_vec, game_vectors).flatten()
    model_scores = model.predict_proba(game_vectors)[:, 1]
    print(">> Unique Model Scores:", np.unique(model_scores))
    print(">> Genre Score Range:", np.min(genre_scores), "~", np.max(genre_scores))
    hybrid_scores = alpha * genre_scores + (1 - alpha) * model_scores

    sorted_idx = np.argsort(hybrid_scores)[::-1]
    owned_ids = set(str(g["gameid"]) for g in user_games)
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

if __name__ == "__main__":
    api_key = "C634EC0EFBF99B5431F2D16C71ECB481"
    steam_id = "76561198349731562"

    print("[INFO] User game info loading...")
    user_games = get_user_game_data(api_key, steam_id)
    user_games = enrich_user_games_with_genres(user_games)

    print("[INFO] Dataset and Model loading...")
    games_df, mlb = load_games_dataset()
    model = joblib.load("xgb_game_preference_model.pkl")

    print("[INFO] Calculating Recommendation")
    recommendations = hybrid_recommendation(user_games, games_df, mlb, model, alpha=0.5, top_n=6)

    print("\n[Recommendation Result]")
    for gameid, title, score in recommendations:
        print(f" - {title} ({gameid}): score {score:.4f}")
