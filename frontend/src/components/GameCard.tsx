import React from "react";

const convertToWon = (usd: number): string => {
	const rate = 1300;
	return "₩" + (usd * rate).toLocaleString();
};

type GameCardProps = {
	appid: number;
	title: string;
	image: string;
	originalPriceCents?: number | string;
	finalPriceCents?: number | string;
	discountPercent?: number;
	isFree?: boolean;
	isWonFormatted?: boolean;
	linkToStore?: boolean;
};

const GameCard: React.FC<GameCardProps> = ({
	appid,
	title,
	image,
	originalPriceCents,
	finalPriceCents,
	discountPercent,
	isFree,
	isWonFormatted,
	linkToStore = true,
}) => {
	const formatPrice = (p: number | string | undefined): string => {
		if (typeof p === "string") return p;
		if (typeof p === "number") return convertToWon(p / 100);
		return "";
	};

	let priceDisplay;

	if (isFree) {
		priceDisplay = (
			<div className="text-green-500 text-sm font-bold text-center">무료!</div>
		);
	} else if (
		finalPriceCents !== undefined &&
		originalPriceCents !== undefined
	) {
		if (
			discountPercent &&
			discountPercent > 0 &&
			originalPriceCents !== finalPriceCents
		) {
			priceDisplay = (
				<div className="text-sm text-center">
					<span className="line-through text-gray-400 mr-2">
						{formatPrice(originalPriceCents)}
					</span>
					<span className="text-red-500 font-semibold">
						{formatPrice(finalPriceCents)}
					</span>
					<span className="ml-1 text-green-500">({discountPercent}%)</span>
				</div>
			);
		} else {
			priceDisplay = (
				<div className="text-sm text-center text-gray-800 dark:text-gray-300">
					{formatPrice(finalPriceCents)}
				</div>
			);
		}
	} else {
		priceDisplay = (
			<div className="text-sm text-center text-gray-400 dark:text-gray-400">
				가격 정보 없음
			</div>
		);
	}

	const cardContent = (
		<div className="w-60 flex flex-col items-center rounded overflow-hidden shadow-md bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200">
			<img src={image} alt={title} className="w-full h-36 object-cover" />
			<div className="p-3 w-full flex flex-col items-center">
				<h3 className="text-md font-semibold text-gray-800 dark:text-white text-center mb-1">
					{title}
				</h3>
				{priceDisplay}
			</div>
		</div>
	);

	if (linkToStore) {
		return (
			<a
				href={`https://store.steampowered.com/app/${appid}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				{cardContent}
			</a>
		);
	}

	return cardContent;
};

export default GameCard;
