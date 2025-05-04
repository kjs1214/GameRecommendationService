package com.gamelier.backend.controller;

import com.gamelier.backend.dto.SteamProfileDto;
import com.gamelier.backend.service.SteamUserService;
import com.gamelier.backend.service.SteamGameService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/steam/user")
public class SteamUserController {

    private final SteamUserService steamUserService;
    private final SteamGameService steamGameService;


    public SteamUserController(SteamUserService steamUserService, SteamGameService steamGameService) {
        this.steamUserService = steamUserService;
        this.steamGameService = steamGameService;
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
    public ResponseEntity<?> getMySteamProfile(HttpSession session) {
        String steamId = (String) session.getAttribute("steamId");
        if (steamId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        SteamProfileDto profile = steamUserService.getSteamUserProfile(steamId);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/me/games")
    public ResponseEntity<?> getOwnedGames(HttpSession session) {
        String steamId = (String) session.getAttribute("steamId");
        if (steamId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(steamGameService.getOwnedGames(steamId));
    }

    @GetMapping("/me/recent-games")
    public ResponseEntity<?> getRecentlyPlayedGames(HttpSession session) {
        String steamId = (String) session.getAttribute("steamId");
        if (steamId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(steamGameService.getRecentlyPlayedGames(steamId));
    }
}