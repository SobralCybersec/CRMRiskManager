package com.saas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RiskPredictionResponse {
    private Long customer_id;
    private Double risk_score;
    private String risk_level;
}