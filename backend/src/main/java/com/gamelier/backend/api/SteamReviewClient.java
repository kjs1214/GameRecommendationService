package com.gamelier.backend.api;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Component
public class SteamReviewClient {

    private final RestTemplate restTemplate;

    public SteamReviewClient() {
        this.restTemplate = new RestTemplate();
    }

    public List<Map<String, Object>> getTopLikedReviews(String appId) {
        String url = String.format(
                "https://store.steampowered.com/appreviews/%s?json=1&language=korean&filter=recent&num_per_page=100",
                appId
        );

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        List<Map<String, Object>> reviews = (List<Map<String, Object>>) response.get("reviews");

        if (reviews == null) return List.of();

        // 공감순 내림차순 정렬 후 상위 5개 추출
        return reviews.stream()
                .sorted((a, b) -> Integer.compare(
                        (int) b.getOrDefault("votes_up", 0),
                        (int) a.getOrDefault("votes_up", 0)
                ))
                .limit(5)
                .toList();
    }
}
