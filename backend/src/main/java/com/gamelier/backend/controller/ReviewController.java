package com.gamelier.backend.controller;

import com.gamelier.backend.api.SteamReviewClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final SteamReviewClient reviewClient;

    @GetMapping("/{appId}")
    public List<Map<String, Object>> getTopReviews(@PathVariable("appId") String appId) {
        return reviewClient.getTopLikedReviews(appId);
    }

}
