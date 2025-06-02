package com.gamelier.backend.service;

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
import java.util.List;

@Service
public class SteamGameService {
    private final SteamApiClient steamApiClient;
    private final OwnedGameRepository ownedGameRepository;
    private final GameGenreRepository genreRepository;
    private final SteamMetadataClient metadataClient;

    public SteamGameService(SteamApiClient steamApiClient, OwnedGameRepository ownedGameRepository, GameGenreRepository genreRepository, SteamMetadataClient metadataClient) {
        this.steamApiClient = steamApiClient;
        this.ownedGameRepository = ownedGameRepository;
        this.genreRepository = genreRepository;
        this.metadataClient = metadataClient;
    }

    @Transactional
    public List<OwnedGame> fetchAndSaveOwnedGames(String steamId) {
        List<SteamOwnedGameDto> games = steamApiClient.fetchOwnedGames(steamId);
        ownedGameRepository.deleteBySteamId(steamId);

        List<OwnedGame> toSave = games.stream().map(dto -> {
            OwnedGame g = new OwnedGame();
            g.setSteamId(steamId);
            g.setAppid(dto.getAppid());
            g.setName(dto.getName());
            g.setPlaytimeForever(dto.getPlaytimeForever());
            g.setIconUrl(dto.getIconUrl());
            return g;
        }).toList();

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

        return ownedGameRepository.saveAll(toSave);
    }


    public List<OwnedGame> getStoredGames(String steamId) {
        return ownedGameRepository.findBySteamId(steamId);
    }

    public List<SteamRecentlyPlayedGameDto> getRecentlyPlayedGames(String steamId) {
        return steamApiClient.fetchRecentlyPlayedGames(steamId);
    }
}
