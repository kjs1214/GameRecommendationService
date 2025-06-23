// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import GenreDonutChart from "../components/GenreDonutChart";

interface GenreData {
	name: string;
	value: number;
}

interface TopGame {
	name: string;
	playtime: number;
}

export default function ProfilePage() {
	const [genreData, setGenreData] = useState<GenreData[]>([]);
	const [topGames, setTopGames] = useState<TopGame[]>([]);
	const [userName, setUserName] = useState("JM-2025"); // TODO: 실제 데이터로 교체
	const [dominantGenre, setDominantGenre] = useState("FPS");
	const [userType, setUserType] = useState("모험가");

	useEffect(() => {
		// TODO: 실제 API로 교체
		setGenreData([
			{ name: "FPS", value: 30 },
			{ name: "Coop Action", value: 25 },
			{ name: "RPG", value: 20 },
			{ name: "ASG", value: 15 },
			{ name: "Puzzle", value: 10 },
		]);

		setTopGames([
			{ name: "배틀그라운드", playtime: 120 },
			{ name: "Stardew Valley", playtime: 95 },
			{ name: "Dark Souls 3", playtime: 70 },
			{ name: "Monster Hunter: World", playtime: 60 },
			{ name: "Portal 2", playtime: 45 },
		]);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#e8dafc] to-[#d4f1f4] p-8 font-sans">
			<div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
				<h2 className="text-2xl font-bold mb-2 text-center text-gray-700 dark:text-white">
					‘{userName}’ 님의 <br />{" "}
					<span className="text-purple-500">Game Playtime 분석</span>
				</h2>

				<div className="flex flex-col md:flex-row items-center justify-center gap-8 my-8">
					<GenreDonutChart data={genreData} />
					<div className="text-center">
						<p className="text-lg text-gray-700 dark:text-gray-200">
							최근에는 <strong>{dominantGenre}</strong> 장르를 주로
							즐겨하셨군요!
						</p>
						<button className="mt-4 px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded shadow">
							→ 다른 {dominantGenre} 게임 추천 받기
						</button>
					</div>
				</div>

				<div className="mt-8">
					<h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
						내가 가장 많이 플레이한 게임 TOP 5
					</h3>
					<div className="space-y-2">
						{topGames.map((game, index) => (
							<div
								key={index}
								className={`bg-gradient-to-r from-${
									["rose", "green", "emerald", "amber", "sky"][index % 5]
								}-300 to-white rounded p-2 font-semibold text-gray-800`}
							>
								{index + 1}. {game.name}
							</div>
						))}
					</div>
				</div>

				<div className="mt-10 text-center">
					<p className="text-lg text-gray-700 dark:text-gray-200">
						종합적으로 당신의 유형은... <br />
						<strong>[{userType}]</strong> 입니다 <br />
						다양한 게임을 체험하며 많은 경험을 쌓고 계시네요!
					</p>

					<button className="mt-6 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow">
						→ AI로 나에게 맞는 게임 추천 받기
					</button>
				</div>
			</div>
		</div>
	);
}
