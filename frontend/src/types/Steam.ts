export type SteamProfile = {
    steamid: string;
    personaname: string;
    avatar: string;
    profileurl: string;
};

export type OwnedGame = {
    appid: number;
    name: string;
    playtimeForever: number;
    iconUrl: string;
    genre: string[];
};

export type RecentlyPlayedGame = {
    appid: number;
    name: string;
    playtime2Weeks: number;
    playtimeForever: number;
    iconUrl: string;
};
