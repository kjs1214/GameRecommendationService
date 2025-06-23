import { useEffect, useState } from "react";
import GameCarouselSection from "../components/GameCarouselSection";
import { fetchRecommendedGames } from "../api/steam";
import axios from "../api/axios"; // ✅ axios 인스턴스 import

interface Game {
	appid: number;
	name: string;
	imageUrl: string;
	price?: string;
}

export default function GameTrendPage() {
	const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
	const [popularGames, setPopularGames] = useState<Game[]>([]);
	const [discountedGames, setDiscountedGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);

	const appIds = ["10", "730", "440", "570", "550"];

	useEffect(() => {
		const loadAll = async () => {
			try {
				// 추천 게임 (기존 fetchRecommendedGames 함수 사용)
				const recommended = await fetchRecommendedGames(
					appIds,
					localStorage.getItem("token") ?? ""
				);
				setRecommendedGames(
					recommended.map((g) => ({
						appid: g.steam_appid,
						name: g.name,
						imageUrl: g.header_image,
						price: g.price_overview?.final_formatted ?? "",
					}))
				);

				// 인기 게임 (axios 사용)
				const popularRes = await axios.get("/steam/popular");
				setPopularGames(popularRes.data);

				// 할인 게임 (axios 사용)
				const discountRes = await axios.get("/steam/discounts");
				setDiscountedGames(discountRes.data);
			} catch (err) {
				console.error(err);
				alert("게임 데이터를 불러오는 중 오류가 발생했습니다.");
			} finally {
				setLoading(false);
			}
		};

		loadAll();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen text-xl text-gray-700">
				로딩 중...
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-white to-orange-100 dark:from-gray-800 dark:to-gray-900 p-6">
			<GameCarouselSection title="GAMELIER의 추천" games={recommendedGames} />
			<GameCarouselSection title="인기 게임" games={popularGames} />
			<GameCarouselSection title="할인 중" games={discountedGames} />
		</div>
	);
}
