import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GameRecommendationPage from "./pages/GameRecommendationPage";
import LoginSuccessPage from "./pages/LoginSuccessPage";
import GameTrendPage from "./pages/GameTrendPage";
import "./index.css";
import axios from "./api/axios"; // ✅ axios 인스턴스 import

function App() {
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [userInfo, setUserInfo] = useState(null);

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

		axios
			.get("/auth/me") // ✅ 인터셉터가 자동으로 토큰 붙여줌
			.then((res) => setUserInfo(res.data))
			.catch(() => localStorage.removeItem("token"))
			.finally(() => setCheckingAuth(false));
	}, []);

	if (checkingAuth) {
		return <div className="text-center mt-10">인증 확인 중...</div>;
	}

	return (
		<Routes>
			<Route path="/" element={<Home userInfo={userInfo} />} />
			<Route path="/recommendations" element={<GameRecommendationPage />} />
			<Route path="/trend" element={<GameTrendPage />} />
			<Route path="/login/success" element={<LoginSuccessPage />} />
		</Routes>
	);
}

export default App;
