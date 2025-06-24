import axios from "./axios";
import { OwnedGame, RecentlyPlayedGame, SteamProfile } from "../types/Steam";

// ✅ price_overview 타입 확장 & is_free 추가
export interface RecommendedGame {
	steam_appid: number;
	name: string;
	header_image: string;
	short_description: string;
	summary: string;
	price_overview?: {
		currency: string;
		initial: number;
		final: number;
		discount_percent: number;
		final_formatted: string;
	};
	genres?: { description: string }[];
	is_free?: boolean;
}

// 프로필
export const fetchSteamProfile = async (): Promise<SteamProfile> => {
	const response = await axios.get("api/steam/user/me");
	return response.data;
};

export const fetchProfile = async (): Promise<SteamProfile> => {
	const res = await axios.get("api/steam/user/me");
	return res.data;
};

// 보유 게임
export const fetchOwnedGames = async (): Promise<OwnedGame[]> => {
	const res = await axios.get("api/steam/user/me/games");
	if (Array.isArray(res.data)) return res.data;
	console.error("❌ API 응답이 배열이 아닙니다:", res.data);
	return [];
};

// 최근 플레이 게임
export const fetchRecentGames = async (): Promise<RecentlyPlayedGame[]> => {
	const res = await axios.get("api/steam/user/me/recent-games");
	return res.data;
};

// 추천 게임 (요약 포함)
export const fetchRecommendedGames = async (
	steamid: string
): Promise<RecommendedGame[]> => {
	const res = await axios.get("/api/recommendation/with-summary", {
		params: { steamid },
	});
	return res.data;
};

// 게임 리뷰 가져오기
export const fetchGameReviews = async (appId: string) => {
	const response = await axios.get(`api/review/${appId}`);
	return response.data;
};
