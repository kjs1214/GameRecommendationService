package com.gamelier.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
}
