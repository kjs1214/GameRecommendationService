package com.gamelier.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SteamOwnedGameDto {
    private int appid;
    private String name;
    private int playtimeForever;
    private String iconUrl;
    private List<String> genre;

    public SteamOwnedGameDto(int appid, String name, int playtimeForever, String iconUrl, List<String> genre) {
        this.appid = appid;
        this.name = name;
        this.playtimeForever = playtimeForever;
        this.iconUrl = iconUrl;
        this.genre = genre;
    }

}