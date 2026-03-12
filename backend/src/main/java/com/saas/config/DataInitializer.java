package com.saas.config;

import com.saas.entity.Customer;
import com.saas.entity.Payment;
import com.saas.entity.RiskReason;
import com.saas.entity.User;
import com.saas.repository.CustomerRepository;
import com.saas.repository.PaymentRepository;
import com.saas.repository.RiskReasonRepository;
import com.saas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PaymentRepository paymentRepository;
    private final RiskReasonRepository riskReasonRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createDefaultUsers();
        createSampleData();
    }

    private void createDefaultUsers() {
        if (!userRepository.existsByEmail("admin@crm.com")) {
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail("admin@crm.com");
            admin.setPasswordHash(passwordEncoder.encode("123456"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("user@crm.com")) {
            User test = new User();
            test.setName("Usuário");
            test.setEmail("user@crm.com");
            test.setPasswordHash(passwordEncoder.encode("123"));
            test.setRole(User.Role.USER);
            userRepository.save(test);
        }
    }

    private void createSampleData() {
        if (customerRepository.count() > 0) {
            return;
        }

        Customer c1 = createCustomer("João Silva", "joao@email.com", "11999999999", "123.456.789-00",
                "Rua A, 123", "São Paulo", "SP", 6, 0.85, Customer.Status.HIGH_RISK);

        Customer c2 = createCustomer("Maria Santos", "maria@email.com", "11888888888", "234.567.890-11",
                "Rua B, 456", "Rio de Janeiro", "RJ", 3, 0.45, Customer.Status.ACTIVE);

        Customer c3 = createCustomer("Pedro Costa", "pedro@email.com", "11777777777", "345.678.901-22",
                "Rua C, 789", "Belo Horizonte", "MG", 12, 0.75, Customer.Status.HIGH_RISK);

        Customer c4 = createCustomer("Ana Lima", "ana@email.com", "11666666666", "456.789.012-33",
                "Rua D, 321", "Curitiba", "PR", 2, 0.25, Customer.Status.ACTIVE);

        Customer c5 = createCustomer("Carlos Souza", "carlos@email.com", "11555555555", "567.890.123-44",
                "Rua E, 654", "Porto Alegre", "RS", 8, 0.90, Customer.Status.OVERDUE);

        createPayments(c1, c2, c3, c4, c5);
        createRiskReasons(c1, c3, c5);
    }

    private Customer createCustomer(String name, String email, String phone, String cpf,
                                    String address, String city, String state,
                                    int monthsAgo, double riskScore, Customer.Status status) {
        Customer customer = new Customer();
        customer.setName(name);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setCpf(cpf);
        customer.setAddress(address);
        customer.setCity(city);
        customer.setState(state);
        customer.setEnrollmentDate(LocalDate.now().minusMonths(monthsAgo));
        customer.setRiskScore(riskScore);
        customer.setStatus(status);
        return customerRepository.save(customer);
    }

    private void createPayments(Customer c1, Customer c2, Customer c3, Customer c4, Customer c5) {
        paymentRepository.save(new Payment(null, c1, LocalDate.now().minusDays(5), null,
                new BigDecimal("299.90"), Payment.Status.OVERDUE));

        paymentRepository.save(new Payment(null, c2, LocalDate.now().plusDays(10), null,
                new BigDecimal("199.90"), Payment.Status.PENDING));

        paymentRepository.save(new Payment(null, c3, LocalDate.now().minusDays(15), null,
                new BigDecimal("399.90"), Payment.Status.OVERDUE));

        paymentRepository.save(new Payment(null, c4, LocalDate.now().plusDays(5),
                LocalDate.now().minusDays(2), new BigDecimal("149.90"), Payment.Status.PAID));

        paymentRepository.save(new Payment(null, c5, LocalDate.now().minusDays(30), null,
                new BigDecimal("499.90"), Payment.Status.OVERDUE));
    }

    private void createRiskReasons(Customer c1, Customer c3, Customer c5) {
        riskReasonRepository.save(new RiskReason(null, c1, "Devendo no Serasa",
                "Cliente possui restrições no Serasa com dívidas acima de R$ 5.000", 0.4, null));

        riskReasonRepository.save(new RiskReason(null, c1, "Atraso de Pagamento",
                "Histórico de 3 atrasos nos últimos 6 meses", 0.3, null));

        riskReasonRepository.save(new RiskReason(null, c3, "Múltiplos Atrasos",
                "Cliente atrasou 5 pagamentos no último ano", 0.5, null));

        riskReasonRepository.save(new RiskReason(null, c5, "Inadimplência Crítica",
                "Pagamento em atraso há mais de 30 dias", 0.6, null));
    }
}