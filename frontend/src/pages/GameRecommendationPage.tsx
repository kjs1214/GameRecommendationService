import { useEffect, useState } from "react";
import { fetchRecommendedGames } from "../api/steam";
import GameCard from "../components/GameCard"; // 추천 게임 카드 컴포넌트

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
				const token = localStorage.getItem("token") ?? "";
				const result = await fetchRecommendedGames(appIds, token);
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

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-gray-800 dark:to-gray-900 p-6">
			<h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
				추천 게임 목록
			</h2>

			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{games.map((game) => (
					<GameCard key={game.steam_appid} game={game} />
				))}
			</div>
		</div>
	);
}
