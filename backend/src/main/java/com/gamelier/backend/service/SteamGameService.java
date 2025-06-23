package com.gamelier.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gamelier.backend.api.SteamApiClient;
import com.gamelier.backend.api.SteamMetadataClient;
import com.gamelier.backend.dto.SteamOwnedGameDto;
import com.gamelier.backend.dto.SteamRecentlyPlayedGameDto;
import com.gamelier.backend.entity.GameGenre;
import com.gamelier.backend.entity.OwnedGame;
import com.gamelier.backend.repository.GameGenreRepository;
import com.gamelier.backend.repository.OwnedGameRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SteamGameService {
    private final SteamApiClient steamApiClient;
    private final OwnedGameRepository ownedGameRepository;
    private final GameGenreRepository genreRepository;
    private final SteamMetadataClient metadataClient;

    public SteamGameService(SteamApiClient steamApiClient, OwnedGameRepository ownedGameRepository,
                            GameGenreRepository genreRepository, SteamMetadataClient metadataClient) {
        this.steamApiClient = steamApiClient;
        this.ownedGameRepository = ownedGameRepository;
        this.genreRepository = genreRepository;
        this.metadataClient = metadataClient;
    }

    @Transactional
    public List<OwnedGame> fetchAndSaveOwnedGames(String steamId) {
        List<OwnedGame> cached = getCachedGames(steamId);
        if (!cached.isEmpty()) return cached;

        try {
            List<SteamOwnedGameDto> games = steamApiClient.fetchOwnedGames(steamId);
            ownedGameRepository.deleteBySteamId(steamId);

            List<OwnedGame> toSave = convertToOwnedGames(steamId, games);
            ownedGameRepository.saveAll(toSave);

            // Genre 동기화
            toSave.forEach(g -> {
                genreRepository.deleteByAppid(g.getAppid());
                List<String> genres = metadataClient.fetchGenresByAppId(g.getAppid());
                genres.forEach(desc -> {
                    GameGenre gg = new GameGenre();
                    gg.setAppid(g.getAppid());
                    gg.setGenre(desc);
                    genreRepository.save(gg);
                });
            });

            return toSave;
        } catch (HttpClientErrorException.TooManyRequests e) {
            if (!cached.isEmpty()) return cached;
            return loadMockGames();
        }
    }

    public List<OwnedGame> getStoredGames(String steamId) {
        List<OwnedGame> cached = getCachedGames(steamId);
        if (!cached.isEmpty()) return cached;

        try {
            List<SteamOwnedGameDto> fetchedDto = steamApiClient.fetchOwnedGames(steamId);
            List<OwnedGame> fetched = convertToOwnedGames(steamId, fetchedDto);

            ownedGameRepository.deleteBySteamId(steamId);
            ownedGameRepository.saveAll(fetched);
            return fetched;
        } catch (HttpClientErrorException.TooManyRequests e) {
            if (!cached.isEmpty()) return cached;
            return loadMockGames();
        }
    }

    private List<OwnedGame> getCachedGames(String steamId) {
        List<OwnedGame> existing = ownedGameRepository.findBySteamId(steamId);
        if (!existing.isEmpty()) {
            LocalDateTime recentFetchedAt = existing.get(0).getFetchedAt();
            if (recentFetchedAt != null && recentFetchedAt.isAfter(LocalDateTime.now().minusHours(1))) {
                return existing;
            }
        }
        return List.of();
    }

    private List<OwnedGame> convertToOwnedGames(String steamId, List<SteamOwnedGameDto> dtos) {
        return dtos.stream().map(dto -> {
            OwnedGame game = new OwnedGame();
            game.setSteamId(steamId);
            game.setAppid(dto.getAppid());
            game.setName(dto.getName());
            game.setPlaytimeForever(dto.getPlaytimeForever());
            game.setIconUrl(dto.getIconUrl());
            game.setFetchedAt(LocalDateTime.now());
            return game;
        }).toList();
    }

    private List<OwnedGame> loadMockGames() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = getClass().getClassLoader().getResourceAsStream("mock_owned_games.json");
            List<Map<String, Object>> rawList = mapper.readValue(is, new TypeReference<>() {});
            return rawList.stream().map(data -> {
                OwnedGame g = new OwnedGame();
                g.setSteamId((String) data.get("steamId"));
                g.setAppid((Integer) data.get("appid"));
                g.setName((String) data.get("name"));
                g.setPlaytimeForever((Integer) data.get("playtimeForever"));
                g.setIconUrl((String) data.get("iconUrl"));
                g.setFetchedAt(LocalDateTime.parse((String) data.get("fetchedAt")));
                return g;
            }).toList();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load mock game data", e);
        }
    }

    public List<SteamRecentlyPlayedGameDto> getRecentlyPlayedGames(String steamId) {
        return steamApiClient.fetchRecentlyPlayedGames(steamId);
    }
}
