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
        try {
            updateAllCustomerStatuses();
            
            long totalCustomers = customerRepository.count();
            long overduePayments = customerRepository.countByStatus(Customer.Status.OVERDUE);
            long highRiskCustomers = customerRepository.findHighRiskCustomers(0.6).size();
            
            List<DashboardResponse.CustomerRiskDto> topRisk = customerRepository.findTopRiskCustomers()
                .stream()
                .limit(10)
                .map(c -> new DashboardResponse.CustomerRiskDto(
                    c.getId(), c.getName(), c.getEmail(), 
                    c.getRiskScore() != null ? c.getRiskScore() : 0.0, 
                    c.getStatus() != null ? c.getStatus().name() : "ACTIVE"
                ))
                .collect(Collectors.toList());

            return new DashboardResponse(totalCustomers, overduePayments, highRiskCustomers, topRisk);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar dados do dashboard: " + e.getMessage());
        }
    }
    
    private void updateAllCustomerStatuses() {
        try {
            List<Customer> customers = customerRepository.findAll();
            for (Customer customer : customers) {
                customerService.atualizarStatusDoCliente(customer);
            }
            System.out.println("[DashboardService] Status de " + customers.size() + " clientes atualizados");
        } catch (Exception e) {
            System.err.println("[DashboardService] Erro ao atualizar status: " + e.getMessage());
        }
    }
}