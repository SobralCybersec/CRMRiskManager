package com.saas.repository;

import com.saas.entity.ContactLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactLogRepository extends JpaRepository<ContactLog, Long> {
    List<ContactLog> findByCustomerIdOrderByContactedAtDesc(Long customerId);
}
