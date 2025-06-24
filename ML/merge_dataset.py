import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
import ast

# 1. 데이터 불러오기
user_df = pd.read_csv("filtered_user_game_data.csv")      # 'game_id' 포함
genre_df = pd.read_csv("game_genres_fetched.csv")         # 'gameid' 포함

# 2. 'gameid' → 'game_id' 로 컬럼명 맞추기
genre_df.rename(columns={'gameid': 'game_id'}, inplace=True)

# 3. genres 컬럼을 리스트로 변환
genre_df['genres'] = genre_df['genres'].apply(
    lambda x: ast.literal_eval(x) if isinstance(x, str) else [])

# 4. genres 비어있는 행 제거
genre_df = genre_df[genre_df['genres'].map(len) > 0]

# 5. 병합
merged_df = pd.merge(user_df, genre_df, on="game_id", how="inner")

# 6. 장르 One-hot 인코딩
mlb = MultiLabelBinarizer()
genre_encoded = pd.DataFrame(mlb.fit_transform(merged_df['genres']), columns=mlb.classes_)

# 7. 결과 결합
merged_df = pd.concat([merged_df.drop(columns=['genres']), genre_encoded], axis=1)

# 8. 확인 또는 저장
merged_df.to_csv("user_game_genre_vectorized.csv", index=False)
