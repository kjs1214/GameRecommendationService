package com.gamelier.backend.dto;

public class SteamRecentlyPlayedGameDto {
    private int appid;
    private String name;
    private int playtime2Weeks;
    private int playtimeForever;
    private String iconUrl;

    public SteamRecentlyPlayedGameDto(int appid, String name, int playtime2Weeks, int playtimeForever, String iconUrl) {
        this.appid = appid;
        this.name = name;
        this.playtime2Weeks = playtime2Weeks;
        this.playtimeForever = playtimeForever;
        this.iconUrl = iconUrl;
    }

    public int getAppid() { return appid; }
    public String getName() { return name; }
    public int getPlaytime2Weeks() { return playtime2Weeks; }
    public int getPlaytimeForever() { return playtimeForever; }
    public String getIconUrl() { return iconUrl; }
}