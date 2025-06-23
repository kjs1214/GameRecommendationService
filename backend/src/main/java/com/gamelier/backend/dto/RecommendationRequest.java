package com.gamelier.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class RecommendationRequest {
    private List<String> appIds;
}
