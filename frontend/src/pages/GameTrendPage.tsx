import { useEffect, useState } from "react";
import { fetchRecommendedGames } from "../api/steam";
import axios from "../api/axios";
import { Carousel, CarouselItem } from "../components/ui/carousel";
import type { JSX } from "react";

interface Game {
  appid: number;
  name: string;
  imageUrl: string;
  price?: string;
}

type GameCardProps = {
  appid: number;
  title: string;
  image: string;
};

const GameCard: React.FC<GameCardProps> = ({ appid, title, image }) => (
  <a
    href={`https://store.steampowered.com/app/${appid}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col w-full items-start gap-[3px] pt-0 pb-[5px] px-0 relative rounded-lg"
  >
    <div
      className="relative self-stretch w-full h-[300px] rounded-[7px] border-[5px] border-solid border-[#ff8b60]"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
    />
    <div className="relative self-stretch [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-white text-[25px] tracking-[0] leading-[normal]">
      {title}
    </div>
  </a>
);

export default function GameTrendPage(): JSX.Element {
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [discountedGames, setDiscountedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const appIds = ["10", "730", "440", "570", "550"];

  useEffect(() => {
    const loadAll = async () => {
      try {
        const rec = await fetchRecommendedGames(appIds, localStorage.getItem("token") ?? "");
        setRecommendedGames(
          rec.map((g) => ({
            appid: g.steam_appid,
            name: g.name,
            imageUrl: g.header_image,
            price: g.price_overview?.final_formatted ?? "",
          }))
        );

        const popRes = await axios.get("/steam/popular");
        setPopularGames(popRes.data);

        const disRes = await axios.get("/steam/discounts");
        setDiscountedGames(disRes.data);
      } catch (err) {
        console.error(err);
        alert("게임 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-700">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-100 dark:from-gray-800 dark:to-gray-900 p-6">
      {/* Header */}
      <header className="w-full relative mb-6">
        <div className="w-full h-[72px] flex items-center justify-center bg-[#edeff7]">
          <div className="flex items-center">
            <img src="/GameRogo.png" alt="Gamelier Logo" className="w-16 h-16" />
            <h1 className="font-extrabold text-black text-[50px] ml-2">G A M E L I E R</h1>
          </div>
        </div>
        <div className="w-full h-[3px] bg-black" />
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[400px] mb-16 bg-gradient-to-b from-[#001f3f] to-[#003366] rounded-lg overflow-hidden">
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-extrabold text-white text-[60px] drop-shadow-xl text-center">
          트렌드를 직접 보고 분석해보세요
        </h1>
        <img
          className="absolute w-[300px] h-auto bottom-0 left-10"
          alt="Illustration"
          src="/woman_img.png"
        />
      </section>

      {/* GAMELIER의 추천 */}
      <section className="relative w-full max-w-[1731px] mx-auto mb-16">
        <h2 className="pl-8 font-extrabold text-white text-[32px] mb-4">GAMELIER의 추천</h2>
        <Carousel className="w-full overflow-hidden">
          {recommendedGames.map((g) => (
            <CarouselItem key={g.appid} className="flex-none w-[20%] mr-4">
              <GameCard appid={g.appid} title={g.name} image={g.imageUrl} />
            </CarouselItem>
          ))}
        </Carousel>
      </section>

      {/* 구분선 */}
      <img className="w-full h-[8px] mb-16" alt="Section Separator" src="/Line.png" />

      {/* 인기 게임 */}
      <section className="relative w-full max-w-[1731px] mx-auto mb-16">
        <h2 className="pl-8 font-extrabold text-white text-[32px] mb-4">인기 게임</h2>
        <Carousel className="w-full overflow-hidden">
          {popularGames.map((g) => (
            <CarouselItem key={g.appid} className="flex-none w-[20%] mr-4">
              <GameCard appid={g.appid} title={g.name} image={g.imageUrl} />
            </CarouselItem>
          ))}
        </Carousel>
      </section>

      {/* 구분선 */}
      <img className="w-full h-[8px] mb-16" alt="Section Separator" src="/Line.png" />

      {/* 할인 중 게임 */}
      <section className="relative w-full max-w-[1480px] mx-auto">
        <h2 className="pl-8 font-extrabold text-white text-[32px] mb-4">할인 중</h2>
        <div className="grid grid-cols-3 gap-6">
          {discountedGames.map((g) => (
            <GameCard key={g.appid} appid={g.appid} title={g.name} image={g.imageUrl} />
          ))}
        </div>
      </section>
    </div>
  );
}
