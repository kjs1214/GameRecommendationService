package com.gamelier.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GamePlaytimeDTO {
    private String name;
    private int playtime; // in minutes
}