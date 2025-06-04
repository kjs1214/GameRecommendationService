import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { JSX } from "react";

export default function ScreenshotGallerySection(): JSX.Element {
  return (
    <Card className="w-full h-[650px] rounded-lg overflow-hidden relative">
      {/* Background image with overlay */}
      <div
        className="w-full h-full bg-[url(/frame-3.png)] bg-cover bg-center"
        style={{
          backgroundImage: "url(/frame-3.png)",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-t from-black/20 to-transparent bg-[#404040]/80">
          {/* Game title section */}
          <div className="absolute top-1/2 left-[45%] transform -translate-x-1/2 mt-28">
            <h1 className="font-extrabold text-white text-[40px] text-center">
              &quot;뇌 빼고 하기 좋은 게임 1위&quot;
            </h1>
          </div>

          {/* Steam button */}
          <Button
            variant="default"
            className="absolute bottom-16 right-6 h-auto w-[380px] bg-white hover:bg-white/90 rounded-[5px] py-4"
          >
            <span className="font-extrabold text-black text-3xl">
              → Steam 에서 확인하기
            </span>
          </Button>

          {/* Game info section */}
          <div className="absolute bottom-32 right-6 text-right">
            <p className="font-extrabold text-white text-3xl leading-[50px]">
              유머, 퍼즐
              <br />₩ 20,500
              <br />
              매우 긍정적
            </p>
          </div>

          {/* Game info indicator */}
          <div className="absolute bottom-[145px] right-[250px]">
            <p className="font-extrabold text-white text-3xl leading-[50px] whitespace-nowrap">
              ⓘ 게임 정보
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
