// src/components/ProfileTemp.tsx

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import type { JSX } from "react";

// Top 5 games data (아래는 그대로)
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

export default function ProfileTemp(): JSX.Element {
  return (
    <div className="bg-white flex justify-center w-full">
      <div
        className="w-full min-h-screen relative overflow-x-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(237,239,247,1) 0%, rgba(130,52,255,1) 100%)",
        }}
      >
        {/* ───────────────── Header ───────────────── */}
        <header className="w-full h-[72px] bg-[#edeff7] relative">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <img
              src="/GameRogo.png"
              alt="Game logo"
              className="w-12 h-12 object-cover mr-4"
            />
            <h1 className="font-extrabold text-4xl text-black tracking-widest text-center">
              G A M E L I E R
            </h1>
          </div>
          <Separator className="w-full h-[3px]" />
        </header>

        {/* ───────────────── Hero Section ───────────────── */}
        <section className="container mx-auto px-4 mt-16 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 왼쪽: 텍스트 + 인물 일러스트 + Vector2 */}
            <div className="w-full md:w-1/2 relative flex justify-start ml-[-20px]">
              {/* Vector2: 배경 그대로, 불투명도 제거 */}
              <img
                src="/Vector2.png"
                alt="Vector background"
                className="absolute top-0 left-0 w-[400px] h-auto z-0"
              />

              {/* 텍스트 + 인물 일러스트 */}
              <div className="relative z-10 pl-4">
                <h2 className="font-bold text-black text-3xl mb-2">
                  'JM-2025' 님의
                </h2>
                <h1 className="font-bold text-black text-4xl mb-6">
                  Game Playtime 분석
                </h1>
                <img
                  src="/AmigosSittingonChair.png"
                  alt="Person sitting on chair"
                  className="max-w-[350px] h-auto relative left-[-20px]"
                />
              </div>
            </div>

            {/* 오른쪽: Vector3 + 원형차트 + 퍼센트 텍스트 */}
            <div className="w-full md:w-1/2 relative flex justify-start ml-[-150px]">
              {/* Vector3: 오른쪽 위 구석에 배치 */}
              <img
                src="/Vector3.png"
                alt="Vector 3"
                className="absolute top-[-20px] right-[-100px] w-[400px] h-auto z-0"
              />

              {/* 원형 차트 영역 */}
              <div className="relative w-[360px] h-[360px] z-10">
                <div className="bg-white rounded-full shadow-lg w-full h-full flex items-center justify-center">
                  {/* 차트 컴포넌트 혹은 빈 원 */}
                </div>

                {/* 퍼센트 텍스트 배치 */}
                {/* 차트 맨 위 중앙 (FPS) */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="font-extrabold text-[25px] text-[#ff703b]">30%</p>
                  <p className="font-bold text-[16px] text-[#333333]">FPS</p>
                </div>
                {/* 오른쪽 위 (Puzzle) */}
                <div className="absolute top-1/4 right-[-60px] text-center">
                  <p className="font-extrabold text-[25px] text-[#9ad960]">10%</p>
                  <p className="font-bold text-[16px] text-[#333333]">Puzzle</p>
                </div>
                {/* 오른쪽 아래 (Simulation) */}
                <div className="absolute bottom-1/4 right-[-60px] text-center">
                  <p className="font-extrabold text-[25px] text-[#39cef3]">25%</p>
                  <p className="font-bold text-[16px] text-[#333333]">Simulation</p>
                </div>
                {/* 왼쪽 위 (AOS) */}
                <div className="absolute top-1/4 left-[-60px] text-center">
                  <p className="font-extrabold text-[25px] text-[#39cef3]">15%</p>
                  <p className="font-bold text-[16px] text-[#333333]">AOS</p>
                </div>
                {/* 왼쪽 아래 (Rogue-like) */}
                <div className="absolute bottom-1/4 left-[-60px] text-center">
                  <p className="font-extrabold text-[25px] text-[#39cef3]">20%</p>
                  <p className="font-bold text-[16px] text-[#333333]">Rogue-like</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── Profile Analysis Section (아래 부분) ───────────────── */}
        <section className="container mx-auto px-4 mt-32">
          <div className="max-w-[1458px] mx-auto">
            <h2 className="font-bold text-black text-5xl leading-[60px] mb-8 text-center md:text-left">
              'JM-2025' 님의
              <br />
              프로필 분석 결과는 다음과 같아요
            </h2>

            <p className="font-bold text-black text-5xl leading-[60px] mb-16 text-center md:text-left">
              최근에는 FPS 장르를 주로 즐겨하셨군요!
            </p>

            <div className="flex justify-center md:justify-start mb-16">
              <Button
                className="bg-[#00cb69] text-black font-extrabold text-4xl h-auto py-4 rounded-[5px] px-8"
                onClick={() => {
                  window.location.href = "http://localhost:5173/trend";
                }}
              >
                → 다른 FPS 게임 추천 받기
              </Button>
            </div>

            <h2 className="font-bold text-black text-5xl leading-[60px] mb-8 text-center md:text-left">
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

            <h2 className="font-bold text-black text-5xl leading-[60px] mb-4 text-center md:text-left">
              종합적으로 당신의 유형은...
            </h2>

            <p className="font-bold text-black text-5xl leading-[60px] mb-2 text-center md:text-left">
              {"{모험가}"} 입니다
            </p>

            <p className="font-bold text-black text-5xl leading-[60px] mb-16 text-center md:text-left">
              다양한 게임을 체험하며 많은 경험을 쌓고 계시네요!
            </p>

            <p className="font-bold text-black text-5xl leading-[60px] mb-8 text-center md:text-left">
              GAMLIER에서 당신의 유형과 성향에 맞는 게임을 추천해드리고 있어요.
              <br />한 번 보러 가볼까요?
            </p>

            <div className="flex justify-center md:justify-start">
              <Button
                className="bg-[#00cb69] text-black font-extrabold text-4xl h-auto py-4 rounded-[5px] px-8"
                onClick={() => {
                  window.location.href = "http://localhost:5173/recommend";
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
