package com.gamelier.backend.controller;

import com.gamelier.backend.dto.GamePlaytimeDTO;
import com.gamelier.backend.service.PlaytimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserPlaytimeController {

    private final PlaytimeService playtimeService;

    @PostMapping("/steam-info")
    public ResponseEntity<?> registerSteamInfo(@RequestBody Map<String, String> request) {
        String steamId = request.get("steamId");
        Long userId = Long.parseLong(request.get("userId"));
        playtimeService.saveSteamInfo(userId, steamId);
        return ResponseEntity.ok(Map.of("status", "success"));
    }

    @GetMapping("/{userId}/playtime")
    public ResponseEntity<List<GamePlaytimeDTO>> getPlaytime(@PathVariable Long userId) {
        List<GamePlaytimeDTO> playtimes = playtimeService.fetchAndStorePlaytimes(userId);
        return ResponseEntity.ok(playtimes);
    }

    @GetMapping("/{userId}/top-games")
    public ResponseEntity<List<GamePlaytimeDTO>> getTopGames(@PathVariable Long userId) {
        List<GamePlaytimeDTO> topGames = playtimeService.getTopPlayedGames(userId);
        return ResponseEntity.ok(topGames);
    }

    @GetMapping("/{userId}/playtime/summary")
    public ResponseEntity<Map<String, Integer>> getPlaytimeSummary(@PathVariable Long userId) {
        Map<String, Integer> summary = playtimeService.getPlaytimeSummary(userId);
        return ResponseEntity.ok(summary);
    }
}