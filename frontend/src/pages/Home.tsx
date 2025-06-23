import { useNavigate } from "react-router-dom";

interface Props {
	userInfo: {
		steamId: string;
		iconUrl: string;
		personaName: string;
	} | null;
}

export default function Home({ userInfo }: Props) {
	const navigate = useNavigate();

	const handleClick = (path: string) => {
		if (userInfo) {
			navigate(path);
		} else {
			window.location.href = "http://localhost:8080/login/steam";
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 relative">
			{/* 우측 상단 로그인 상태 표시 */}
			<div className="absolute top-4 right-4">
				{userInfo ? (
					<div className="flex items-center gap-2">
						<img
							src={userInfo.iconUrl}
							alt="프로필"
							className="w-10 h-10 rounded-full"
						/>
						<span className="text-white">{userInfo.personaName}</span>
					</div>
				) : (
					<button
						onClick={() =>
							(window.location.href = "http://localhost:8080/login/steam")
						}
						className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
					>
						Steam 로그인
					</button>
				)}
			</div>

			<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
				자신에게 딱 맞는 게임을 찾아보세요
			</h1>
			<p className="text-center text-lg max-w-xl text-gray-700 dark:text-gray-300">
				AI를 통해 사용자 프로필을 분석하고 유저의 성향에 맞는 게임을 추천하는
				서비스예요.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
				<div className="flex-1 bg-purple-400 text-white p-6 rounded">
					<p className="font-bold">자신의 성향을 분석해보세요</p>
					<button
						onClick={() => handleClick("/profile")}
						className="mt-4 bg-white text-black px-4 py-2 rounded"
					>
						→ 프로필 확인하러 가기
					</button>
				</div>
				<div className="flex-1 bg-blue-400 text-white p-6 rounded">
					<p className="font-bold">AI가 게임을 추천해줍니다</p>
					<button
						onClick={() => handleClick("/recommendations")}
						className="mt-4 bg-white text-black px-4 py-2 rounded"
					>
						→ 게임 추천 받으러 가기
					</button>
				</div>
				<div className="flex-1 bg-green-400 text-white p-6 rounded">
					<p className="font-bold">실시간 트렌드도 확인하세요</p>
					<button
						onClick={() => handleClick("/trend")}
						className="mt-4 bg-white text-black px-4 py-2 rounded"
					>
						→ 게임 트렌드 보러 가기
					</button>
				</div>
			</div>
		</div>
	);
}
