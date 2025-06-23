// GameRecommendationPage.tsx
import React, { useEffect, useState } from "react";
import GameDetailCard from "../components/GameDetailCard";
import { fetchProfile, fetchRecommendedGames } from "../api/steam";

interface Game {
	steam_appid: number;
	name: string;
	header_image: string;
	short_description: string;
	price_overview?: { final_formatted: string };
}

export default function GameRecommendationPage() {
	const [username, setUsername] = useState<string | null>(null);
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const load = async () => {
			try {
				const token = localStorage.getItem("token") ?? "";
				const appIds = ["10", "730", "440", "570", "550"];

				// 프로필과 추천 게임을 병렬로 가져오기
				const [profile, recommended] = await Promise.all([
					fetchProfile(),
					fetchRecommendedGames(appIds),
				]);

				setUsername(profile.personaname);
				setGames(recommended);
			} catch (err) {
				console.error(err);
				alert("추천 게임 정보를 불러오지 못했습니다.");
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen text-xl text-gray-700">
				로딩 중...
			</div>
		);
	}

	if (games.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-screen text-xl text-gray-500">
				추천 게임이 없습니다.
			</div>
		);
	}

	return (
		<div className="px-6 py-8">
			{/* Hero Header: 한 번만 */}
			<div className="mb-8 text-center">
				<h2 className="text-lg text-gray-400">
					{username ? `${username}님을 위한 게임 추천` : "로딩 중..."}
				</h2>
				<h1 className="text-3xl font-bold text-white">GAMELIER&apos;s PICK</h1>
			</div>

			{/* 게임 카드 리스트 */}
			<div className="space-y-8">
				{games.map((game) => (
					<GameDetailCard key={game.steam_appid} game={game} />
				))}
			</div>
		</div>
	);
}
