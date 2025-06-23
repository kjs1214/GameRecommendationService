// src/components/GameCarouselSection.tsx
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "./GameCard";

interface GameInfo {
	appid: number;
	name: string;
	imageUrl: string;
	price?: string;
}

interface Props {
	title: string;
	games: GameInfo[];
}

export default function GameCarouselSection({ title, games }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		containerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
	};

	const scrollRight = () => {
		containerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
	};

	return (
		<section className="my-10">
			<h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
				{title}
			</h2>
			<div className="relative">
				{/* 왼쪽 버튼 */}
				<button
					className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow"
					onClick={scrollLeft}
				>
					<ChevronLeft />
				</button>

				{/* 카드 컨테이너 */}
				<div
					ref={containerRef}
					className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-10"
				>
					{games.map((game) => (
						<GameCard
							key={game.appid}
							appid={game.appid}
							name={game.name}
							imageUrl={game.imageUrl}
							price={game.price}
						/>
					))}
				</div>

				{/* 오른쪽 버튼 */}
				<button
					className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow"
					onClick={scrollRight}
				>
					<ChevronRight />
				</button>
			</div>
		</section>
	);
}
