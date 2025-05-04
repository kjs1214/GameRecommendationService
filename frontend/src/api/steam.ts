import axios from "axios";

export const fetchSteamProfile = async () => {
    const response = await axios.get("http://localhost:8080/api/steam/user/me", {
        withCredentials: true, // 세션 유지용
    });
    return response.data;
};
