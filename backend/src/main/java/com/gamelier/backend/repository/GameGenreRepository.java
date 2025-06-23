package com.gamelier.backend.repository;

import com.gamelier.backend.entity.GameGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameGenreRepository extends JpaRepository<GameGenre, Long> {
    List<GameGenre> findByAppid(int appid);
    void deleteByAppid(int appid);
}