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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final RiskReasonRepository riskReasonRepository;
    private final ContactLogRepository contactLogRepository;
    private final UserRepository userRepository;
    private final Base62Encoder encoder;

    public CustomerDetailDto pegarInformacoesDoCliente(String encodedId) {
        try {
            System.out.println("[CustomerService] Buscando detalhes do cliente: " + encodedId);
            Long id = encoder.decode(encodedId);
            System.out.println("[CustomerService] ID decodificado: " + id);
            
            Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));

        
            atualizarStatusDoCliente(customer);

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
        } catch (Exception e) {
            System.err.println("[CustomerService] Erro ao buscar detalhes: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao buscar detalhes do cliente: " + e.getMessage(), e);
        }
    }

    public Customer.Status calcularStatusDoCliente(double riskScore) {
        if (riskScore >= 0.9) {
            return Customer.Status.OVERDUE;
        }

        if (riskScore >= 0.7) {
            return Customer.Status.HIGH_RISK;
        }

        return Customer.Status.ACTIVE;
    }

    @Transactional
    public void atualizarStatusDoCliente(Customer customer) {
        try {
            System.out.println("[CustomerService] Atualizando status para cliente: " + customer.getName() + " (ID: " + customer.getId() + ")");
            
            Customer.Status oldStatus = customer.getStatus();
            Customer.Status newStatus;
            Double riskScore = customer.getRiskScore();
            
            System.out.println("[CustomerService] Risk Score: " + riskScore + ", Status atual: " + oldStatus);
            
            newStatus = calcularStatusDoCliente(riskScore);
            
            System.out.println("[CustomerService] Novo status calculado: " + newStatus);
            
            if (!newStatus.equals(oldStatus)) {
                customer.setStatus(newStatus);
                Customer savedCustomer = customerRepository.save(customer);
                System.out.println("[CustomerService] Status atualizado de " + oldStatus + " para " + savedCustomer.getStatus() + " (Score: " + riskScore + ")");
            } else {
                System.out.println("[CustomerService] Status já está correto: " + newStatus);
            }
            
        } catch (Exception e) {
            System.err.println("[CustomerService] Erro ao atualizar status: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    public void registrarContato(ContactRequest request) {
        try {
            System.out.println("[CustomerService] Registrando contato para: " + request.getCustomerId());
            Long customerId = encoder.decode(request.getCustomerId());
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println("[CustomerService] Usuário: " + email);
            
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
            System.out.println("[CustomerService] Contato registrado com sucesso!");
            
            atualizarStatusDoCliente(customer);
            
        } catch (Exception e) {
            System.err.println("[CustomerService] Erro ao registrar contato: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao registrar contato: " + e.getMessage(), e);
        }
    }
    

}
