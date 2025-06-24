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
import java.util.stream.Collectors;

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

        if (games == null) return Collections.emptyList();

        List<SteamOwnedGameDto> result = new ArrayList<>();

        for (Map<String, Object> game : games) {
            int appid = (Integer) game.get("appid");
            String name = (String) game.get("name");
            int playtime = (Integer) game.getOrDefault("playtime_forever", 0);
            String iconHash = (String) game.get("img_icon_url");
            String iconUrl = String.format("https://media.steampowered.com/steamcommunity/public/images/apps/%d/%s.jpg", appid, iconHash);

            // ✅ appdetails로 장르 가져오기
            List<String> genres = fetchGenresByAppId(appid);

            result.add(new SteamOwnedGameDto(appid, name, playtime, iconUrl, genres));
        }

        return result;
    }

    private List<String> fetchGenresByAppId(int appid) {
        String url = "https://store.steampowered.com/api/appdetails?appids=" + appid + "&cc=kr&l=korean";
        try {
            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            Map<?, ?> gameData = (Map<?, ?>) response.get(String.valueOf(appid));
            if (gameData == null || !(Boolean) gameData.get("success")) return List.of();

            Map<?, ?> data = (Map<?, ?>) gameData.get("data");
            List<Map<String, Object>> genreList = (List<Map<String, Object>>) data.get("genres");
            if (genreList == null) return List.of();

            return genreList.stream()
                    .map(genre -> (String) genre.get("description"))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            return List.of(); // 실패 시 빈 리스트
        }
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

    public Map<String, Object> getGameDetailRaw(String appId) {
        String url = "https://store.steampowered.com/api/appdetails?appids=" + appId + "&cc=kr&l=korean";
        return restTemplate.getForObject(url, Map.class);
    }
}