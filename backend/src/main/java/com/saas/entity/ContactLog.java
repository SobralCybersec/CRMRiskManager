package com.saas.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String contactType;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "contacted_at")
    private LocalDateTime contactedAt = LocalDateTime.now();
}
