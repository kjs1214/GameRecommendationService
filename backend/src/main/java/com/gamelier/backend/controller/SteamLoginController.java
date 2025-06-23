package com.gamelier.backend.controller;

import com.gamelier.backend.service.SteamGameService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/login/steam")
public class SteamLoginController {

    private final SteamGameService steamGameService;
    private final SecretKey secretKey;

    public SteamLoginController(SteamGameService steamGameService, @Value("${jwt.secret}") String secret) {
        this.steamGameService = steamGameService;
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    }

    @GetMapping
    public ResponseEntity<Void> redirectToSteam() {
        String redirectUrl = UriComponentsBuilder
                .fromUriString("https://steamcommunity.com/openid/login")
                .queryParam("openid.ns", "http://specs.openid.net/auth/2.0")
                .queryParam("openid.mode", "checkid_setup")
                .queryParam("openid.return_to", "http://localhost:8080/login/steam/callback") // ✅ 백엔드 콜백 주소
                .queryParam("openid.realm", "http://localhost:8080")                          // ✅ 백엔드 도메인
                .queryParam("openid.identity", "http://specs.openid.net/auth/2.0/identifier_select")
                .queryParam("openid.claimed_id", "http://specs.openid.net/auth/2.0/identifier_select")
                .build().toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));

        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/callback")
    public RedirectView steamCallback(@RequestParam Map<String, String> params) {
        String claimedId = params.get("openid.claimed_id");
        if (claimedId != null) {
            String steamId = claimedId.substring(claimedId.lastIndexOf("/") + 1);

            String token = Jwts.builder()
                    .setSubject("user")
                    .claim("steamId", steamId)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                    .signWith(SignatureAlgorithm.HS256, secretKey)
                    .compact();

            steamGameService.fetchAndSaveOwnedGames(steamId);

            // ✅ 프론트 로컬 주소로 리디렉트
            return new RedirectView("http://localhost:5173/login/success?token=" + token);
        }

        return new RedirectView("/login/failure");
    }


}
