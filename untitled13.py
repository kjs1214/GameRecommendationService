
import glob
import os
import json
import pandas as pd
import os
print("현재 실행 중인 경로:", os.getcwd())

json_files = glob.glob(r"C:\Users\User\Desktop\archive\reviews\**\*.json", recursive=True)

print(f"실제 JSON 파일 수: {len(json_files)}")

rows = []

for path in json_files:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content_raw = f.read()

        if not content_raw.strip():
            print(f" 빈 파일 건너뜀: {path}")
            continue 

        content = json.loads(content_raw)
        reviews = content.get("reviews", [])
        for r in reviews:
            rows.append({
                "steam_id": str(r["author"]["steamid"]), 
                "game_id": os.path.basename(os.path.dirname(path)),
                "playtime": r["author"]["playtime_forever"],
                "liked": int(r["author"]["playtime_forever"]>=60)
            })
    except Exception as e:
        print(f"[에러] {path}: {e}")

print(f"추출된 리뷰 수: {len(rows)}")

df = pd.DataFrame(rows)
df.to_csv("user_game_played_data.csv", index=False, encoding="utf-8-sig")
print(" CSV 저장 완료 → user_game_played_data.csv")