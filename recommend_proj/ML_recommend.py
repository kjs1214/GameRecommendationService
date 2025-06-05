import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recommend_proj.settings')
os.chdir(os.path.dirname(os.path.abspath(__file__)))  # 현재 파일 위치로 이동
django.setup()
import pandas as pd
import pymysql
from sklearn.metrics.pairwise import cosine_similarity
import xgboost as xgb
from sklearn.model_selection import train_test_split
from django.http import HttpResponse
from rest_framework.status import HTTP_201_CREATED
from recommend_app.models import GameHistory, GameSmall, Game, Image, Recommendation


def A(df, userid, steamid):
    dtypes = {'steam_id': int, 'game_id': int, 'playtime': int}
    user_game = GameHistory.objects.filter(user=userid)
    
    for game in user_game:
        exists_game = GameSmall.objects.filter(game_id=game.game.game_id)
        try:
            if exists_game:
                gameid = game.game.game_id
                playtime = game.total_play_game
                game_df = df[df['game_id'] == gameid]
                game_df['playtime_diff'] = abs(game_df['playtime'] - playtime)
                game_df_sorted = game_df.sort_values('playtime_diff')
                closest_rating = game_df_sorted[game_df_sorted['steam_id'] != steamid].iloc[0]['rating']
                new_row = {'steam_id': steamid, 'game_id': gameid, 'playtime': playtime, 'rating': closest_rating}
                df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        except:
            pass
    return df.astype(dtypes)

def get_recommend(user, neighbor_list, df):
    user_games = df[df['steam_id'] == user]
    candidates = []
    for neighbor in neighbor_list:
        temp = df[(df['steam_id'] == neighbor) & (~df['game_id'].isin(user_games['game_id']))]
        for _, game in temp.iterrows():
            candidates.append((int(game['game_id']), game['rating']))
    
    candidates.sort(key=lambda x: x[0])
    rec_list = []
    flag = None
    running_sum = 0
    count = 0
    for game_id, rating in candidates:
        if game_id != flag:
            if flag is not None:
                rec_list.append((flag, running_sum / count))
            flag = game_id
            running_sum = rating
            count = 1
        else:
            running_sum += rating
            count += 1
    if count > 0:
        rec_list.append((flag, running_sum / count))

    return sorted(rec_list, key=lambda x: x[1], reverse=True)

def train_xgb_model(df):
    df = df.dropna(subset=['rating'])
    X = df[['playtime']]
    y = df['rating']
    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
    model = xgb.XGBRegressor(n_estimators=100, max_depth=5)
    model.fit(X_train, y_train)
    return model

def rerank_with_xgb(model, candidates_df):
    X = candidates_df[['playtime']]
    candidates_df['xgb_score'] = model.predict(X)
    return candidates_df.sort_values(by='xgb_score', ascending=False)

def get_recommended_games_small(request, user_id):
    conn = pymysql.connect(
        host="43.201.61.185",
        user="root",
        password="banapresso77",
        db="gamemakase",
        charset="utf8",
        cursorclass=pymysql.cursors.DictCursor
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM gamemakase.rating_small")
    result = cursor.fetchall()
    df = pd.DataFrame(result)

    user_steamid = user_id
    df = A(df, user_id, user_steamid)

    pivot_table = pd.pivot_table(df, values='rating', index='steam_id', columns='game_id')
    cos_sim_matrix = cosine_similarity(pivot_table.fillna(0))
    cos_sim_df = pd.DataFrame(cos_sim_matrix, columns=pivot_table.index, index=pivot_table.index)

    try:
        knn = list(cos_sim_df[user_steamid].sort_values(ascending=False)[:30].index)
    except Exception as e:
        print(user_steamid, e)
        return HttpResponse(status=HTTP_201_CREATED)

    recommend = get_recommend(user_steamid, knn, df)

    # 추천 리스트를 DataFrame으로 변환 후 playtime 병합
    recommend_df = pd.DataFrame(recommend, columns=['game_id', 'avg_rating'])
    user_play_df = df[df['steam_id'] == user_steamid][['game_id', 'playtime']].drop_duplicates()
    recommend_df = recommend_df.merge(user_play_df, on='game_id', how='left')

    # XGBoost 모델 학습 후 재정렬
    model = train_xgb_model(df)
    reranked_df = rerank_with_xgb(model, recommend_df)

    # 추천 결과 저장
    Recommendation.objects.filter(steam_id=user_steamid).delete()
    for _, row in reranked_df.head(100).iterrows():
        try:
            game = Game.objects.get(game_id=row['game_id'])
            Recommendation(steam_id=user_steamid, game_id=game.game_id, rating=row['xgb_score']).save()
        except Exception as e:
            print(row['game_id'], e)

    conn.close()
    return HttpResponse(status=HTTP_201_CREATED)
