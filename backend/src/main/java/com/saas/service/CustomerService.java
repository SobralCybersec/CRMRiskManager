package com.saas.service;

import com.saas.dto.ContactRequest;
import com.saas.dto.CustomerDetailDto;
import com.saas.entity.ContactLog;
import com.saas.entity.Customer;
import com.saas.entity.User;
import com.saas.repository.ContactLogRepository;
import com.saas.repository.CustomerRepository;
import com.saas.repository.RiskReasonRepository;
import com.saas.repository.UserRepository;
import com.saas.util.Base62Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final RiskReasonRepository riskReasonRepository;
    private final ContactLogRepository contactLogRepository;
    private final UserRepository userRepository;
    private final Base62Encoder encoder;

    public CustomerDetailDto getCustomerDetails(String encodedId) {
        Long id = encoder.decode(encodedId);
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));

        updateCustomerStatus(customer);

        var riskReasons = riskReasonRepository.findByCustomerId(id).stream()
                .map(r -> new CustomerDetailDto.RiskReasonDto(r.getReason(), r.getDescription(), r.getImpactScore()))
                .collect(Collectors.toList());

        var contactHistory = contactLogRepository.findByCustomerIdOrderByContactedAtDesc(id).stream()
                .map(c -> new CustomerDetailDto.ContactLogDto(
                        c.getContactType(), c.getNotes(), c.getContactedAt().toString(), c.getUser().getName()
                ))
                .collect(Collectors.toList());

        return new CustomerDetailDto(
                encodedId, customer.getName(), customer.getEmail(), customer.getPhone(),
                customer.getCpf(), customer.getAddress(), customer.getCity(), customer.getState(),
                customer.getEnrollmentDate(), customer.getRiskScore(), customer.getStatus().name(),
                riskReasons, contactHistory
        );
    }

    public List<Map<String, Object>> getAllCustomersWithUpdatedStatus() {
        List<Customer> customers = customerRepository.findAll();
        customers.forEach(this::updateCustomerStatus);

        return customers.stream()
                .map(this::mapCustomerToDto)
                .collect(Collectors.toList());
    }

    private Map<String, Object> mapCustomerToDto(Customer customer) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", encoder.encode(customer.getId()));
        map.put("name", customer.getName());
        map.put("email", customer.getEmail());
        map.put("phone", customer.getPhone());
        map.put("riskScore", customer.getRiskScore());
        map.put("status", customer.getStatus());
        map.put("avatarUrl", customer.getAvatarUrl());
        return map;
    }

    public Customer.Status calculateCustomerStatus(double riskScore) {
        if (riskScore >= 0.9) {
            return Customer.Status.OVERDUE;
        }

        if (riskScore >= 0.7) {
            return Customer.Status.HIGH_RISK;
        }

        return Customer.Status.ACTIVE;
    }

    @Transactional
    public void updateCustomerStatus(Customer customer) {
        Customer.Status newStatus = calculateCustomerStatus(customer.getRiskScore());

        if (!newStatus.equals(customer.getStatus())) {
            customer.setStatus(newStatus);
            customerRepository.save(customer);
        }
    }

    @Transactional
    public void registerContact(ContactRequest request) {
        Long customerId = encoder.decode(request.getCustomerId());
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        ContactLog log = new ContactLog();
        log.setCustomer(customer);
        log.setUser(user);
        log.setContactType(request.getContactType());
        log.setNotes(request.getNotes());
        contactLogRepository.save(log);

        updateCustomerStatus(customer);
    }
}
