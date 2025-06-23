// src/components/ProfileTemp.tsx
import { useState, useEffect, useMemo } from "react";
import GenreDonutChart from "../components/GenreDonutChart";
import { fetchOwnedGames, fetchProfile, fetchRecentGames } from "../api/steam";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import type { JSX } from "react";
import type { OwnedGame } from "../types/Steam";




/*const topGames = [
  {
	name: "1. 배틀그라운드",
	bgClass: "bg-gradient-to-r from-[#ff7b7b] to-[#e08787]",
	width: "w-full",
  },
  {
	name: "2. Stardew Valley",
	bgClass: "bg-gradient-to-r from-[#d9ffbb] to-[#78c872]",
	width: "w-[90%]",
  },
  {
	name: "3. Dark Souls 3",
	bgClass: "bg-gradient-to-r from-[#d9ffbb] to-[#78c872]",
	width: "w-[68%]",
  },
  {
	name: "4. Moster Hunter: World",
	bgClass: "bg-gradient-to-r from-[#fffebb] to-[#ebe58d]",
	width: "w-[59%]",
  },
  {
	name: "5. Portal 2",
	bgClass: "bg-gradient-to-r from-[#fffebb] to-[#ebe58d]",
	width: "w-[33%]",
  },
];
*/
export default function ProfileTemp(): JSX.Element {
	const [games, setGames] = useState<OwnedGame[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [username, setUsername] = useState<string | null>(null);
	const [recentGames, setRecentGames] = useState<OwnedGame[]>([]);


	const playType = useMemo(() => {
		if (games.length === 0) return { type: "모험가", description: "다양한 게임을 체험하며 많은 경험을 쌓고 계시네요!" };

		const genreMap = new Map<string, number>();
		let totalPlaytime = 0;

		games.forEach((g) => {
			const genres = g.genre || [];
			const playtime = g.playtimeForever || 0;
			totalPlaytime += playtime;
			genres.forEach((genre) => {
				genreMap.set(genre, (genreMap.get(genre) || 0) + playtime);
			});
		});

		const genreArray = Array.from(genreMap.entries());
		genreArray.sort((a, b) => b[1] - a[1]);

		const topGenre = genreArray[0]?.[0] || "";
		const topRatio = genreArray[0]?.[1] / totalPlaytime;

		if (topRatio > 0.7) {
			return { type: "몰입러", description: `특히 ${topGenre} 장르에 깊이 몰입하고 계시네요!` };
		} else if (genreArray.length >= 6) {
			return { type: "모험가", description: "다양한 게임을 체험하며 많은 경험을 쌓고 계시네요!" };
		} else if (["RPG", "Adventure", "Story"].some((g) => topGenre.includes(g))) {
			return { type: "탐험가", description: "스토리 중심의 게임에서 세계를 탐험하는 걸 좋아하시네요!" };
		} else if (["Strategy", "Simulation", "Tactics"].some((g) => topGenre.includes(g))) {
			return { type: "전략가", description: "두뇌를 쓰는 전략 게임에 관심이 많으시군요!" };
		}

		return { type: "게이머", description: "즐겁게 다양한 게임을 플레이하고 계세요!" };
	}, [games]);

	const recentGenre = useMemo(() => {
		if (recentGames.length === 0) return null;

		const map = new Map<string, number>();
		recentGames.forEach((g) => {
			const genres = g.genre || [];
			genres.forEach((genre) => {
				map.set(genre, (map.get(genre) || 0) + 1);
			});
		});

		const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
		return sorted[0]?.[0] || null; // 가장 많은 장르
	}, [recentGames]);

	// Steam 보유 게임 데이터 로드
	useEffect(() => {
		const load = async () => {
			try {
				const owned = await fetchOwnedGames();
				setGames(owned);

				const profile = await fetchProfile();
				setUsername(profile.personaname);

				const recent = await fetchRecentGames();


				const converted = recent.map((g) => ({ ...g, genre: [] }));
				setRecentGames(converted);
			} catch (err) {
				console.error("❌ 데이터 불러오기 실패:", err);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const topGames = useMemo(() => {
		if (!games || games.length === 0) return [];

		// 플레이타임 기준 내림차순 정렬 후 상위 5개
		const sorted = [...games].sort((a, b) => b.playtimeForever - a.playtimeForever).slice(0, 5);

		// 게임별 배경색 및 너비
		const bgClasses = [
			"bg-gradient-to-r from-[#ff7b7b] to-[#e08787]",
			"bg-gradient-to-r from-[#d9ffbb] to-[#78c872]",
			"bg-gradient-to-r from-[#87cefa] to-[#0000ff]",
			"bg-gradient-to-r from-[#fffebb] to-[#e06555]",
			"bg-gradient-to-r from-[#fffebb] to-[#ebe58d]",
		];

		const widths = ["w-full", "w-[90%]", "w-[68%]", "w-[59%]", "w-[33%]"];

		return sorted.map((game, index) => ({
			name: `${index + 1}. ${game.name}`,
			bgClass: bgClasses[index] || "bg-gray-300",
			width: widths[index] || "w-full",
		}));
	}, [games]);


	// 장르별 플레이타임 합산 -> Donut 차트용 데이터
	const genreData = useMemo(() => {
		const map = new Map<string, number>();
		games.forEach((g: any) => {
			const genres = g.genres || [];
			genres.forEach((genre: string) => {
				map.set(genre, (map.get(genre) || 0) + 1);
			});
		});
		return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
	}, [games]);

	return (
		<div className="bg-white flex justify-center w-full">
			<div
				className="w-full min-h-screen relative overflow-x-hidden"
				style={{
					background: "linear-gradient(180deg, rgba(237,239,247,1) 0%, rgba(130,52,255,1) 100%)",
				}}
			>
				{/* Header */}
				<header className="w-full h-[72px] bg-[#edeff7] relative">
					<div className="container mx-auto px-4 h-full flex items-center justify-center">
						<img src="/GameRogo.png" alt="Game logo" className="w-12 h-12 object-cover mr-4" />
						<h1 className="font-extrabold text-4xl text-black tracking-widest text-center">G A M E L I E R</h1>
					</div>
					<Separator className="w-full h-[3px]" />
				</header>

				{/* Hero Section */}
				<section className="container mx-auto px-4 mt-16 relative">
					<div className="flex flex-col md:flex-row items-center gap-8">
						{/* 왼쪽 텍스트+이미지 */}
						<div className="w-full md:w-1/2 relative flex justify-start ml-[-20px]">
							<img src="/Vector2.png" alt="Vector bg" className="absolute top-0 left-0 w-[400px] h-auto z-0" />
							<div className="relative z-10 pl-4">
								<h2 className="font-bold text-black text-3xl mb-2">{username ? `'${username}' 님의` : "로딩 중..."}</h2>
								<h1 className="font-bold text-black text-4xl mb-6">Game Playtime 분석</h1>
								<img src="/AmigosSittingonChair.png" alt="Person" className="max-w-[350px] h-auto relative left-[-20px]" />
							</div>
						</div>

						{/* 오른쪽 Donut 차트 영역 */}
						<div className="w-full md:w-1/2 relative flex justify-start">
							{/* Vector3는 부모 기준으로 절대 위치 */}
							<img
								src="/Vector3.png"
								alt="Vector3"
								className="absolute top-[-20px] right-[-100px] w-[400px] h-auto z-0"
							/>

							
							<div className="relative w-[500px] h-[500px] p-6 z-10 overflow-visible -ml-[240px]">
								<div className="w-full h-full flex items-center justify-center overflow-visible">
									{loading ? (
										<p>Loading chart...</p>
									) : (
										<GenreDonutChart data={genreData} />
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* ───────────────── Profile Analysis Section (아래 부분) ───────────────── */}
				<section className="container mx-auto px-4 mt-32">
					<div className="max-w-[1458px] mx-auto">
						<h2 className="font-bold text-black text-3xl leading-[60px] mb-8 text-center md:text-left">
							{username ? `'${username}' 님의` : "로딩 중..."}
							<br />
							프로필 분석 결과는 다음과 같아요
						</h2>

						<p className="font-bold text-black text-3xl leading-[60px] mb-16 text-center md:text-left">
							최근에는 {recentGenre ? `${recentGenre} 장르를` : "다양한 장르를"} 주로 즐겨하셨군요!
						</p>

						<div className="flex justify-center md:justify-start mb-16">
							<Button
								className="bg-[#00cb69] text-black font-extrabold text-4xl h-auto py-4 rounded-[5px] px-8"
								onClick={() => {
									window.location.href = "http://localhost:5173/trend";
								}}
							>
								→ {recentGenre ? `다른 ${recentGenre} 게임 추천 받기` : "다른 게임 추천 받기"}
							</Button>
						</div>

						<h2 className="font-bold text-black text-3xl leading-[60px] mb-8 text-center md:text-left">
							내가 가장 많이 플레이한 게임 TOP 5
						</h2>

						<Card className="bg-white rounded-[5px] mb-16">
							<CardContent className="p-0">
								{topGames.map((game, index) => (
									<div
										key={index}
										className={`${game.bgClass} h-[100px] ${game.width} rounded-[5px] flex items-center pl-4 mb-0`}
									>
										<h3 className="font-bold text-black text-3xl leading-[42px]">
											{game.name}
										</h3>
									</div>
								))}
							</CardContent>
						</Card>

						<h2 className="font-bold text-black text-3xl leading-[60px] mb-4 text-center md:text-left">
							종합적으로 당신의 유형은...
						</h2>

						<p className="font-bold text-black text-3xl leading-[60px] mb-2 text-center md:text-left">
							{"{" + playType.type + "}"} 입니다
						</p>

						<p className="font-bold text-black text-3xl leading-[60px] mb-16 text-center md:text-left">
							{playType.description}
						</p>

						<p className="font-bold text-black text-3xl leading-[60px] mb-8 text-center md:text-left">
							GAMLIER에서 당신의 유형과 성향에 맞는 게임을 추천해드리고 있어요.
							<br />한 번 보러 가볼까요?
						</p>

						<div className="flex justify-center md:justify-start">
							<Button
								className="bg-[#00cb69] text-black font-extrabold text-4xl h-auto py-4 rounded-[5px] px-8"
								onClick={() => {
									window.location.href = "http://localhost:5173/recommendations";
								}}
							>
								→ AI로 나에게 맞는 게임 추천 받기
							</Button>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
