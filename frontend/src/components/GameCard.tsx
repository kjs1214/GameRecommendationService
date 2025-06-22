import React from "react";

interface Game {
	steam_appid: number;
	name: string;
	header_image: string;
	short_description: string;
	price_overview?: {
		final_formatted: string;
	};
}

interface GameCardProps {
	game: Game;
}

export default function GameCard({ game }: GameCardProps) {
	const storeUrl = `https://store.steampowered.com/app/${game.steam_appid}`;

	return (
		<div
			style={{
				border: "1px solid #ddd",
				borderRadius: "10px",
				padding: "1rem",
				backgroundColor: "#fff",
				boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
				display: "flex",
				flexDirection: "column",
				height: "100%",
				justifyContent: "space-between",
			}}
		>
			<a href={storeUrl} target="_blank" rel="noopener noreferrer">
				<img
					src={game.header_image}
					alt={game.name}
					style={{
						width: "100%",
						borderRadius: "6px",
						marginBottom: "0.75rem",
					}}
				/>
			</a>
			<h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
				{game.name}
			</h3>
			<p style={{ fontSize: "0.9rem", flexGrow: 1 }}>
				{game.short_description}
			</p>
			<p style={{ marginTop: "0.75rem", fontWeight: "bold" }}>
				{game.price_overview?.final_formatted || "가격 정보 없음"}
			</p>
		</div>
	);
}
