package com.saas.repository;

import com.saas.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByStatus(Customer.Status status);
    long countByStatus(Customer.Status status);
    
    @Query("SELECT c FROM Customer c WHERE c.riskScore > ?1")
    List<Customer> findHighRiskCustomers(Double riskThreshold);
    
    @Query("SELECT c FROM Customer c WHERE c.riskScore > 0.0 ORDER BY c.riskScore DESC")
    List<Customer> findTopRiskCustomers();
    
    List<Customer> findByEmailOrderByIdDesc(String email);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM customers WHERE id NOT IN (SELECT DISTINCT ON (email) id FROM customers ORDER BY email, id DESC)", nativeQuery = true)
    void deleteDuplicateCustomers();
}