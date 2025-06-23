package com.gamelier.backend.controller;

import com.gamelier.backend.service.SteamService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/steam")
public class SteamController {

    private final SteamService steamService;

    public SteamController(SteamService steamService) {
        this.steamService = steamService;
    }

    @GetMapping("/popular")
    public List<Map<String, Object>> getPopularGames() {
        return steamService.fetchGames("top_sellers");
    }

    @GetMapping("/discounts")
    public List<Map<String, Object>> getDiscountedGames() {
        return steamService.fetchGames("specials");
    }
}
