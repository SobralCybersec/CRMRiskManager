package com.saas.controller;

import com.saas.dto.ContactRequest;
import com.saas.dto.CustomerDetailDto;
import com.saas.entity.Customer;
import com.saas.repository.CustomerRepository;
import com.saas.service.CustomerService;
import com.saas.util.Base62Encoder;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;
    private final CustomerRepository customerRepository;
    private final Base62Encoder encoder;

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDetailDto> pegarInformacoesDoCliente(@PathVariable String id) {
        return ResponseEntity.ok(customerService.pegarInformacoesDoCliente(id));
    }

    @PostMapping("/contact")
    public ResponseEntity<Void> registrarContato(@RequestBody ContactRequest request) {
        customerService.registrarContato(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers() {
        List<Customer> allCustomers = customerRepository.findAll();
        
        for (Customer customer : allCustomers) {
            customerService.atualizarStatusDoCliente(customer);
        }
        
        List<Map<String, Object>> customers = customerRepository.findAll().stream()
            .map(c -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", encoder.encode(c.getId()));
                map.put("name", c.getName());
                map.put("email", c.getEmail());
                map.put("phone", c.getPhone());
                map.put("riskScore", c.getRiskScore());
                map.put("status", c.getStatus());
                map.put("avatarUrl", c.getAvatarUrl());
                return map;
            }).collect(Collectors.toList());
        return ResponseEntity.ok(customers);
    }
}
