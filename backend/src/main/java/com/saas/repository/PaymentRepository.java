package com.saas.repository;

import com.saas.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomerId(Long customerId);
    List<Payment> findByStatus(Payment.Status status);
    
    @Query("SELECT p FROM Payment p WHERE p.status = 'OVERDUE' OR (p.dueDate < ?1 AND p.status = 'PENDING')")
    List<Payment> findOverduePayments(LocalDate date);
    
    @Query("SELECT p FROM Payment p WHERE p.dueDate BETWEEN ?1 AND ?2 AND p.status = 'PENDING'")
    List<Payment> findPaymentsDueSoon(LocalDate startDate, LocalDate endDate);
}