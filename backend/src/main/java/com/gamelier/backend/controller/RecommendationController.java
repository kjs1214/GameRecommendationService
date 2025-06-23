package com.gamelier.backend.controller;

import com.gamelier.backend.api.SteamApiClient;
import com.gamelier.backend.dto.RecommendationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
public class RecommendationController {

    private final SteamApiClient steamApiClient;

    @PostMapping("/details")
    public List<Map<String, Object>> getRecommendedGameDetails(@RequestBody RecommendationRequest request) {
        List<Map<String, Object>> gameDetails = new ArrayList<>();

        for (String appId : request.getAppIds()) {
            Map<String, Object> rawResponse = steamApiClient.getGameDetailRaw(appId);

            if (rawResponse != null && rawResponse.containsKey(appId)) {
                Map<String, Object> appData = (Map<String, Object>) rawResponse.get(appId);
                if (Boolean.TRUE.equals(appData.get("success"))) {
                    gameDetails.add((Map<String, Object>) appData.get("data"));
                }
            }
        }

        return gameDetails;
    }
}
