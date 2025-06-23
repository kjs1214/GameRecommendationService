import pandas as pd
import numpy as np
import requests
import time
from sklearn.preprocessing import MultiLabelBinarizer
from xgboost import XGBRegressor
import joblib

# 1. 사용자-게임 플레이 csv 불러오기
user_df = pd.read_csv("user_game_played_data.csv")
user_df['game_id'] = user_df['game_id'].astype(str)
unique_game_ids = user_df['game_id'].unique()

# 2. Steam에서 게임 장르 수집
def fetch_genres_from_steam(appids):
    genre_data = []
    for appid in appids:
        url = f"https://store.steampowered.com/api/appdetails?appids={appid}"
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json().get(str(appid), {}).get("data", {})
                genres = [g["description"] for g in data.get("genres", [])]
                genre_data.append({"gameid": str(appid), "genres": genres})
        except Exception as e:
            print(f"[ERROR] {appid}: {e}")
        time.sleep(1)
    return pd.DataFrame(genre_data)

genre_df = fetch_genres_from_steam(unique_game_ids)
genre_df['genres'] = genre_df['genres'].apply(lambda x: [g.strip(" []'\"") for g in x])

# 3. 장르 벡터화
mlb = MultiLabelBinarizer()
genre_vec = pd.DataFrame(mlb.fit_transform(genre_df['genres']), columns=mlb.classes_)
game_df = pd.concat([genre_df[['gameid']], genre_vec], axis=1)

# 4. 사용자 벡터 계산
user_profiles = []
for user_id, group in user_df.groupby('user_id'):
    vectors, weights = [], []
    for _, row in group.iterrows():
        gid = str(row['game_id'])
        game_vec = game_df[game_df['gameid'] == gid]
        if game_vec.empty:
            continue
        vectors.append(game_vec.iloc[0][mlb.classes_].values)
        weights.append(row['playtime'])
    if vectors:
        weights = np.array(weights) / sum(weights)
        user_vec = np.average(vectors, axis=0, weights=weights)
        user_profiles.append((str(user_id).strip("'"), user_vec))

user_vec_dict = {uid: vec for uid, vec in user_profiles}

# 5. 학습 데이터 구성
X, y = [], []
for _, row in user_df.iterrows():
    uid = str(row['user_id']).strip("'")
    gid = str(row['game_id'])
    playtime = row['playtime']
    if uid in user_vec_dict and gid in game_df['gameid'].values:
        user_vec = user_vec_dict[uid]
        game_vec = game_df[game_df['gameid'] == gid].iloc[0][mlb.classes_].values
        input_vec = np.concatenate([user_vec, game_vec])
        X.append(input_vec)
        y.append(playtime)

X = np.array(X)
y = np.array(y)

# 6. 모델 학습 및 저장
model = XGBRegressor(n_estimators=100, max_depth=5)
model.fit(X, y)
joblib.dump(model, 'xgb_model.pkl')
print("✅ 모델 저장 완료: xgb_model.pkl")
