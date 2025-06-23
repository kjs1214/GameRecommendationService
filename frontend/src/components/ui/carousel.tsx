import React, { useState } from "react";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function Carousel({ children, className }: CarouselProps) {
  const childrenArray = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;
  const maxIndex = Math.ceil(childrenArray.length / itemsPerPage) - 1;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  };

  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {Array.from({ length: maxIndex + 1 }).map((_, pageIndex) => (
          <div
            key={pageIndex}
            className="min-w-full flex flex-row gap-6 px-16"
          >
            {childrenArray
              .slice(pageIndex * itemsPerPage, pageIndex * itemsPerPage + itemsPerPage)
              .map((child, i) => (
                <div key={i} className="w-1/2 flex-shrink-0 h-[450px]">
                  {child}
                </div>
              ))}
          </div>

        ))}
      </div>

      {/* 이전 버튼 */}
      <CarouselPrevious onClick={goPrev} />

      {/* 다음 버튼 */}
      <CarouselNext onClick={goNext} />
    </div>
  );
}

export function CarouselContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex gap-4 ${className ?? ""}`}>{children}</div>;
}

export function CarouselItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex-shrink-0 w-[98%] ${className ?? ""}`}>{children}</div>;
}




interface CarouselButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  className?: string;
}

export function CarouselNext({ onClick, className, ...rest }: CarouselButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 z-10 ${className ?? ""}`}
      aria-label="Next"
      {...rest}
    >
      ▶
    </button>
  );
}

export function CarouselPrevious({ onClick, className, ...rest }: CarouselButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 z-10 ${className ?? ""}`}
      aria-label="Previous"
      {...rest}
    >
      ◀
    </button>
  );
}
