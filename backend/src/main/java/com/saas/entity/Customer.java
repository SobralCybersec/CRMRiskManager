package com.saas.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "customers")
@Data
@NoArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String cpf;

    private String address;

    private String city;

    private String state;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @Column(name = "risk_score")
    private Double riskScore = 0.0;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    public enum Status {
        ACTIVE, INACTIVE, OVERDUE, HIGH_RISK
    }
}