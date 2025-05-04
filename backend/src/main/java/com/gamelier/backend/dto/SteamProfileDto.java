package com.gamelier.backend.dto;

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

    public String getSteamid() {
        return steamid;
    }

    public String getPersonaname() {
        return personaname;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getProfileurl() {
        return profileurl;
    }
}
