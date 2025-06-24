import axios from "./axios";
import { OwnedGame, RecentlyPlayedGame, SteamProfile } from "../types/Steam";

export interface RecommendedGame {
	steam_appid: number;
	name: string;
	header_image: string;
	short_description: string;
	summary: string;
	price_overview?: {
		final_formatted: string;
	};
	genres?: { description: string }[];
}

export const fetchSteamProfile = async (): Promise<SteamProfile> => {
	const response = await axios.get("api/steam/user/me");
	return response.data;
};

export const fetchProfile = async (): Promise<SteamProfile> => {
	const res = await axios.get("api/steam/user/me");
	return res.data;
};

export const fetchOwnedGames = async (): Promise<OwnedGame[]> => {
	const res = await axios.get("api/steam/user/me/games");
	if (Array.isArray(res.data)) return res.data;
	console.error("❌ API 응답이 배열이 아닙니다:", res.data);
	return [];
};

export const fetchRecentGames = async (): Promise<RecentlyPlayedGame[]> => {
	const res = await axios.get("api/steam/user/me/recent-games");
	return res.data;
};

// ✅ 수정된 추천 게임 요청: steamid만 사용
export const fetchRecommendedGames = async (
	steamid: string
): Promise<RecommendedGame[]> => {
	const res = await axios.get("/api/recommendation/with-summary", {
		params: { steamid },
	});
	return res.data;
};

export const fetchGameReviews = async (appId: string) => {
	const response = await axios.get(`api/review/${appId}`);
	return response.data;
};
