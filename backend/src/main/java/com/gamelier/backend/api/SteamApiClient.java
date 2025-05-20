package com.gamelier.backend.api;

import com.gamelier.backend.dto.SteamOwnedGameDto;
import com.gamelier.backend.dto.SteamProfileDto;
import com.gamelier.backend.dto.SteamRecentlyPlayedGameDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class SteamApiClient {
    // tes
    @Value("${steam.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public SteamApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public SteamProfileDto fetchSteamProfile(String steamId) {
        try {
            String url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/"
                    + "?key=" + apiKey + "&steamids=" + steamId;

            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            System.out.println("Response: " + response);

            List<?> players = (List<?>) ((Map<?, ?>) response.get("response")).get("players");

            if (!players.isEmpty() && players.get(0) instanceof Map<?, ?> data) {
                return new SteamProfileDto(
                        (String) data.get("steamid"),
                        (String) data.get("personaname"),
                        (String) data.get("avatar"),
                        (String) data.get("profileurl"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public List<SteamOwnedGameDto> fetchOwnedGames(String steamId) {
        String url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/"
                + "?key=" + apiKey + "&steamid=" + steamId + "&include_appinfo=1";

        Map<?, ?> response = restTemplate.getForObject(url, Map.class);
        Map<?, ?> responseData = (Map<?, ?>) response.get("response");
        List<Map<String, Object>> games = (List<Map<String, Object>>) responseData.get("games");

        if (games == null)
            return Collections.emptyList();

        List<SteamOwnedGameDto> result = new ArrayList<>();
        for (Map<String, Object> game : games) {
            int appid = (Integer) game.get("appid");
            String name = (String) game.get("name");
            int playtime = (Integer) game.getOrDefault("playtime_forever", 0);
            String iconHash = (String) game.get("img_icon_url");
            String iconUrl = String.format("https://media.steampowered.com/steamcommunity/public/images/apps/%d/%s.jpg",
                    appid, iconHash);
            result.add(new SteamOwnedGameDto(appid, name, playtime, iconUrl));
        }
        return result;
    }

    public List<SteamRecentlyPlayedGameDto> fetchRecentlyPlayedGames(String steamId) {
        String url = "https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/"
                + "?key=" + apiKey + "&steamid=" + steamId;

        Map<?, ?> response = restTemplate.getForObject(url, Map.class);
        Map<?, ?> responseData = (Map<?, ?>) response.get("response");
        List<Map<String, Object>> games = (List<Map<String, Object>>) responseData.get("games");

        if (games == null)
            return Collections.emptyList();

        List<SteamRecentlyPlayedGameDto> result = new ArrayList<>();
        for (Map<String, Object> game : games) {
            int appid = (Integer) game.get("appid");
            String name = (String) game.get("name");
            int playtime2Weeks = (Integer) game.getOrDefault("playtime_2weeks", 0);
            int playtimeForever = (Integer) game.getOrDefault("playtime_forever", 0);
            String iconHash = (String) game.get("img_icon_url");
            String iconUrl = String.format("https://media.steampowered.com/steamcommunity/public/images/apps/%d/%s.jpg",
                    appid, iconHash);
            result.add(new SteamRecentlyPlayedGameDto(appid, name, playtime2Weeks, playtimeForever, iconUrl));
        }
        return result;
    }
}