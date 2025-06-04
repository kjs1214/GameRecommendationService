import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { JSX } from "react";

export default function GameDetailsSection(): JSX.Element {
  // Review data for mapping
  const reviews = [
    {
      id: 1,
      userImage: "/profile.png",
      imageAlt: "User avatar",
      isRecommended: true,
    },
    {
      id: 2,
      userImage: "/profile.png",
      imageAlt: "User avatar",
      isRecommended: true,
    },
    {
      id: 3,
      userImage: "/profile.png",
      imageAlt: "User avatar",
      isRecommended: false,
    },
    {
      id: 4,
      userImage: "/profile.png",
      imageAlt: "User avatar",
      isRecommended: true,
    },
    {
      id: 5,
      userImage: "/profile.png",
      imageAlt: "User avatar",
      isRecommended: false,
    },
  ];

  return (
    <section className="w-full max-w-[335px] bg-[#edeff7] rounded-lg p-6 flex flex-col gap-6">
      <h2 className="font-extrabold text-black text-[40px] leading-tight">
        최근 게시된 리뷰
      </h2>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-[#888888] border-none">
            <CardContent className="p-4 flex items-center">
              <div className="relative mr-4">
                <Avatar className="w-[50px] h-[50px] border-[3px] border-white bg-[#39cef3]">
                  <AvatarImage src={review.userImage} alt={review.imageAlt} />
                  <AvatarFallback className="bg-[#39cef3]"></AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center">
                {review.isRecommended ? (
                  <>
                    <ThumbsUp className="w-[40px] h-[40px] text-[#80e9ff]" />
                    <span className="font-medium text-[#80e9ff] text-[30px] text-center ml-0">
                      추천
                    </span>
                  </>
                ) : (
                  <>
                    <ThumbsDown className="w-[40px] h-[40px] text-[#ffabab]" />
                    <span className="font-medium text-[#ffabab] text-[23px] text-center ml-0">
                      비추천
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
