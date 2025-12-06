package com.saas.dto;

import lombok.Data;

@Data
public class ContactRequest {
    private String customerId;
    private String contactType;
    private String notes;
}
