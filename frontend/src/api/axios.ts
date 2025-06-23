import axios from "axios";

const instance = axios.create({
	baseURL: "http://localhost:8080/api",
});

// 요청 인터셉터: 매 요청마다 토큰 자동 추가
instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

export default instance;
