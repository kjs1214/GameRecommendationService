import { useEffect, useState } from "react";
import ProfileSummaryCard from "./components/ProfileSummaryCard";

function App() {
	const [checkingAuth, setCheckingAuth] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// 로그인 후 redirect된 URL에서 token 추출
		const params = new URLSearchParams(window.location.search);
		const token = params.get("token");
		if (token) {
			localStorage.setItem("token", token);
			window.history.replaceState({}, document.title, "/"); // 쿼리스트링 제거
		}

		const savedToken = localStorage.getItem("token");

		// 토큰이 있을 경우 인증 확인 요청
		if (savedToken) {
			fetch("http://localhost:8080/api/auth/me", {
				headers: {
					Authorization: `Bearer ${savedToken}`,
				},
			})
				.then((res) => {
					if (res.ok) {
						setIsAuthenticated(true);
					} else {
						localStorage.removeItem("token");
						window.location.href = "http://localhost:8080/login/steam";
					}
				})
				.catch(() => {
					localStorage.removeItem("token");
					window.location.href = "http://localhost:8080/login/steam";
				})
				.finally(() => setCheckingAuth(false));
		} else {
			window.location.href = "http://localhost:8080/login/steam";
		}
	}, []);

	if (checkingAuth) return <div>인증 확인 중...</div>;

	return (
		<div style={{ padding: "2rem" }}>
			<h1>GAMELIER - 내 게임 활동 요약</h1>
			<ProfileSummaryCard />
		</div>
	);
}

export default App;
