package com.gamelier.backend.controller;

import com.gamelier.backend.api.FlaskRecommendClient;
import com.gamelier.backend.api.SteamApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {

    private final SteamApiClient steamApiClient;
    private final FlaskRecommendClient flaskRecommendClient;

    @Value("${steam.api-key}")
    private String steamApiKey;

    @GetMapping("/with-summary")
    public List<Map<String, Object>> getRecommendedGamesWithSummary(
            @RequestParam(name = "steamid") String steamid) {

        List<Map<String, Object>> finalResult = new ArrayList<>();

        // 1. 추천 + 요약 결과 받기 (Flask)
        List<Map<String, String>> recommendations = flaskRecommendClient.getRecommendations(steamid, steamApiKey);

        // 2. 각 추천 게임 상세 정보 조회 + summary 병합
        for (Map<String, String> r : recommendations) {
            String appId = r.get("gameid");
            String summary = r.get("summary");

            Map<String, Object> raw = steamApiClient.getGameDetailRaw(appId);
            if (raw != null && raw.containsKey(appId)) {
                Map<String, Object> appData = (Map<String, Object>) raw.get(appId);
                if (Boolean.TRUE.equals(appData.get("success"))) {
                    Map<String, Object> gameData = (Map<String, Object>) appData.get("data");
                    gameData.put("summary", summary); // 요약 추가
                    finalResult.add(gameData);
                }
            }
        }

        return finalResult;
    }
}