
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";    


import Profile_Temp from "./components/Profile_Temp";
import GameTrendTemp from './components/GameTrend_temp';
import "./index.css";
import GameRecommendTemp from "./components/GameRecommendTemp";
import MainPage from "./components/MainPage";

interface SteamUserInfo {
  steamId: string;
  iconUrl: string;
  personaName: string;
}

export default function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userInfo, setUserInfo] = useState<SteamUserInfo | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
    }

    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setCheckingAuth(false);
      return;
    }

    fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(async (res) => {
        if (res.ok) {

          const data = (await res.json()) as SteamUserInfo;
		  console.log("App.tsx /api/auth/me response:", data);
          setUserInfo(data);
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  if (checkingAuth) {
    return <div className="text-center mt-10">인증 확인 중...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<MainPage userInfo={userInfo} />} />
      <Route path="/profile" element={<Profile_Temp />} />
      <Route path="/recommend" element={<GameRecommendTemp />} />
      <Route path="/trend" element={<GameTrendTemp />} />
      
    </Routes>
  );
}
