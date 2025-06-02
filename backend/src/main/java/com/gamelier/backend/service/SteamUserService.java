package com.gamelier.backend.service;

import com.gamelier.backend.api.SteamApiClient;
import com.gamelier.backend.dto.SteamProfileDto;
import org.springframework.stereotype.Service;

@Service
public class SteamUserService {

    private final SteamApiClient steamApiClient;

    public SteamUserService(SteamApiClient steamApiClient) {
        this.steamApiClient = steamApiClient;
    }

    public SteamProfileDto getSteamUserProfile(String steamId) {
        return steamApiClient.fetchSteamProfile(steamId);
    }
}