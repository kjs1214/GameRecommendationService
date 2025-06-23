// src/components/GameCard.tsx
import React from "react";

interface GameCardProps {
	appid: number;
	name: string;
	imageUrl: string;
	price?: string;
	linkToStore?: boolean;
}

export default function GameCard({
	appid,
	name,
	imageUrl,
	price,
	linkToStore = true,
}: GameCardProps) {
	const cardContent = (
		<div className="w-60 rounded overflow-hidden shadow-md bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200">
			<img src={imageUrl} alt={name} className="w-full h-36 object-cover" />
			<div className="p-3">
				<h3 className="text-md font-semibold text-gray-800 dark:text-white truncate">
					{name}
				</h3>
				{price && (
					<p className="text-sm text-gray-600 dark:text-gray-300">{price}</p>
				)}
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
}
