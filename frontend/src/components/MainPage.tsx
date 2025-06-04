import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";

import type { JSX } from "react";

export default function MainPage(): JSX.Element {
  return (
    <div className="bg-[#edeff7] flex flex-row justify-center w-full">
      <div className="bg-[#edeff7] w-full max-w-[1920px] relative">
        {/* Header */}
        <header className="absolute w-[1440px] h-[72px] left-[255px] top-0 bg-[#edeff7]">
          <div className="flex items-center justify-between px-0 h-full relative">
            <h1 className="absolute left-[514px] top-[5px] font-extrabold text-[50px] leading-[61px] text-black tracking-[0]">
              G&nbsp;A&nbsp;M&nbsp;E&nbsp;L&nbsp;I&nbsp;E&nbsp;R
            </h1>


            <div
              className="absolute right-[110px] top-[18px] flex items-center justify-center p-[10px] gap-[10px] bg-[#333333] rounded-[10px] border-[0.5px] border-solid border-[#00000040] shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
            >
              <button
                type="button"
                className="w-[74px] h-[15px] font-inter font-extrabold text-[12px] leading-[15px] text-white"
                onClick={() => {
                  window.location.href = "http://localhost:8080/login/steam";
                }}
              >
                로그인
              </button>
            </div>


          </div>

          {/* Line 12 */}
          <Separator
            className="absolute border-solid border-[3px] border-black"
            style={{ width: '1449px', height: 0, left: '-9px', top: '72px' }}
          />
        </header>

        {/* Hero Banner */}
        <section className="relative w-full max-w-[1440px] h-[300px] mx-auto mt-[91px] shadow-[5px_5px_30px_#00000066] [background:linear-gradient(135deg,rgba(166,93,253,1)_0%,rgba(74,193,255,1)_100%)]">
          <h2 className="absolute top-[118px] left-[350px] text-white text-[50px] font-extrabold tracking-[0] leading-normal">
            자신에게 딱 맞는 게임을 찾아보세요
          </h2>
          <img
            className="absolute w-[267px] h-[222px] top-[39px] right-[20px]"
            alt="Person sitting on chair"
            src="/AmigosSittingonChair.png"
          />

        </section>

        {/* Service Description */}
        <section className="flex flex-col items-center mt-[68px] text-center">
          <h2 className="font-extrabold text-black text-[50px] tracking-[0] leading-normal">
            GAMELIER는
          </h2>
          <p className="mt-[32px] font-extrabold text-black text-[40px] text-center tracking-[0] leading-[60px]">
            AI를 통해 사용자 프로필을 분석하고
            <br />
            유저의 성향에 맞는 게임을 추천하는 서비스에요
          </p>
        </section>

        {/* Feature Cards */}
        <section className="flex justify-center gap-0 mt-[173px]">
          {/* Card 1 - Profile Analysis */}
          <Card className="w-[481px] h-[652px] shadow-[5px_5px_30px_#00000099] [background:linear-gradient(180deg,rgba(130,52,255,1)_0%,rgba(208,179,255,1)_100%)] rounded-none border-none">
            <CardContent className="flex flex-col items-center justify-center h-full gap-[25px] px-[57px] py-[97px]">
              <div className="text-white text-[50px] font-extrabold tracking-[0] leading-normal">
                먼저,
                <br />
                자신의 성향을 <br />
                <br />
                완벽하게
                <br />
                분석해보세요.
              </div>
              <Button
                className="w-full h-auto bg-white hover:bg-white/90 rounded-[5px]"
                onClick={() => {
                  window.location.href = "http://localhost:5173/profile";
                }}
              >
                <span className="text-black text-3xl font-extrabold tracking-[0] leading-[72px]">
                  → 프로필 확인하러 가기
                </span>
              </Button>

            </CardContent>
          </Card>

          {/* Card 2 - Game Recommendation */}
          <Card className="w-[480px] h-[652px] shadow-[5px_0px_30px_#00000099] [background:linear-gradient(180deg,rgba(43,138,255,1)_0%,rgba(162,212,255,1)_100%)] rounded-none border-none">
            <CardContent className="flex flex-col items-center justify-center h-full gap-[25px] px-[50px] py-[89px]">
              <div className="text-white text-4xl font-extrabold tracking-[0] leading-normal">
                AI가 <br />
                Steam 상점의
                <br />
                60,000개의 게임들 중<br />
                <br />
                당신에게 딱 맞는 <br />단 5개의 게임을
                <br />
                찾아낼 거에요
              </div>
              <Button
                className="w-full h-auto bg-white hover:bg-white/90 rounded-[5px]"
                onClick={() => {
                  window.location.href = "http://localhost:5173/recommend";
                }}
              >
                <span className="text-black text-3xl font-extrabold tracking-[0] leading-[72px]">
                  → 게임 추천 받으러 가기
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 - Game Trends */}
          <Card className="w-[480px] h-[652px] shadow-[5px_5px_30px_#00000099] [background:linear-gradient(180deg,rgba(0,203,105,1)_0%,rgba(8,243,255,1)_100%)] rounded-none border-none">
            <CardContent className="flex flex-col items-center justify-center h-full gap-[25px] px-[57px] py-[83px]">
              <div className="w-[388px] mx-[-11px] text-white text-[35px] font-extrabold tracking-[0] leading-normal">
                그래도 고민된다면, <br />
                <br />
                실시간 인기 게임 트렌드를 직접 확인하고
                <br />
                <br />
                본인에게 맞는 게임을
                <br />
                느껴보세요
              </div>
              <Button
                className="w-full h-auto bg-white hover:bg-white/90 rounded-[5px]"
                onClick={() => {
                  window.location.href = "http://localhost:5173/trend";
                }}
              >
                <span
                  className="text-black text-3xl font-extrabold leading-[72px] whitespace-nowrap"
                  style={{ letterSpacing: 0 }}
                >
                  → 게임 트렌드 보러 가기
                </span>
              </Button>

            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
