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
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
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
        List<OwnedGame> existing = ownedGameRepository.findBySteamId(steamId);

        // 1시간 이내 데이터가 있으면 캐시로 간주
        if (!existing.isEmpty()) {
            LocalDateTime recentFetchedAt = existing.get(0).getFetchedAt();
            if (recentFetchedAt != null && recentFetchedAt.isAfter(LocalDateTime.now().minusHours(1))) {
                return existing;
            }
        }

        try {
            // Steam API 호출 (DTO 리스트 반환)
            List<SteamOwnedGameDto> fetchedDto = steamApiClient.fetchOwnedGames(steamId);

            // DTO → Entity 변환
            List<OwnedGame> fetched = fetchedDto.stream().map(dto -> {
                OwnedGame game = new OwnedGame();
                game.setSteamId(steamId);
                game.setAppid(dto.getAppid());
                game.setName(dto.getName());
                game.setPlaytimeForever(dto.getPlaytimeForever());
                game.setIconUrl(dto.getIconUrl());
                game.setFetchedAt(LocalDateTime.now());
                return game;
            }).toList();

            ownedGameRepository.deleteBySteamId(steamId); // 기존 기록 삭제
            ownedGameRepository.saveAll(fetched);
            return fetched;
        } catch (HttpClientErrorException.TooManyRequests e) {
            if (!existing.isEmpty()) {
                return existing;
            }
            throw new RuntimeException("Steam API 요청이 과도합니다. 잠시 후 다시 시도해 주세요.");
        }
    }



    public List<SteamRecentlyPlayedGameDto> getRecentlyPlayedGames(String steamId) {
        return steamApiClient.fetchRecentlyPlayedGames(steamId);
    }
}
