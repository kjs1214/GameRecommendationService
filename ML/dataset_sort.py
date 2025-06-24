import pandas as pd

# 파일 경로
user_file = "user_game_genre_vectorized2.csv"
processed_file = "Processed_Games_Dataset.csv"

# 파일 읽기
user_df = pd.read_csv(user_file)
processed_df = pd.read_csv(processed_file)

# 기준이 되는 장르 열 추출 (user_df에서 user_id, game_id, playtime 제외)
genre_cols = [col for col in user_df.columns if col not in ['user_id', 'game_id', 'playtime']]

# processed_df에서 장르 벡터 추출
processed_base = processed_df[['gameid', 'title', 'genres']].copy()

# 장르 벡터 열 정리
processed_genres = pd.DataFrame(columns=genre_cols)

# 기존 processed_df에 있는 장르 열 중 user_df 기준에 포함된 것만 채우기
for col in genre_cols:
    if col in processed_df.columns:
        processed_genres[col] = processed_df[col]
    else:
        processed_genres[col] = 0  # 없는 열은 0으로 채움

# 재조합
processed_reordered = pd.concat([processed_base, processed_genres], axis=1)

# 저장
processed_reordered.to_csv("Processed_Games_Dataset2.csv", index=False)