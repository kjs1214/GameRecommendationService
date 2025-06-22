// src/api/steam.ts
import axios from "./axios"; // 상대 경로 주의
import { OwnedGame, RecentlyPlayedGame, SteamProfile } from "../types/Steam";

export const fetchSteamProfile = async () => {
	const response = await axios.get("/api/steam/user/me");
	return response.data;
};

export const fetchProfile = async (): Promise<SteamProfile> => {
	const res = await axios.get("/api/steam/user/me");
	return res.data;
};

export const fetchOwnedGames = async (): Promise<OwnedGame[]> => {
	const res = await axios.get("/api/steam/user/me/games");

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

export async function fetchRecommendedGames(appIds: string[], token: string) {
	const response = await axios.post(
		"/api/recommendation/details",
		{ appIds },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data;
}
