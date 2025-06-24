// GameTrendPage.tsx
import { useEffect, useState, useRef } from "react";
import { fetchProfile, fetchRecommendedGames } from "../api/steam";
import axios from "../api/axios";
import { Carousel, CarouselItem } from "../components/ui/carousel";
import { Home } from "lucide-react";
import type { JSX } from "react";

interface Game {
	appid: number;
	title: string;
	imageUrl: string;
}

const cached = {
	recommendedGames: null as Game[] | null,
	popularGames: null as Game[] | null,
	discountedGames: null as Game[] | null,
};

const GameCard: React.FC<Game> = ({ appid, title, imageUrl }) => {
	return (
		<a
			href={`https://store.steampowered.com/app/${appid}`}
			target="_blank"
			rel="noopener noreferrer"
			className="flex flex-col w-full items-start gap-1"
		>
			<div
				className="relative w-full h-[300px] rounded-lg border-[5px] border-solid border-[#ff8b60] bg-cover bg-center"
				style={{ backgroundImage: `url(${imageUrl})` }}
			/>
			<div className="font-extrabold text-white text-[18px] text-left w-full truncate">
				{title}
			</div>
		</a>
	);
};

export default function GameTrendPage(): JSX.Element {
	const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
	const [popularGames, setPopularGames] = useState<Game[]>([]);
	const [discountedGames, setDiscountedGames] = useState<Game[]>([]);
	const [loading, setLoading] = useState(true);

	const hasFetched = useRef(false);

	useEffect(() => {
		const loadAll = async () => {
			if (hasFetched.current) return;
			hasFetched.current = true;

			try {
				if (
					cached.recommendedGames &&
					cached.popularGames &&
					cached.discountedGames
				) {
					setRecommendedGames(cached.recommendedGames);
					setPopularGames(cached.popularGames);
					setDiscountedGames(cached.discountedGames);
					setLoading(false);
					return;
				}

				const profile = await fetchProfile();
				const steamid = profile.steamid;

				const rec = await fetchRecommendedGames(steamid);
				const recommended = rec.map((g) => ({
					appid: g.steam_appid,
					title: g.name,
					imageUrl: g.header_image,
				}));
				setRecommendedGames(recommended);
				cached.recommendedGames = recommended;

				const popRes = await axios.get("api/steam/popular");
				const popular = popRes.data
					.filter((g: any) => g.name !== "Steam Deck")
					.map((g: any) => ({
						appid: g.appid,
						title: g.name,
						imageUrl: g.imageUrl,
					}));
				setPopularGames(popular);
				cached.popularGames = popular;

				const disRes = await axios.get("api/steam/discounts");
				const discounted = disRes.data
					.filter((g: any) => g.name !== "Steam Deck")
					.map((g: any) => ({
						appid: g.appid,
						title: g.name,
						imageUrl: g.imageUrl,
					}));
				setDiscountedGames(discounted);
				cached.discountedGames = discounted;
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
			<header className="w-full relative mb-6">
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
						<h1 className="font-extrabold text-black text-[50px] ml-2">
							G A M E L I E R
						</h1>
					</div>
				</div>
				<div className="w-full h-[3px] bg-black" />
			</header>

			<section className="relative w-full h-[400px] mb-16 bg-gradient-to-b from-[#001f3f] to-[#003366] rounded-lg overflow-hidden">
				<h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-extrabold text-white text-[60px] drop-shadow-xl text-center">
					트렌드를 직접 보고 분석해보세요
				</h1>
				<img
					className="absolute w-[300px] h-auto bottom-0 left-10"
					alt="Illustration"
					src="/woman_img.png"
				/>
			</section>

			<section className="relative w-full max-w-[1731px] mx-auto mb-16">
				<h2 className="pl-8 font-extrabold text-white text-[32px] mb-4">
					GAMELIER의 추천
				</h2>
				<Carousel className="w-full overflow-hidden">
					{recommendedGames.map((g) => (
						<CarouselItem key={g.appid} className="flex-none w-[20%] mr-4">
							<GameCard {...g} />
						</CarouselItem>
					))}
				</Carousel>
			</section>

			<img className="w-full h-[8px] mb-16" alt="Line" src="/Line.png" />

			<section className="relative w-full max-w-[1731px] mx-auto mb-16">
				<h2 className="pl-8 font-extrabold text-white text-[32px] mb-4">
					인기 게임
				</h2>
				<Carousel className="w-full overflow-hidden">
					{popularGames.map((g) => (
						<CarouselItem key={g.appid} className="flex-none w-[20%] mr-4">
							<GameCard {...g} />
						</CarouselItem>
					))}
				</Carousel>
			</section>

			<img className="w-full h-[8px] mb-16" alt="Line" src="/Line.png" />

			<section className="relative w-full max-w-[1480px] mx-auto">
				<h2 className="pl-8 font-extrabold text-white text-[32px] mb-4">
					할인 중
				</h2>
				<div className="grid grid-cols-3 gap-6">
					{discountedGames.map((g) => (
						<GameCard key={g.appid} {...g} />
					))}
				</div>
			</section>
		</div>
	);
}
