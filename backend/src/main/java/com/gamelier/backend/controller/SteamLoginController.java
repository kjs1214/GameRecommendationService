package com.gamelier.backend.controller;

import com.gamelier.backend.service.SteamGameService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/login/steam")
public class SteamLoginController {

    private final SteamGameService steamGameService;

    public SteamLoginController(SteamGameService steamGameService) {
        this.steamGameService = steamGameService;
    }

    @GetMapping
    public void redirectToSteam(HttpServletResponse response) throws IOException {
        String redirectUrl = UriComponentsBuilder
                .fromUriString("https://steamcommunity.com/openid/login")
                .queryParam("openid.ns", "http://specs.openid.net/auth/2.0")
                .queryParam("openid.mode", "checkid_setup")
                .queryParam("openid.return_to", "http://localhost:8080/login/steam/callback")
                .queryParam("openid.realm", "http://localhost:8080")
                .queryParam("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select")
                .queryParam("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select")
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }

    @GetMapping("/callback")
    public RedirectView steamCallback(@RequestParam Map<String, String> params, HttpSession session) {
        String claimedId = params.get("openid.claimed_id");
        if (claimedId != null) {
            String steamId = claimedId.substring(claimedId.lastIndexOf("/") + 1);
            session.setAttribute("steamId", steamId);

            // 보유 게임 데이터 저장
            steamGameService.fetchAndSaveOwnedGames(steamId);
        }

        return new RedirectView("/api/steam/user/me");
    }
}
