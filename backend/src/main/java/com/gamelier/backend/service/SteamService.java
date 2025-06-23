package com.gamelier.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamelier.backend.entity.OwnedGame;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.InputStream;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SteamService {

    private final String STEAM_API_URL = "https://store.steampowered.com/api/featuredcategories";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Map<String, Object>> fetchGames(String category) {
        try {
            String response = restTemplate.getForObject(STEAM_API_URL, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.path(category).path("items");

            List<Map<String, Object>> result = new ArrayList<>();

            for (int i = 0; i < Math.min(items.size(), 10); i++) {
                JsonNode item = items.get(i);
                result.add(Map.of(
                        "appid", item.path("id").asInt(),
                        "name", item.path("name").asText(),
                        "imageUrl", item.path("header_image").asText(),
                        "price", item.path("final_price").asInt(0) / 100 + "₩"
                ));
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Steam API 호출 실패", e);
        }
    }

    public List<OwnedGame> loadMockGames() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getClassLoader().getResourceAsStream("mock_owned_games.json");
            List<Map<String, Object>> rawList = mapper.readValue(is, new TypeReference<>() {});
            return rawList.stream().map(data -> {
                OwnedGame g = new OwnedGame();
                g.setSteamId((String) data.get("steamId"));
                g.setAppid((Integer) data.get("appid"));
                g.setName((String) data.get("name"));
                g.setPlaytimeForever((Integer) data.get("playtimeForever"));
                g.setIconUrl((String) data.get("iconUrl"));
                g.setFetchedAt(LocalDateTime.parse((String) data.get("fetchedAt")));
                return g;
            }).toList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load mock data", e);
        }
    }
}
