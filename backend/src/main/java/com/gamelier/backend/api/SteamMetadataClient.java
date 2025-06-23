package com.gamelier.backend.api;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SteamMetadataClient {
    private final RestTemplate restTemplate = new RestTemplate();

    public List<String> fetchGenresByAppId(int appid) {
        String url = UriComponentsBuilder.fromUriString("https://store.steampowered.com/api/appdetails")
                .queryParam("appids", appid)
                .toUriString();

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            Map data = (Map) ((Map) response.get(String.valueOf(appid))).get("data");
            List<Map<String, String>> genres = (List<Map<String, String>>) data.get("genres");

            List<String> genreList = new ArrayList<>();
            for (Map<String, String> genre : genres) {
                genreList.add(genre.get("description"));
            }
            return genreList;
        } catch (Exception e) {
            return List.of();
        }
    }
}