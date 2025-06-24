from flask import Flask, request, jsonify
from summarizer import summarize_reviews, fetch_reviews
from recommendation_knn import (
    load_games_dataset,
    get_user_game_data,
    enrich_user_games_with_genres,
    hybrid_recommendation
)
import requests

app = Flask(__name__)

@app.route("/recommend-summary", methods=["GET"])
def recommend_summary():
    steam_id = request.args.get("steamid")
    api_key = request.args.get("apikey")

    if not steam_id or not api_key:
        return jsonify({"error": "Missing steamid or apikey"}), 400

    # 1. 데이터 준비
    games_df, mlb = load_games_dataset()
    user_data = get_user_game_data(api_key, steam_id)
    if not user_data:
        return jsonify({"error": "No user data found"}), 404

    enriched_data = enrich_user_games_with_genres(user_data[:10])
    recommendations = hybrid_recommendation(enriched_data, games_df, mlb, alpha=0.5, top_n=5)

    # 2. 각 추천 게임에 대해 요약 수집
    result = []
    for gameid, title, _ in recommendations:
        reviews = fetch_reviews(gameid, 30)
        summary = summarize_reviews(reviews)
        result.append({
            "gameid": gameid,
            "title": title,
            "summary": summary
        })

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
