package com.gamelier.backend.service;

import com.gamelier.backend.api.SteamApiClient;
import com.gamelier.backend.dto.SteamOwnedGameDto;
import com.gamelier.backend.dto.SteamRecentlyPlayedGameDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SteamGameService {

    private final SteamApiClient steamApiClient;

    public SteamGameService(SteamApiClient steamApiClient) {
        this.steamApiClient = steamApiClient;
    }

    public List<SteamOwnedGameDto> getOwnedGames(String steamId) {
        return steamApiClient.fetchOwnedGames(steamId);
    }
    public List<SteamRecentlyPlayedGameDto> getRecentlyPlayedGames(String steamId) {
        return steamApiClient.fetchRecentlyPlayedGames(steamId);
    }
}