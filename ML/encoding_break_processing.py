import pandas as pd

# 파일 불러오기
user_df = pd.read_csv("user_game_genre_vectorized.csv")
game_df = pd.read_csv("Processed_Games_Dataset.csv")

# 열 분리
user_non_genre_cols = ['user_id', 'game_id', 'playtime']
user_genre_cols = [col for col in user_df.columns if col not in user_non_genre_cols]
game_genre_cols = [col for col in game_df.columns if col not in ['gameid', 'title', 'genres']]

# 새로운 DataFrame에 기존 user_df의 비장르 컬럼 복사
aligned_user_df = user_df[user_non_genre_cols].copy()

# 게임 데이터셋의 장르 기준으로 정렬
for genre in game_genre_cols:
    if genre in user_genre_cols:
        aligned_user_df[genre] = user_df[genre]
    else:
        aligned_user_df[genre] = 0  # 없던 장르는 0으로 채움

# 기존에 없던 user_df 장르 컬럼은 무시 (덮어쓰기 방지)

# CSV 저장 (덮어쓰기 방지 위해 이름 다르게)
aligned_user_df.to_csv("user_game_genre_vectorized2.csv", index=False)
