import React from "react";

interface ReviewCardProps {
	review: {
		recommendationid: string;
		author: { steamid: string };
		votes_up: number;
		votes_funny: number;
		voted_up: boolean;
		review: string;
		timestamp_created: number;
	};
}

export default function ReviewCard({ review }: ReviewCardProps) {
	const date = new Date(review.timestamp_created * 1000).toLocaleDateString();
	return (
		<div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
			<div className="flex items-center justify-between mb-2">
				<span className="text-sm text-gray-500 dark:text-gray-400">
					{review.author.steamid}
				</span>
				<span
					className={`text-sm font-semibold ${
						review.voted_up ? "text-green-600" : "text-red-500"
					}`}
				>
					{review.voted_up ? "추천" : "비추천"}
				</span>
			</div>
			<p className="text-gray-800 dark:text-gray-100 mb-2">
				{review.review.length > 300
					? review.review.slice(0, 300) + "..."
					: review.review}
			</p>
			<div className="text-xs text-gray-500 dark:text-gray-400">
				👍 {review.votes_up} | 😂 {review.votes_funny} | {date}
			</div>
		</div>
	);
}
