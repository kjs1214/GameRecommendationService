import React, { useEffect, useState } from "react";

interface Game {
	steam_appid: number;
	name: string;
	header_image: string;
	short_description: string;
	price_overview?: {
		final_formatted: string;
	};
}

interface Review {
	recommendationid: string;
	review: string;
	voted_up: boolean;
	timestamp_created: number;
	author: {
		steamid: string;
		num_games_owned: number;
	};
	votes_up: number;
	votes_funny: number;
}

interface Props {
	game: Game;
}

export default function GameDetailCard({ game }: Props) {
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		const fetchReviews = async () => {
			const token = localStorage.getItem("token") ?? "";
			const res = await fetch(`/api/review/${game.steam_appid}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await res.json();
			setReviews(data);
		};

		fetchReviews();
	}, [game.steam_appid]);

	const topReviews = [...reviews]
		.sort((a, b) => b.votes_up - a.votes_up)
		.slice(0, 4);

	const recentReviews = [...reviews].slice(0, 4);

	return (
		<div className="p-6 bg-white rounded-xl shadow-md">
			<div className="flex flex-col md:flex-row gap-6">
				<img src={game.header_image} alt={game.name} className="rounded-lg" />
				<div className="flex flex-col gap-2">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-black">
						{game.name}
					</h2>
					<p className="text-gray-700 dark:text-black-300">
						{game.short_description}
					</p>
					<p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
						{game.price_overview?.final_formatted ?? "무료"}
					</p>
					<a
						href={`https://store.steampowered.com/app/${game.steam_appid}`}
						target="_blank"
						className="mt-2 text-sm text-white bg-black px-4 py-2 rounded hover:bg-black-900"
						rel="noreferrer"
					>
						→ Steam에서 확인하기
					</a>
				</div>
			</div>

			{/* 리뷰 섹션 */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
				<div className="md:col-span-2">
					<h3 className="font-bold mb-2 text-lg text-gray-800 dark:text-black">
						가장 많은 공감을 받은 리뷰
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{topReviews.map((r) => (
							<div
								key={r.recommendationid}
								className="p-3 border rounded shadow bg-gray-50 dark:bg-gray-700"
							>
								<p className="font-medium">
									{r.voted_up ? "👍 추천" : "👎 비추천"}
								</p>
								<p className="text-sm text-gray-600 dark:text-gray-300">
									공감 {r.votes_up} · 재미 {r.votes_funny}
								</p>
								<p className="text-sm mt-2 text-gray-800 dark:text-gray-100 line-clamp-4">
									{r.review}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
