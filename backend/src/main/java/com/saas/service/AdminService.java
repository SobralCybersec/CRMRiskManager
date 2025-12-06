package com.saas.service;

import com.saas.entity.Customer;
import com.saas.entity.User;
import com.saas.repository.CustomerRepository;
import com.saas.repository.PaymentRepository;
import com.saas.repository.UserRepository;
import com.saas.repository.RiskReasonRepository;
import com.saas.repository.ContactLogRepository;
import com.saas.util.Base62Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final RiskReasonRepository riskReasonRepository;
    private final ContactLogRepository contactLogRepository;
    private final Base62Encoder encoder;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageService fileStorageService;

    public Map<String, Object> getAllData() {
        Map<String, Object> data = new HashMap<>();
        
        List<Map<String, Object>> customers = customerRepository.findAll().stream()
            .map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", encoder.encode(c.getId()));
                map.put("name", c.getName());
                map.put("email", c.getEmail());
                map.put("phone", c.getPhone());
                map.put("cpf", c.getCpf());
                map.put("riskScore", c.getRiskScore());
                map.put("status", c.getStatus());
                map.put("avatarUrl", c.getAvatarUrl());
                return map;
            }).collect(Collectors.toList());

        List<Map<String, Object>> users = userRepository.findAll().stream()
            .map(u -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", encoder.encode(u.getId()));
                map.put("name", u.getName());
                map.put("email", u.getEmail());
                map.put("role", u.getRole());
                return map;
            }).collect(Collectors.toList());

        data.put("customers", customers);
        data.put("users", users);
        data.put("payments", paymentRepository.count());
        
        return data;
    }

    @Transactional
    @CacheEvict(value = {"customerDetails", "dashboard"}, allEntries = true)
    public Customer saveCustomer(Customer customer) {
        if (customer.getEnrollmentDate() == null) {
            customer.setEnrollmentDate(LocalDate.now());
        }
        if (customer.getRiskScore() == null) {
            customer.setRiskScore(0.0);
        }
        if (customer.getStatus() == null) {
            customer.setStatus(Customer.Status.ACTIVE);
        }
        if (customer.getPhone() == null) {
            customer.setPhone("");
        }
        return customerRepository.save(customer);
    }
    
    @Transactional
    @CacheEvict(value = {"customerDetails", "dashboard"}, allEntries = true)
    public Customer updateCustomer(String encodedId, Customer customer) {
        Long id = encoder.decode(encodedId);
        Customer existing = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            
        if (customer.getName() != null) existing.setName(customer.getName());
        if (customer.getEmail() != null) existing.setEmail(customer.getEmail());
        if (customer.getPhone() != null) existing.setPhone(customer.getPhone());
        if (customer.getCpf() != null) existing.setCpf(customer.getCpf());
        if (customer.getAddress() != null) existing.setAddress(customer.getAddress());
        if (customer.getCity() != null) existing.setCity(customer.getCity());
        if (customer.getState() != null) existing.setState(customer.getState());
        if (customer.getRiskScore() != null) existing.setRiskScore(customer.getRiskScore());
        if (customer.getStatus() != null) existing.setStatus(customer.getStatus());
        if (customer.getAvatarUrl() != null) existing.setAvatarUrl(customer.getAvatarUrl());
        
        return customerRepository.save(existing);
    }

    @Transactional
    @CacheEvict(value = {"customerDetails", "dashboard"}, allEntries = true)
    public void deleteCustomer(String encodedId) {
        Long id = encoder.decode(encodedId);
    
        customerRepository.findById(id).ifPresent(c -> {
            if (c.getAvatarUrl() != null) {
                fileStorageService.deleteFile(c.getAvatarUrl());
            }
        });
      

        contactLogRepository.findByCustomerIdOrderByContactedAtDesc(id).forEach(contactLogRepository::delete);
        riskReasonRepository.findByCustomerId(id).forEach(riskReasonRepository::delete);
        paymentRepository.findAll().stream()
            .filter(p -> p.getCustomer().getId().equals(id))
            .forEach(paymentRepository::delete);
        customerRepository.deleteById(id);
    }

    @Transactional
    public User saveUser(User user) {
        if (user.getId() == null && user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$")) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String encodedId) {
        userRepository.deleteById(encoder.decode(encodedId));
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalCustomers = customerRepository.count();
        long totalUsers = userRepository.count();
        long totalPayments = paymentRepository.count();
        long totalContacts = contactLogRepository.count();
        
        List<Customer> customers = customerRepository.findAll();
        Map<String, Long> riskDistribution = customers.stream()
            .collect(Collectors.groupingBy(
                c -> getRiskLevel(c.getRiskScore()),
                Collectors.counting()
            ));
        
        Map<String, Long> statusDistribution = customers.stream()
            .collect(Collectors.groupingBy(
                c -> c.getStatus().toString(),
                Collectors.counting()
            ));
        
        Map<String, Long> customersByMonth = customers.stream()
            .filter(c -> c.getEnrollmentDate() != null)
            .filter(c -> c.getEnrollmentDate().isAfter(LocalDate.now().minusMonths(6)))
            .collect(Collectors.groupingBy(
                c -> c.getEnrollmentDate().getYear() + "-" + 
                     String.format("%02d", c.getEnrollmentDate().getMonthValue()),
                Collectors.counting()
            ));
        
        Map<String, Double> avgScoreByStatus = customers.stream()
            .collect(Collectors.groupingBy(
                c -> c.getStatus().toString(),
                Collectors.averagingDouble(Customer::getRiskScore)
            ));
        
        List<Map<String, Object>> topRiskCustomers = customers.stream()
            .sorted((c1, c2) -> Double.compare(c2.getRiskScore(), c1.getRiskScore()))
            .limit(5)
            .map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", encoder.encode(c.getId()));
                map.put("name", c.getName());
                map.put("riskScore", c.getRiskScore());
                map.put("status", c.getStatus().toString());
                return map;
            })
            .collect(Collectors.toList());
        
        stats.put("totals", Map.of(
            "customers", totalCustomers,
            "users", totalUsers,
            "payments", totalPayments,
            "contacts", totalContacts
        ));
        
        stats.put("riskDistribution", riskDistribution);
        stats.put("statusDistribution", statusDistribution);
        stats.put("customersByMonth", customersByMonth);
        stats.put("avgScoreByStatus", avgScoreByStatus);
        stats.put("topRiskCustomers", topRiskCustomers);
        
        return stats;
    }
    
    private String getRiskLevel(Double score) {
        if (score == null) return "UNKNOWN";
        if (score >= 0.8) return "CRITICAL";
        if (score >= 0.6) return "HIGH";
        if (score >= 0.4) return "MEDIUM";
        return "LOW";
    }
}
