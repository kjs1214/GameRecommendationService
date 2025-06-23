import { useEffect, useState } from "react";
import { fetchRecommendedGames } from "../api/steam";
import GameDetailCard from "../components/GameDetailCard";

interface Game {
	steam_appid: number;
	name: string;
	header_image: string;
	short_description: string;
	price_overview?: {
		final_formatted: string;
	};
}

export default function GameRecommendationPage() {
	const [games, setGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);

	const appIds = ["10", "730", "440", "570", "550"]; // 임시 하드코딩

	useEffect(() => {
		const loadGames = async () => {
			try {
				const result = await fetchRecommendedGames(appIds); // ✅ token 제거
				setGames(result);
			} catch (err) {
				console.error(err);
				alert("추천 게임 정보를 불러오지 못했습니다.");
			} finally {
				setLoading(false);
			}
		};

		loadGames();
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
		<div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-gray-800 dark:to-gray-900 p-6 space-y-8">
			{games.map((game) => (
				<GameDetailCard key={game.steam_appid} game={game} />
			))}
		</div>
	);
}
