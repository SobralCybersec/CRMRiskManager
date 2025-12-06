package com.saas.repository;

import com.saas.entity.RiskReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RiskReasonRepository extends JpaRepository<RiskReason, Long> {
    List<RiskReason> findByCustomerId(Long customerId);
}
