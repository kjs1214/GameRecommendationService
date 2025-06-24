import pandas as pd
import numpy as np
import joblib
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score

df = pd.read_csv("user_game_genre_vectorized2.csv")  # user_id, game_id, playtime, 장르벡터 포함

df['user_id'] = df['user_id'].astype(str)
df['game_id'] = df['game_id'].astype(str)
df['target'] = (df['playtime'] >= 60).astype(int)

genre_cols = [col for col in df.columns if col not in ['user_id', 'game_id', 'playtime', 'target']]

X = df[genre_cols]
y = df['target']

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBClassifier(eval_metric='logloss')
model.fit(X_train, y_train)

probas = model.predict_proba(X_val)
preference_probabilities = probas[:, 1]
y_pred = (preference_probabilities >= 0.5).astype(int)

acc = accuracy_score(y_val, y_pred)
print(f"Validation Accuracy: {acc:.4f}")
f1=f1_score(y_val, y_pred)
print(f"F1 Score: {f1:4f}")

probas=model.predict_proba(X_val)
print(probas)

joblib.dump(model, "xgb_game_preference_model.pkl")

