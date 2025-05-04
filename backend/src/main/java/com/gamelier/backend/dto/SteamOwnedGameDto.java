package com.gamelier.backend.dto;

public class SteamOwnedGameDto {
    private int appid;
    private String name;
    private int playtimeForever;
    private String iconUrl;

    public SteamOwnedGameDto(int appid, String name, int playtimeForever, String iconUrl) {
        this.appid = appid;
        this.name = name;
        this.playtimeForever = playtimeForever;
        this.iconUrl = iconUrl;
    }

    public int getAppid() { return appid; }
    public String getName() { return name; }
    public int getPlaytimeForever() { return playtimeForever; }
    public String getIconUrl() { return iconUrl; }
}