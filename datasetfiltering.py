import pandas as pd
import requests
import time
import os

# 설정
INPUT_CSV = "filtered_user_game_data.csv"
GENRE_CSV = "game_genres_fetched.csv"
RETRIES = 3
DELAY = 1  # 요청 간 딜레이 (초)

# 1. 전체 game_id 수집
user_df = pd.read_csv(INPUT_CSV)
user_df['game_id'] = user_df['game_id'].astype(str)
all_game_ids = set(user_df['game_id'].unique())

# 2. 기존 장르 데이터 불러오기 또는 빈 DataFrame 생성
if os.path.exists(GENRE_CSV):
    genre_df = pd.read_csv(GENRE_CSV)
    genre_df['gameid'] = genre_df['gameid'].astype(str)
else:
    genre_df = pd.DataFrame(columns=["gameid", "genres"])

existing_ids = set(genre_df['gameid'])
missing_ids = list(all_game_ids - existing_ids)
print(f" 수집 대상 게임 수: {len(missing_ids)}")

# 3. API 요청 함수
def fetch_genres(appids):
    result = []
    for appid in appids:
        attempt = 0
        genres = []
        while attempt < RETRIES:
            try:
                url = f"https://store.steampowered.com/api/appdetails?appids={appid}"
                response = requests.get(url, timeout=5)
                if response.status_code == 200:
                    data = response.json().get(str(appid), {}).get("data", {})
                    genres = [g["description"] for g in data.get("genres", [])]
                    break
            except Exception as e:
                print(f"[RETRY {attempt+1}] AppID {appid} 실패: {e}")
            time.sleep(DELAY)
            attempt += 1

        if not genres:
            print(f"[WARN] AppID {appid} 장르 없음 또는 실패")
        result.append({"gameid": str(appid), "genres": genres})
        time.sleep(1)  # Steam API rate limit 회피
    return pd.DataFrame(result)

# 4. 수집 및 저장
if missing_ids:
    new_genres_df = fetch_genres(missing_ids)
    updated_df = pd.concat([genre_df, new_genres_df], ignore_index=True)
    updated_df.to_csv(GENRE_CSV, index=False)
    print(f" 장르 {len(new_genres_df)}개 수집 및 저장 완료")
else:
    print(" 모든 게임의 장르 정보가 이미 수집 완료되었습니다!")
