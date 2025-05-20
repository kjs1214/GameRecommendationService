import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import type { JSX } from "react";

export default function ProfileTemp(): JSX.Element {
  // Game genre data for the donut chart
  const genreData = [
    { name: "FPS", percentage: "30%", color: "#ff703b" },
    { name: "Simulation", percentage: "25%", color: "#39cef3" },
    { name: "Rogue-like", percentage: "20%", color: "#39cef3" },
    { name: "AOS", percentage: "15%", color: "#39cef3" },
    { name: "Puzzle", percentage: "10%", color: "#9ad960" },
  ];

  // Top 5 games data
  const topGames = [
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

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden bg-gradient-to-b from-[#edeff7] to-[#8234ff] w-full max-w-[1920px] min-h-screen relative">
        {/* Header */}
        <header className="w-full h-[72px] bg-[#edeff7] relative">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center">
              <img src="" alt="Game logo" className="w-16 h-16 object-cover" />
              <h1 className="font-extrabold text-5xl tracking-widest ml-4">
                G A M E L I E R
              </h1>
            </div>
            <Button
              variant="default"
              className="bg-[#333333] rounded-[10px] border-[0.5px] border-[#00000040] shadow-md"
            >
              <img src="" alt="User" className="w-[72px] h-[11px]" />
            </Button>
          </div>
          <Separator className="w-full h-[3px]" />
        </header>
       

        {/* Hero Section */}
        <section className="container mx-auto px-4 mt-16 relative">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-full md:w-1/2 relative">
              <div className="relative z-10">
                <h2 className="font-bold text-white text-4xl mb-4">
                  'JM-2025' 님의
                </h2>
                <h1 className="font-bold text-white text-5xl">
                  Game Playtime 분석
                </h1>
                <img
                  src=""
                  alt="Person sitting on chair"
                  className="mt-8 max-w-[455px] h-auto"
                />
              </div>
              <img
                src=""
                alt="Vector background"
                className="absolute top-0 left-0 w-full h-full z-0"
              />
            </div>

            <div className="w-full md:w-1/2">
              <div className="relative">
                <div className="bg-white rounded-full shadow-lg w-[369px] h-[369px] mx-auto relative">
                  {/* This would be the donut chart */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Chart visualization would go here */}
                  </div>
                </div>

                {/* Genre percentages around the chart */}
                <div className="absolute top-0 right-0">
                  <div className="text-right">
                    <p className="font-bold text-[25px] text-[#ff703b]">30%</p>
                    <p className="text-[15px] text-[#333333]">FPS</p>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0">
                  <div className="text-right">
                    <p className="font-bold text-[25px] text-[#39cef3]">25%</p>
                    <p className="text-[15px] text-[#333333]">Simulation</p>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0">
                  <div>
                    <p className="font-bold text-[25px] text-[#39cef3]">20%</p>
                    <p className="text-[15px] text-[#333333]">Rogue-like</p>
                  </div>
                </div>

                <div className="absolute top-1/3 left-0">
                  <div>
                    <p className="font-bold text-[25px] text-[#39cef3]">15%</p>
                    <p className="text-[15px] text-[#333333]">AOS</p>
                  </div>
                </div>

                <div className="absolute top-0 left-0">
                  <div>
                    <p className="font-bold text-[25px] text-[#9ad960]">10%</p>
                    <p className="text-[15px] text-[#333333]">Puzzle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Analysis Section */}
        <section className="container mx-auto px-4 mt-32">
          <div className="max-w-[1458px] mx-auto">
            <h2 className="font-bold text-black text-5xl leading-[60px] mb-8">
              'JM-2025' 님의
              <br />
              프로필 분석 결과는 다음과 같아요
            </h2>

            <p className="font-bold text-black text-5xl leading-[60px] mb-16">
              최근에는 FPS 장르를 주로 즐겨하셨군요!
            </p>

            <Button className="bg-[#00cb69] text-black font-extrabold text-3xl h-auto py-4 rounded-[5px] mb-16">
              → 다른 FPS 게임 추천 받기
            </Button>

            <h2 className="font-bold text-black text-5xl leading-[60px] mb-8">
              내가 가장 많이 플레이한 게임 TOP 5
            </h2>

            <Card className="bg-white rounded-[5px] mb-16">
              <CardContent className="p-0">
                {topGames.map((game, index) => (
                  <div
                    key={index}
                    className={`${game.bgClass} h-[137px] ${game.width} rounded-[5px] flex items-center pl-4 mb-0`}
                  >
                    <h3 className="font-bold text-black text-5xl leading-[60px]">
                      {game.name}
                    </h3>
                  </div>
                ))}
              </CardContent>
            </Card>

            <h2 className="font-bold text-black text-5xl leading-[60px] mb-4">
              종합적으로 당신의 유형은...
            </h2>

            <p className="font-bold text-black text-5xl leading-[60px] mb-2">
              {"{모험가}"} 입니다
            </p>

            <p className="font-bold text-black text-5xl leading-[60px] mb-16">
              다양한 게임을 체험하며 많은 경험을 쌓고 계시네요!
            </p>

            <p className="font-bold text-black text-5xl leading-[60px] mb-8">
              GAMLIER에서 당신의 유형과 성향에 맞는 게임을 추천해드리고 있어요.
              <br />한 번 보러 가볼까요?
            </p>

            <Button className="bg-[#00cb69] text-black font-extrabold text-3xl h-auto py-4 rounded-[5px]">
              → AI로 나에게 맞는 게임 추천 받기
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
