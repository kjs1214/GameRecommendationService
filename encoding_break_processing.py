import pandas as pd

# CSV 불러오기
df = pd.read_csv("user_game_genre_vectorized.csv")

# 열 이름 중에서 이상한(한글깨짐/문자깨짐/특수문자 포함) 열 필터링
valid_columns = df.columns[df.columns.str.match(r'^[\w\s&]+$')]
df = df[valid_columns]

# 필수 열 다시 포함 (user_id, game_id, playtime)
required = ['user_id', 'game_id', 'playtime']
for col in required:
    if col not in df.columns:
        df[col] = None  # 혹시 필터링으로 빠졌을 경우 복구

# 결과 확인 및 저장
df.to_csv("cleaned_user_genre_data.csv", index=False)
print(" 깨진 열 제거 완료 및 저장: cleaned_user_genre_data.csv")
