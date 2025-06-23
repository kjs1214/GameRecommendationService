import pandas as pd
from recommendation_knn import (
    load_games_dataset,
    get_user_game_data,
    enrich_user_games_with_genres,
    hybrid_recommendation,
    find_most_similar_user_game_for_each_recommendation
)

if __name__ == "__main__":
    # 1. Steam API 정보
    steam_api_key = "C634EC0EFBF99B5431F2D16C71ECB481"
    steam_id = "76561198349731562"

    # 2. 전체 게임 데이터셋 로드 및 장르 벡터 생성
    games_df, mlb = load_games_dataset()

    # 3. 유저의 플레이 데이터 수집
    user_data = get_user_game_data(steam_api_key, steam_id)

    # 4. 수집한 유저 게임에 장르 정보 추가
    enriched_data = enrich_user_games_with_genres(user_data[:10])  # 상위 10개만 테스트

    recommendations = hybrid_recommendation(enriched_data, games_df, mlb, alpha=0.5, top_n=10)

    user_vector_df = pd.read_csv("user_game_genre_vectorized2.csv")
    genre_cols = [col for col in games_df.columns if col not in ['gameid', 'title', 'genres']]

    similar_results = find_most_similar_user_game_for_each_recommendation(
        recommendations,
        games_df,
        user_vector_df,
        genre_cols
    )

    print("\n[Final Recommendation Result]]")
    for r in similar_results:
        print(f"Reccomend: {r['recommended_title']} (ID: {r['recommended_game_id']})")
