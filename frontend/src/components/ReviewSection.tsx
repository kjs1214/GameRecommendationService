import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { JSX } from "react";

export default function ReviewSection(): JSX.Element {
  // Review data for mapping
  const reviews = [
    {
      id: 1,
      username: "jeongmin0518",
      avatar: "/profile.png",
      recommendation: "추천",
      recommendationColor: "#80e9ff",
      isPositive: true,
      playTime: "기록상 183시간 (평가 당시 17.3시간)",
      usefulCount: "22명이 이 평가가 유용하다고 함",
      content: `이번작의 전투는 패링에 모든것이 들어가있음

이거에 적응을 하느냐 못하느냐가 이번작의 재미를 결정지음

이터널도 좋아하지만 개인적으론 자원 수급이 너무 빡세서 아직까지는 다크 에이지를 
더 좋아하게됨 전체적인 평가는 게임을 완료 해봐야 할듯

아 확실한 단점은 바로 하나 언급 가능함 이터널에 있던 빠른이동 없어진거 좀 병신같음 가장 확실한 비밀 찾기 동기부여를 만들어준 기능이었는데 후속작에서 없앤건 좀 이상함

다 좋은데 사운드트랙을 디지털 아트북에 합쳐놨네. 그냥 다른 거 처럼 사운드 트랙 따로 빼주지...`,
    },
    {
      id: 2,
      username: "jeongmin0518",
      avatar: "/profile.png",
      recommendation: "비추천",
      recommendationColor: "#ffabab",
      isPositive: false,
      playTime: "기록상 183시간 (평가 당시 17.3시간)",
      usefulCount: "22명이 이 평가가 유용하다고 함",
      content: `이번작의 전투는 패링에 모든것이 들어가있음

이거에 적응을 하느냐 못하느냐가 이번작의 재미를 결정지음

이터널도 좋아하지만 개인적으론 자원 수급이 너무 빡세서 아직까지는 다크 에이지를 
더 좋아하게됨 전체적인 평가는 게임을 완료 해봐야 할듯

아 확실한 단점은 바로 하나 언급 가능함 이터널에 있던 빠른이동 없어진거 좀 병신같음 가장 확실한 비밀 찾기 동기부여를 만들어준 기능이었는데 후속작에서 없앤건 좀 이상함

다 좋은데 사운드트랙을 디지털 아트북에 합쳐놨네. 그냥 다른 거 처럼 사운드 트랙 따로 빼주지...`,
    },
    {
      id: 3,
      username: "jeongmin0518",
      avatar: "/profile.png",
      recommendation: "비추천",
      recommendationColor: "#ffabab",
      isPositive: false,
      playTime: "기록상 183시간 (평가 당시 17.3시간)",
      usefulCount: "22명이 이 평가가 유용하다고 함",
      content: `이번작의 전투는 패링에 모든것이 들어가있음

이거에 적응을 하느냐 못하느냐가 이번작의 재미를 결정지음

이터널도 좋아하지만 개인적으론 자원 수급이 너무 빡세서 아직까지는 다크 에이지를 
더 좋아하게됨 전체적인 평가는 게임을 완료 해봐야 할듯

아 확실한 단점은 바로 하나 언급 가능함 이터널에 있던 빠른이동 없어진거 좀 병신같음 가장 확실한 비밀 찾기 동기부여를 만들어준 기능이었는데 후속작에서 없앤건 좀 이상함

다 좋은데 사운드트랙을 디지털 아트북에 합쳐놨네. 그냥 다른 거 처럼 사운드 트랙 따로 빼주지...`,
    },
    {
      id: 4,
      username: "jeongmin0518",
      avatar: "/profile.png",
      recommendation: "비추천",
      recommendationColor: "#ffabab",
      isPositive: false,
      playTime: "기록상 183시간 (평가 당시 17.3시간)",
      usefulCount: "22명이 이 평가가 유용하다고 함",
      content: `이번작의 전투는 패링에 모든것이 들어가있음

이거에 적응을 하느냐 못하느냐가 이번작의 재미를 결정지음

이터널도 좋아하지만 개인적으론 자원 수급이 너무 빡세서 아직까지는 다크 에이지를 
더 좋아하게됨 전체적인 평가는 게임을 완료 해봐야 할듯

아 확실한 단점은 바로 하나 언급 가능함 이터널에 있던 빠른이동 없어진거 좀 병신같음 가장 확실한 비밀 찾기 동기부여를 만들어준 기능이었는데 후속작에서 없앤건 좀 이상함

다 좋은데 사운드트랙을 디지털 아트북에 합쳐놨네. 그냥 다른 거 처럼 사운드 트랙 따로 빼주지...`,
    },
  ];

  return (
    <section className="w-full bg-[#edeff7] rounded-lg p-8">
      <h2 className="text-4xl font-extrabold text-black mb-10 [font-family:'Inter-ExtraBold',Helvetica]">
        가장 많은 공감을 받은 리뷰
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="bg-[#aaaaaa] rounded-lg overflow-hidden"
          >
            <CardContent className="p-7 flex flex-col space-y-4">
              {/* 상단: 아바타 + 추천/비추천 박스 */}
              <div className="flex items-center space-x-4">
                {/* 아바타 */}
                <Avatar className="w-[100px] h-[100px] border-3 border-white bg-[#39cef3]">
                  <AvatarImage src={review.avatar} alt={review.username} />
                  <AvatarFallback className="bg-[#39cef3]">
                    {review.username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                {/* 추천/비추천 박스 */}
                <div className="flex items-center space-x-4 bg-[#888888] rounded-lg px-6 py-4 min-w-[300px]">
                  <div>
                    {review.isPositive ? (
                      <ThumbsUp className="w-[90px] h-[90px] text-white" />
                    ) : (
                      <ThumbsDown className="w-[90px] h-[90px] text-white" />
                    )}
                  </div>
                  <div>
                    <div
                      className="text-[40px] font-medium [font-family:'Inter-Medium',Helvetica]"
                      style={{ color: review.recommendationColor }}
                    >
                      {review.recommendation}
                    </div>
                    <div className="text-white text-[15px] font-medium text-center [font-family:'Inter-Medium',Helvetica]">
                      {review.playTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* 중단: 사용자명 + 유용한 평가 수 */}
              <div className="flex space-x-6 text-white text-[15px] font-medium [font-family:'Inter-Medium',Helvetica]">
                <div>{review.username}</div>
                <div>{review.usefulCount}</div>
              </div>

              {/* 하단: 리뷰 내용 */}
              <div className="bg-[#888888] rounded-lg p-4 text-white text-[15px] font-medium whitespace-pre-line">
                {review.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
