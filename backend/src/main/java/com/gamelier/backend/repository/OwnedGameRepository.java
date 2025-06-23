package com.gamelier.backend.repository;

import com.gamelier.backend.entity.OwnedGame;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OwnedGameRepository extends JpaRepository<OwnedGame, Long> {
    List<OwnedGame> findBySteamId(String steamId);
    void deleteBySteamId(String steamId);
}
