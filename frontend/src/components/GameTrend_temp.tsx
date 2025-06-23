import { Button } from "./ui/button";
import { Carousel, CarouselItem } from "./ui/carousel";

// Game data for different sections
const recommendedGames = [
  { id: 1, title: "Battlefield 5", image: "/tr_image1.png" },
  { id: 2, title: "Dark Souls 3", image: "/tr_image2.png" },
  { id: 3, title: "Garry's Mod", image: "/tr_image3.png" },
  { id: 4, title: "Garry's Mod", image: "/tr_image3.png" }
];

const popularGames = [
  { id: 1, title: "Battlefield 5", image: "/tr_image1.png" },
  { id: 2, title: "Dark Souls 3", image: "/tr_image2.png" },
  { id: 3, title: "Garry's Mod", image: "/tr_image3.png" }
];

const discountedGames = [
  { id: 1, title: "Battlefield 5", image: "/tr_image1.png" },
  { id: 2, title: "Dark Souls 3", image: "/tr_image2.png" },
  { id: 3, title: "Garry's Mod", image: "/tr_image3.png" },
  { id: 4, title: "Battlefield 5", image: "/tr_image1.png" },
  { id: 5, title: "Dark Souls 3", image: "/tr_image2.png" },
  { id: 6, title: "Garry's Mod", image: "/tr_image3.png" },
  { id: 7, title: "Battlefield 5", image: "/tr_image1.png" },
  { id: 8, title: "Dark Souls 3", image: "/tr_image2.png" },
  { id: 9, title: "Garry's Mod", image: "/tr_image3.png" }
];

type GameCardProps = {
  title: string;
  image: string;
};

const GameCard: React.FC<GameCardProps> = ({ title, image }) => (
  <div className="flex flex-col w-full items-start gap-[3px] pt-0 pb-[5px] px-0 relative rounded-lg">
    <div
      className="relative self-stretch w-full h-[300px] rounded-[7px] border-[5px] border-solid border-[#ff8b60]"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
      }}
    />
    <div className="relative self-stretch [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[25px] tracking-[0] leading-[normal]">
      {title}
    </div>
  </div>
);


export default function GametrendTemp() {
  return (
    <div className="bg-white flex justify-center w-full">
      <div className="bg-white [background:linear-gradient(180deg,rgba(237,239,247,1)_0%,rgba(255,139,96,1)_100%)] w-full max-w-[1920px]">
        {/* Header Section */}
        <header className="w-full relative">
          <div className="w-full h-[72px] flex items-center justify-center bg-[#edeff7]">
            <div className="flex items-center">
              <img src="/GameRogo.png" alt="Gamelier Logo" className="w-16 h-16" />
              <h1 className="font-extrabold text-black text-[50px]">G&nbsp;A&nbsp;M&nbsp;E&nbsp;L&nbsp;I&nbsp;E&nbsp;R</h1>
            </div>
            <div className="absolute right-8">
              
            </div>
          </div>
          <div className="w-full h-[3px] bg-black" />
        </header>

        {/* Hero Section */}
        <section className="relative w-full h-[599px] mt-24 [background:linear-gradient(180deg,rgba(147,199,255,1)_0%,rgba(0,153,255,1)_100%)]">
          <h1 className="absolute top-[244px] left-1/2 transform -translate-x-1/2 font-extrabold text-black text-[80px] text-center">
            트렌드를 직접 보고 분석해보세요
          </h1>
          <img
            className="absolute w-[380px] h-[456px] top-[210px] left-[95px]"
            alt="Young woman drawing"
            src="/woman_img.png"
          />
        </section>

        {/* Wave Separator */}
        <img className="w-full h-80" alt="Wave" src="/wave.png" />

        {/* Recommended Games Section */}
        <section className="relative w-full max-w-[1731px] mx-auto mt-10 mb-16">
          <h2 className="pl-24 [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[40px] tracking-[0] leading-[normal]">GAMEIER의 추천</h2>
          <div className="mt-4 mx-[50px]">
            <Carousel className="w-full overflow-hidden">
              {recommendedGames.map((game) => (
                <CarouselItem key={game.id} className="flex-none w-[0px]">
                  <GameCard title={game.title} image={game.image} />
                </CarouselItem>
              ))}
            </Carousel>


          </div>
        </section>

        {/* Single Line Separator between Recommended and Popular */}
        <img className="w-full h-[13px]" alt="Line" src="/Line.png" />

        {/* Popular Games Section */}
        <section className="relative w-full max-w-[1731px] mx-auto mt-10 mb-16">
          <h2 className="pl-24 [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[40px] tracking-[0] leading-[normal]">인기 게임</h2>
          <div className="mt-4 mx-[50px]">
            <Carousel className="w-full overflow-hidden">
              {popularGames.map((game) => (
                <CarouselItem key={game.id} className="flex-none basis-1/3">
                  <GameCard title={game.title} image={game.image} />
                </CarouselItem>
              ))}
            </Carousel>

          </div>
        </section>

        {/* Separator Line for Discounted Section */}
        <img className="w-full h-[13px]" alt="Line" src="/Line.png" />

        {/* Discounted Games Section */}
        <section className="relative w-full max-w-[1480px] mx-auto mt-10">
          <h2 className="p-10 [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-[40px] tracking-[0] leading-[normal]">할인 중</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {discountedGames.map((game) => (
              <GameCard key={game.id} title={game.title} image={game.image} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
