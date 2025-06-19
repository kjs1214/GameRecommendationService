import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselItem,
} from "./ui/carousel";
import { Search } from "lucide-react";
import type { JSX } from "react";
import GameDetailsSection from "./GameDetailsSection";
import ReviewSection from "./ReviewSection";
import ScreenshotGallerySection from "./ScreenshotGallerySection";
import { fetchProfile } from "../api/steam";
//import type { OwnedGame } from "../types/Steam";
import { useState, useEffect} from "react";

export default function GamerecommendTemp(): JSX.Element {
  //const [games, setGames] = useState<OwnedGame[]>([]);
  //const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  // Steam 보유 게임 데이터 로드
  useEffect(() => {
    const load = async () => {
      try {
        //const owned = await fetchOwnedGames();
        //setGames(owned);

        const profile = await fetchProfile();
        setUsername(profile.personaname);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
      } finally {
        //setLoading(false);
      }
    };
    load();
  }, []);
  // Screenshot gallery data
  const screenshotGalleryData = [
    { id: 1, src: "/scr_image1.png", alt: "Game screenshot 1" },
    { id: 2, src: "/scr_image2.png", alt: "Game screenshot 2" },
    { id: 3, src: "/scr_image2.png", alt: "Game screenshot 3" },
    { id: 4, src: "/scr_image2.png", alt: "Game screenshot 4" },
    { id: 5, src: "/scr_image2.png", alt: "Game screenshot 5" },
  ];

  // Related videos data
  const relatedVideosData = [
    { id: 1, src: "/scr_image1.png", alt: "Game video thumbnail 1" },
    { id: 2, src: "/scr_image2.png", alt: "Game video thumbnail 2" },
    { id: 3, src: "/scr_image2.png", alt: "Game video thumbnail 3" },

  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full relative overflow-x-hidden [background:linear-gradient(180deg,rgba(237,239,247,1)_0%,rgba(43,138,255,1)_100%)]">
        {/* Header */}
        <header className="w-full relative">
          <div className="w-full h-[72px] flex items-center justify-center bg-[#edeff7]">
            <div className="flex items-center">
              <img src="/GameRogo.png" alt="Gamelier Logo" className="w-16 h-16" />
              <h1 className="[font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[50px] tracking-[0] leading-[normal]">
                G&nbsp;&nbsp;A&nbsp;&nbsp;M&nbsp;&nbsp;E&nbsp;&nbsp;L&nbsp;&nbsp;I&nbsp;&nbsp;E&nbsp;&nbsp;R
              </h1>
            </div>
            <div className="absolute right-8">
              <Button
                variant="default"
                className="bg-[#333333] rounded-[10px] border-[0.5px] border-solid border-[#00000040] shadow-[0px_2px_4px_#00000040]"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="w-full h-[3px] bg-black"></div>
        </header>

        <main className="container mx-auto px-16 pt-10 pb-20">
          {/* Personalized recommendation section */}
          <section className="mt-8">
            <h2 className="[font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[40px] tracking-[0] leading-[normal]">
              {username ? `오직'${username}' 님을 위한한` : "로딩 중..."}
            </h2>
            <h1 className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-[80px] tracking-[0] leading-[normal]">
              GAMELIER&apos;s&nbsp;&nbsp;PICK
            </h1>
          </section>

          {/* Featured Game Section */}
          <section className="w-full mt-4 rounded-lg relative">
            <ScreenshotGallerySection />
            <div className="absolute top-[267px] left-[300px] [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-[#fffdfd] text-[80px] tracking-[0] leading-[normal]">
              Human Fall Flat
            </div>
          </section>

          <Card className="w-full mt-16 bg-[#edeff7] rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <h2 className="p-10 [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[40px] tracking-[0] leading-[normal]">
                스크린샷
              </h2>
              <Carousel className="w-full">
                {screenshotGalleryData.map((screenshot) => (
                  <CarouselItem key={screenshot.id} className="h-[450px]">
                    <img
                      src={screenshot.src}
                      alt={screenshot.alt}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </CarouselItem>
                ))}
              </Carousel>
            </CardContent>
          </Card>




          {/* Related Videos Section */}
          <Card className="w-full mt-16 bg-[#edeff7] rounded-lg overflow-hidden">
            <CardContent className="p-0">
              <h2 className="p-10 [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[40px] tracking-[0] leading-[normal]">
                관련영상
              </h2>
              <Carousel className="w-full">
                {relatedVideosData.map((video) => (
                  <CarouselItem key={video.id} className="h-[450px]">
                    <img
                      src={video.src}
                      alt={video.alt}
                      className="w-full h-full object-contain rounded-md"
                    />
                  </CarouselItem>
                ))}
              </Carousel>
            </CardContent>
          </Card>

          {/* Review and Game Details Section */}
          <div className="flex flex-row gap-8 mt-16">
            <div className="flex-grow">
              <ReviewSection />
            </div>
            <div className="w-1/4">
              <GameDetailsSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
