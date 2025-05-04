import { useEffect, useState } from "react";
import { fetchSteamProfile } from "./api/steam";

type SteamProfile = {
  steamid: string;
  personaname: string;
  avatar: string;
  profileurl: string;
};

function App() {
  const [profile, setProfile] = useState<SteamProfile | null>(null);

  useEffect(() => {
    fetchSteamProfile()
      .then(setProfile)
      .catch(() => setProfile(null));
  }, []);

  return (
    <div>
      <h1>Steam 사용자 정보</h1>
      {profile ? (
        <div>
          <img src={profile.avatar} alt="avatar" />
          <p>{profile.personaname}</p>
          <a href={profile.profileurl} target="_blank" rel="noreferrer">
            Steam 프로필로 이동
          </a>
        </div>
      ) : (
        <p>로그인된 사용자가 없습니다.</p>
      )}
    </div>
  );
}

export default App;
