package com.saas.controller;

import com.saas.dto.ContactRequest;
import com.saas.dto.CustomerDetailDto;
import com.saas.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDetailDto> getCustomerDetails(@PathVariable String id) {
        return ResponseEntity.ok(customerService.getCustomerDetails(id));
    }

    @PostMapping("/contact")
    public ResponseEntity<Void> registerContact(@RequestBody ContactRequest request) {
        customerService.registerContact(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomersWithUpdatedStatus());
    }
}
