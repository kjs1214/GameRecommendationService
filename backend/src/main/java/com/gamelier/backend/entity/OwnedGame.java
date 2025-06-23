package com.gamelier.backend.entity;

import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "owned_game")
@Getter
@Setter
public class OwnedGame {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String steamId;
    private int appid;
    private String name;
    private int playtimeForever;
    private String iconUrl;
    private LocalDateTime fetchedAt = LocalDateTime.now();
}