package com.gamelier.backend.dto;
import lombok.Data;

@Data
public class SteamProfileDto {
    private String steamid;
    private String personaname;
    private String avatar;
    private String profileurl;

    public SteamProfileDto(String steamid, String personaname, String avatar, String profileurl) {
        this.steamid = steamid;
        this.personaname = personaname;
        this.avatar = avatar;
        this.profileurl = profileurl;
    }
}
