package com.saas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private long totalCustomers;
    private long overduePayments;
    private long highRiskCustomers;
    private List<CustomerRiskDto> topRiskCustomers;

    @Data
    @AllArgsConstructor
    public static class CustomerRiskDto {
        private Long id;
        private String name;
        private String email;
        private Double riskScore;
        private String status;
    }
}