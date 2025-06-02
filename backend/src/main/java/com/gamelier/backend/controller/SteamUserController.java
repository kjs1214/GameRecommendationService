package com.gamelier.backend.controller;

import com.gamelier.backend.dto.SteamProfileDto;
import com.gamelier.backend.entity.GameGenre;
import com.gamelier.backend.entity.OwnedGame;
import com.gamelier.backend.repository.GameGenreRepository;
import com.gamelier.backend.service.SteamUserService;
import com.gamelier.backend.service.SteamGameService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/steam/user")
public class SteamUserController {

    private final SteamUserService steamUserService;
    private final SteamGameService steamGameService;
    private final GameGenreRepository genreRepository;

    public SteamUserController(SteamUserService steamUserService,
                               SteamGameService steamGameService,
                               GameGenreRepository genreRepository) {
        this.steamUserService = steamUserService;
        this.steamGameService = steamGameService;
        this.genreRepository = genreRepository;
    }

    @GetMapping("/{steamId}")
    public ResponseEntity<?> getUserProfile(@PathVariable String steamId) {
        SteamProfileDto profile = steamUserService.getSteamUserProfile(steamId);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보를 찾을 수 없습니다.");
        }
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMySteamProfile(HttpServletRequest request) {
        String steamId = (String) request.getAttribute("steamId");
        if (steamId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        SteamProfileDto profile = steamUserService.getSteamUserProfile(steamId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/me/games/sync")
    public ResponseEntity<?> syncOwnedGames(HttpServletRequest request) {
        String steamId = (String) request.getAttribute("steamId");
        if (steamId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        var saved = steamGameService.fetchAndSaveOwnedGames(steamId);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/me/games")
    public ResponseEntity<?> getStoredGames(HttpServletRequest request) {
        String steamId = (String) request.getAttribute("steamId");
        if (steamId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        List<OwnedGame> games = steamGameService.getStoredGames(steamId);
        List<Map<String, Object>> withGenres = games.stream().map(game -> {
            Map<String, Object> map = new HashMap<>();
            map.put("appid", game.getAppid());
            map.put("name", game.getName());
            map.put("playtimeForever", game.getPlaytimeForever());
            map.put("iconUrl", game.getIconUrl());
            List<String> genres = genreRepository.findByAppid(game.getAppid())
                    .stream().map(GameGenre::getGenre).toList();
            map.put("genres", genres);
            return map;
        }).toList();

        return ResponseEntity.ok(withGenres);
    }

    @GetMapping("/me/recent-games")
    public ResponseEntity<?> getRecentlyPlayedGames(HttpServletRequest request) {
        String steamId = (String) request.getAttribute("steamId");
        if (steamId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        return ResponseEntity.ok(steamGameService.getRecentlyPlayedGames(steamId));
    }
}
