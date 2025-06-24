package com.gamelier.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class FlaskRecommendClient {
    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, String>> getRecommendations(String steamid, String apikey) {
        String url = "http://127.0.0.1:5001/recommend-summary?steamid=" + steamid + "&apikey=" + apikey;
        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);
        return response.getBody(); // List<Map<String, String>> 형태
    }
}
