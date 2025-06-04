import { useEffect, useState } from "react";
import Home from "./pages/Home";
import "./index.css";

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

		fetch("http://localhost:8080/api/auth/me", {
			headers: {
				Authorization: `Bearer ${savedToken}`,
			},
		})
			.then(async (res) => {
				if (res.ok) {
					const data = await res.json();
					setUserInfo(data);
				} else {
					localStorage.removeItem("token");
				}
			})
			.catch(() => {
				localStorage.removeItem("token");
			})
			.finally(() => setCheckingAuth(false));
	}, []);

	if (checkingAuth) {
		return <div className="text-center mt-10">인증 확인 중...</div>;
	}

	return <Home userInfo={userInfo} />;
}

export default App;
