import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginSuccessPage() {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get("token");
		if (token) {
			localStorage.setItem("token", token);
			setTimeout(() => navigate("/"), 100); // 아주 짧게 딜레이
		}
	}, [location, navigate]);

	return <div>로그인 중...</div>;
}
