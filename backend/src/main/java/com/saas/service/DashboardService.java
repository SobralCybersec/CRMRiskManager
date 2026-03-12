package com.saas.service;

import com.saas.dto.DashboardResponse;
import com.saas.entity.Customer;
import com.saas.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final CustomerRepository customerRepository;
    private final CustomerService customerService;

    public DashboardResponse getDashboardData() {
        updateAllCustomerStatuses();

        long totalCustomers = customerRepository.count();
        long overduePayments = customerRepository.countByStatus(Customer.Status.OVERDUE);
        long highRiskCustomers = customerRepository.findHighRiskCustomers(0.6).size();

        List<DashboardResponse.CustomerRiskDto> topRisk = customerRepository.findTopRiskCustomers()
                .stream()
                .limit(10)
                .map(this::mapToCustomerRiskDto)
                .collect(Collectors.toList());

        return new DashboardResponse(totalCustomers, overduePayments, highRiskCustomers, topRisk);
    }

    private DashboardResponse.CustomerRiskDto mapToCustomerRiskDto(Customer customer) {
        return new DashboardResponse.CustomerRiskDto(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getRiskScore() != null ? customer.getRiskScore() : 0.0,
                customer.getStatus() != null ? customer.getStatus().name() : "ACTIVE"
        );
    }

    private void updateAllCustomerStatuses() {
        List<Customer> customers = customerRepository.findAll();
        customers.forEach(customerService::updateCustomerStatus);
    }
}