package com.gamelier.backend.controller;

import com.gamelier.backend.service.SteamGameService;
import jakarta.servlet.http.HttpServletResponse;
<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Value;
=======
import jakarta.servlet.http.HttpSession;
>>>>>>> main
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;
<<<<<<< HEAD
import io.jsonwebtoken.Jwts;

import javax.crypto.spec.SecretKeySpec;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.io.IOException;
=======

import java.io.IOException;
import java.util.Map;
>>>>>>> main

@RestController
@RequestMapping("/login/steam")
public class SteamLoginController {

    private final SteamGameService steamGameService;
<<<<<<< HEAD
    private final SecretKey secretKey;

    public SteamLoginController(SteamGameService steamGameService,
                                @Value("${jwt.secret}") String secret) {
        this.steamGameService = steamGameService;
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
=======

    public SteamLoginController(SteamGameService steamGameService) {
        this.steamGameService = steamGameService;
>>>>>>> main
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
<<<<<<< HEAD
    public RedirectView steamCallback(@RequestParam Map<String, String> params) {
        String claimedId = params.get("openid.claimed_id");
        if (claimedId != null) {
            String steamId = claimedId.substring(claimedId.lastIndexOf("/") + 1);

            String jwt = Jwts.builder()
                    .setSubject(steamId)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                    .signWith(secretKey)
                    .compact();

            return new RedirectView("http://localhost:3000/login/success?token=" + jwt);
        }
        return new RedirectView("/login/failure");
=======
    public RedirectView steamCallback(@RequestParam Map<String, String> params, HttpSession session) {
        String claimedId = params.get("openid.claimed_id");
        if (claimedId != null) {
            String steamId = claimedId.substring(claimedId.lastIndexOf("/") + 1);
            session.setAttribute("steamId", steamId);

            // 보유 게임 데이터 저장
            steamGameService.fetchAndSaveOwnedGames(steamId);
        }

        return new RedirectView("/api/steam/user/me");
>>>>>>> main
    }
}
