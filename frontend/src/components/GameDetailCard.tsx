// GameDetailCard.tsx
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Card, CardContent } from "../components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Game {
  steam_appid: number;
  name: string;
  header_image: string;
  short_description: string;
  price_overview?: { final_formatted: string };
}

interface Review {
  recommendationid: string;
  review: string;
  voted_up: boolean;
  timestamp_created: number;
  author: { steamid: string; num_games_owned: number };
  votes_up: number;
  votes_funny: number;
}

interface Props { game: Game }

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

  return (
    <div className="mb-8">
      {/* Game & Reviews Container */}
      <div className="p-6 bg-gray-900 rounded-xl shadow-lg">
        {/* Game Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={game.header_image}
            alt={game.name}
            className="rounded-lg"
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-white">{game.name}</h2>
            <p className="text-gray-300">{game.short_description}</p>
            <p className="text-lg font-semibold text-green-400">
              {game.price_overview?.final_formatted ?? "무료"}
            </p>
            <a
              href={`https://store.steampowered.com/app/${game.steam_appid}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block w-max text-sm text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              → Steam에서 확인하기
            </a>
          </div>
        </div>

        {/* Review Section Styled Dark */}
        <section className="mt-8 w-full max-w-7xl bg-gray-800 rounded-lg p-6">
          {/* Expanded Title Container */}
          <div className="max-w-7xl">
            <h3 className="text-3xl font-extrabold text-white mb-6">
              가장 많은 공감을 받은 리뷰
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topReviews.map((r) => (
              <Card
                key={r.recommendationid}
                className="bg-gray-700 rounded-lg overflow-hidden"
              >
                <CardContent className="p-6 flex flex-col space-y-4">
                  {/* Avatar & Vote */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16 border-2 border-gray-600 bg-gray-700">
                      <AvatarFallback className="bg-gray-600 text-white">
                        {r.author.steamid.slice(-2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center space-x-3 bg-gray-600 rounded-lg px-4 py-3">
                      {r.voted_up ? (
                        <ThumbsUp className="w-8 h-8 text-white" />
                      ) : (
                        <ThumbsDown className="w-8 h-8 text-white" />
                      )}
                      <span className="text-xl font-medium text-white">
                        {r.voted_up ? "추천" : "비추천"}
                      </span>
                    </div>
                  </div>

                  {/* Meta: helpful votes */}
                  <div className="flex space-x-4 text-sm text-gray-400">
                    <span>공감 {r.votes_up}</span>
                    <span>재미 {r.votes_funny}</span>
                  </div>

                  {/* Review Content */}
                  <div className="bg-gray-600 rounded-lg p-4 text-gray-200 text-sm whitespace-pre-line line-clamp-4">
                    {r.review}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
