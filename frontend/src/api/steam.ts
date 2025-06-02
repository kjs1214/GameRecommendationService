import axios from "axios";
import { OwnedGame, RecentlyPlayedGame, SteamProfile } from "../types/Steam";

export const fetchSteamProfile = async () => {
    const response = await axios.get("http://localhost:8080/api/steam/user/me", {
        withCredentials: true, // 세션 유지용
    });
    return response.data;
};
axios.defaults.withCredentials = true;

export const fetchProfile = async (): Promise<SteamProfile> => {
    const res = await axios.get("/api/steam/user/me");
    return res.data;
};

export const fetchOwnedGames = async (): Promise<OwnedGame[]> => {
    const res = await axios.get("/api/steam/user/me/games");

    // ✅ 실제 응답이 배열인지 확인하여 안전하게 반환
    if (Array.isArray(res.data)) {
        return res.data;
    } else {
        console.error("❌ API 응답이 배열이 아닙니다:", res.data);
        return [];
    }
};
export const fetchRecentGames = async (): Promise<RecentlyPlayedGame[]> => {
    const res = await axios.get("/api/steam/user/me/recent-games");
    return res.data;
};