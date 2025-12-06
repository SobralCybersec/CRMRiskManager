package com.saas.config;

import com.saas.entity.User;
import com.saas.entity.Customer;
import com.saas.entity.Payment;
import com.saas.entity.RiskReason;
import com.saas.repository.UserRepository;
import com.saas.repository.CustomerRepository;
import com.saas.repository.PaymentRepository;
import com.saas.repository.RiskReasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.math.BigDecimal;

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
        if (!userRepository.existsByEmail("admin@crm.com")) {
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail("admin@crm.com");
            admin.setPasswordHash(passwordEncoder.encode("123456"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Usuário admin criado: admin@crm.com / 123456");
        }
        
        if (!userRepository.existsByEmail("user@crm.com")) {
            User test = new User();
            test.setName("Usuário");
            test.setEmail("user@crm.com");
            test.setPasswordHash(passwordEncoder.encode("123"));
            test.setRole(User.Role.USER);
            userRepository.save(test);
            System.out.println("✅ Usuário teste criado: user@crm.com / 123");
        }
        
        createSampleData();
    }
    
    private void createSampleData() {
        if (customerRepository.count() == 0) {
            Customer c1 = new Customer();
            c1.setName("João Silva"); c1.setEmail("joao@email.com"); c1.setPhone("11999999999");
            c1.setCpf("123.456.789-00"); c1.setAddress("Rua A, 123"); c1.setCity("São Paulo"); c1.setState("SP");
            c1.setEnrollmentDate(LocalDate.now().minusMonths(6)); c1.setRiskScore(0.85); c1.setStatus(Customer.Status.HIGH_RISK);
            
            Customer c2 = new Customer();
            c2.setName("Maria Santos"); c2.setEmail("maria@email.com"); c2.setPhone("11888888888");
            c2.setCpf("234.567.890-11"); c2.setAddress("Rua B, 456"); c2.setCity("Rio de Janeiro"); c2.setState("RJ");
            c2.setEnrollmentDate(LocalDate.now().minusMonths(3)); c2.setRiskScore(0.45); c2.setStatus(Customer.Status.ACTIVE);
            
            Customer c3 = new Customer();
            c3.setName("Pedro Costa"); c3.setEmail("pedro@email.com"); c3.setPhone("11777777777");
            c3.setCpf("345.678.901-22"); c3.setAddress("Rua C, 789"); c3.setCity("Belo Horizonte"); c3.setState("MG");
            c3.setEnrollmentDate(LocalDate.now().minusMonths(12)); c3.setRiskScore(0.75); c3.setStatus(Customer.Status.HIGH_RISK);
            
            Customer c4 = new Customer();
            c4.setName("Ana Lima"); c4.setEmail("ana@email.com"); c4.setPhone("11666666666");
            c4.setCpf("456.789.012-33"); c4.setAddress("Rua D, 321"); c4.setCity("Curitiba"); c4.setState("PR");
            c4.setEnrollmentDate(LocalDate.now().minusMonths(2)); c4.setRiskScore(0.25); c4.setStatus(Customer.Status.ACTIVE);
            
            Customer c5 = new Customer();
            c5.setName("Carlos Souza"); c5.setEmail("carlos@email.com"); c5.setPhone("11555555555");
            c5.setCpf("567.890.123-44"); c5.setAddress("Rua E, 654"); c5.setCity("Porto Alegre"); c5.setState("RS");
            c5.setEnrollmentDate(LocalDate.now().minusMonths(8)); c5.setRiskScore(0.90); c5.setStatus(Customer.Status.OVERDUE);
            
            customerRepository.save(c1);
            customerRepository.save(c2);
            customerRepository.save(c3);
            customerRepository.save(c4);
            customerRepository.save(c5);
            
            Payment p1 = new Payment(null, c1, LocalDate.now().minusDays(5), null, new BigDecimal("299.90"), Payment.Status.OVERDUE);
            Payment p2 = new Payment(null, c2, LocalDate.now().plusDays(10), null, new BigDecimal("199.90"), Payment.Status.PENDING);
            Payment p3 = new Payment(null, c3, LocalDate.now().minusDays(15), null, new BigDecimal("399.90"), Payment.Status.OVERDUE);
            Payment p4 = new Payment(null, c4, LocalDate.now().plusDays(5), LocalDate.now().minusDays(2), new BigDecimal("149.90"), Payment.Status.PAID);
            Payment p5 = new Payment(null, c5, LocalDate.now().minusDays(30), null, new BigDecimal("499.90"), Payment.Status.OVERDUE);
            
            paymentRepository.save(p1);
            paymentRepository.save(p2);
            paymentRepository.save(p3);
            paymentRepository.save(p4);
            paymentRepository.save(p5);
            
            RiskReason r1 = new RiskReason(null, c1, "Devendo no Serasa", "Cliente possui restrições no Serasa com dívidas acima de R$ 5.000", 0.4, null);
            RiskReason r2 = new RiskReason(null, c1, "Atraso de Pagamento", "Histórico de 3 atrasos nos últimos 6 meses", 0.3, null);
            RiskReason r3 = new RiskReason(null, c3, "Múltiplos Atrasos", "Cliente atrasou 5 pagamentos no último ano", 0.5, null);
            RiskReason r4 = new RiskReason(null, c5, "Inadimplência Crítica", "Pagamento em atraso há mais de 30 dias", 0.6, null);
            
            riskReasonRepository.save(r1);
            riskReasonRepository.save(r2);
            riskReasonRepository.save(r3);
            riskReasonRepository.save(r4);
            
            System.out.println("✅ Dados de exemplo criados: 5 clientes, 5 pagamentos e 4 motivos de risco");
        }
    }
}