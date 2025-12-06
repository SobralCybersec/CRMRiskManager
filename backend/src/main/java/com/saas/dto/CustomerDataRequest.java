package com.saas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDataRequest {
    private Long customer_id;
    private Integer days_since_enrollment;
    private Double payment_history_score;
    private Integer overdue_count;
    private Integer last_payment_days;
}