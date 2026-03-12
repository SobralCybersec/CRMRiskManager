package com.saas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetailDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String cpf;
    private String address;
    private String city;
    private String state;
    private LocalDate enrollmentDate;
    private Double riskScore;
    private String status;
    private List<RiskReasonDto> riskReasons;
    private List<ContactLogDto> contactHistory;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskReasonDto {
        private String reason;
        private String description;
        private Double impactScore;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactLogDto {
        private String contactType;
        private String notes;
        private String contactedAt;
        private String contactedBy;
    }
}
