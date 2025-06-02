package com.gamelier.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamelier.backend.dto.GamePlaytimeDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlaytimeService {

    private final Map<Long, String> userSteamMap = new HashMap<>();
    private final Map<Long, List<GamePlaytimeDTO>> userPlaytimeData = new HashMap<>();

    @Value("${steam.api-key}")
    private String steamApiKey;

    private final String GET_OWNED_GAMES_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=%s&steamid=%s&include_appinfo=true&format=json";

    public void saveSteamInfo(Long userId, String steamId) {
        userSteamMap.put(userId, steamId);
    }

    public List<GamePlaytimeDTO> fetchAndStorePlaytimes(Long userId) {
        String steamId = userSteamMap.get(userId);
        if (steamId == null) return List.of();

        String url = String.format(GET_OWNED_GAMES_URL, steamApiKey, steamId);
        RestTemplate restTemplate = new RestTemplate();
        List<GamePlaytimeDTO> playtimeList = new ArrayList<>();

        try {
            String json = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode games = mapper.readTree(json).path("response").path("games");

            for (JsonNode game : games) {
                String name = game.path("name").asText();
                int playtime = game.path("playtime_forever").asInt();
                if (playtime > 0) {
                    playtimeList.add(new GamePlaytimeDTO(name, playtime));
                }
            }
            userPlaytimeData.put(userId, playtimeList);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return playtimeList;
    }

    public List<GamePlaytimeDTO> getTopPlayedGames(Long userId) {
        return userPlaytimeData.getOrDefault(userId, List.of()).stream()
                .sorted(Comparator.comparingInt(GamePlaytimeDTO::getPlaytime).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    public Map<String, Integer> getPlaytimeSummary(Long userId) {
        // 실제 월별 통계 분석 로직은 생략하고 샘플 반환
        return Map.of(
                "2024-01", 120,
                "2024-02", 98,
                "2024-03", 142
        );
    }
}
