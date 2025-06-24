// GameRecommendationPage.tsx
import React, { useEffect, useState } from "react";
import GameDetailCard from "../components/GameDetailCard";
import { fetchProfile, fetchRecommendedGames } from "../api/steam";
import { Home } from "lucide-react";

interface Game {
	steam_appid: number;
	name: string;
	header_image: string;
	short_description: string;
	summary: string;
	price_overview?: { final_formatted: string };
}

const cachedRecommendedGames: {
	username: string | null;
	games: Game[];
} = {
	username: null,
	games: [],
};

export default function GameRecommendationPage() {
	const [username, setUsername] = useState<string | null>(
		cachedRecommendedGames.username
	);
	const [games, setGames] = useState<Game[]>(cachedRecommendedGames.games);
	const [loading, setLoading] = useState(
		cachedRecommendedGames.games.length === 0
	);

	useEffect(() => {
		const load = async () => {
			if (cachedRecommendedGames.games.length > 0) return;

			try {
				const profile = await fetchProfile();
				const steamid = profile.steamid;

				const recommended = await fetchRecommendedGames(steamid);

				cachedRecommendedGames.username = profile.personaname;
				cachedRecommendedGames.games = recommended;

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
			{/* Header with home button */}
			<header className="relative w-full mb-10">
				<div className="w-full h-[72px] flex items-center justify-center px-6 bg-[#edeff7] relative">
					<a href="/" className="absolute right-6">
						<Home className="w-8 h-8 text-black hover:text-orange-500" />
					</a>
					<div className="flex items-center">
						<img
							src="/GameRogo.png"
							alt="Gamelier Logo"
							className="w-16 h-16"
						/>
						<h1 className="font-extrabold text-black text-[40px] ml-2">
							GAMELIER
						</h1>
					</div>
				</div>
				<div className="w-full h-[3px] bg-black" />
			</header>

			<div className="mb-8 text-center">
				<h2 className="text-lg text-gray-400">
					{username ? `${username}님을 위한 게임 추천` : "로딩 중..."}
				</h2>
				<h1 className="text-3xl font-bold text-white">GAMELIER&apos;s PICK</h1>
			</div>

			<div className="space-y-8">
				{games.map((game) => (
					<GameDetailCard key={game.steam_appid} game={game} />
				))}
			</div>
		</div>
	);
}
