import { useEffect, useMemo, useState } from "react";
import { fetchOwnedGames, fetchProfile, fetchRecentGames } from "../api/steam";
import { OwnedGame, SteamProfile } from "../types/Steam";
import GenreDonutChart from "./GenreDonutChart";

export default function ProfileSummaryCard() {
    const [profile, setProfile] = useState<SteamProfile | null>(null);
    const [games, setGames] = useState<OwnedGame[]>([]);
    const [recentCount, setRecentCount] = useState<number>(0);
    const [totalPlaytime, setTotalPlaytime] = useState<number>(0);
    const [mostPlayed, setMostPlayed] = useState<OwnedGame | null>(null);

    useEffect(() => {
        fetchProfile()
            .then((data) => {
                console.log("🧑‍💻 Steam profile:", data);
                setProfile(data);
            })
            .catch((err) => {
                console.error("❌ 프로필 불러오기 실패:", err);
            });

        fetchOwnedGames()
            .then((games) => {
                console.log("🎮 보유 게임 목록:", games);
                setGames(games);

                const total = games.reduce((acc, game) => acc + game.playtimeForever, 0);
                setTotalPlaytime(total);

                const top = [...games].sort((a, b) => b.playtimeForever - a.playtimeForever)[0];
                setMostPlayed(top);
            })
            .catch((err) => {
                console.error("❌ 보유 게임 불러오기 실패:", err);
            });

        fetchRecentGames()
            .then((recent) => {
                console.log("🕑 최근 게임 목록:", recent);
                setRecentCount(recent.length);
            })
            .catch((err) => {
                console.error("❌ 최근 게임 불러오기 실패:", err);
            });

    }, []);

    const genreStats = useMemo(() => {
        const map = new Map<string, number>();
        games.forEach((g: any) => {
            const genres = g.genres || [];
            genres.forEach((genre: string) => {
                map.set(genre, (map.get(genre) || 0) + 1);
            });
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [games]);

    if (!profile) return <p>불러오는 중...</p>;

    return (
        <div style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem", width: "400px" }}>
            <img src={profile.avatar} alt="avatar" />
            <h2>{profile.personaname}</h2>
            <p>Steam ID: {profile.steamid}</p>
            <p>보유 게임 수: {games.length}개</p>
            <p>총 플레이 시간: {(totalPlaytime / 60).toFixed(1)}시간</p>
            <p>최근 2주간 플레이한 게임 수: {recentCount}개</p>
            {mostPlayed && (
                <p>
                    🏆 최다 플레이 게임: {mostPlayed.name} ({(mostPlayed.playtimeForever / 60).toFixed(1)}시간)
                </p>
            )}
            <a href={profile.profileurl} target="_blank" rel="noreferrer">
                Steam 프로필 보기
            </a>

            <h3 style={{ marginTop: "1rem" }}>🎯 장르 통계</h3>
            <GenreDonutChart data={genreStats} />
        </div>
    );
}
