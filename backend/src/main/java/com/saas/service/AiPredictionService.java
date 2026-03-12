package com.saas.service;

import com.saas.dto.CustomerDataRequest;
import com.saas.dto.RiskPredictionResponse;
import com.saas.entity.Customer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiPredictionService {

    @Value("${ai.service.url:http://localhost:8001}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public RiskPredictionResponse predictRisk(Customer customer) {
        try {
            log.info("Chamando AI Service para cliente ID: {}", customer.getId());

            CustomerDataRequest request = buildCustomerDataRequest(customer);

            RiskPredictionResponse response = restTemplate.postForObject(
                    aiServiceUrl + "/predict-risk",
                    request,
                    RiskPredictionResponse.class
            );

            log.info("AI Service retornou score: {} para cliente: {}",
                    response.getRisk_score(), customer.getId());

            return response;

        } catch (ResourceAccessException e) {
            log.warn("AI Service indisponível, usando fallback para cliente: {}", customer.getId());
            return createFallbackPrediction(customer);
        } catch (Exception e) {
            log.error("Erro ao chamar AI Service: {}", e.getMessage());
            return createFallbackPrediction(customer);
        }
    }

    private CustomerDataRequest buildCustomerDataRequest(Customer customer) {
        int daysSinceEnrollment = (int) ChronoUnit.DAYS.between(
                customer.getEnrollmentDate(), LocalDate.now()
        );


        int overdueCount = simulateOverdueCount(customer);
        int lastPaymentDays = simulateLastPaymentDays(customer);

        log.info("Dados enviados para IA - Cliente: {}, Dias: {}, Score: {}, Atrasos: {}, Último pagamento: {}",
                customer.getId(), daysSinceEnrollment, customer.getRiskScore(), overdueCount, lastPaymentDays);

        return new CustomerDataRequest(
                customer.getId(),
                daysSinceEnrollment,
                customer.getRiskScore(),
                overdueCount,
                lastPaymentDays
        );
    }

    private int simulateOverdueCount(Customer customer) {
        long seed = customer.getId() * 7;

        if (customer.getRiskScore() > 0.8) {
            return 4 + (int) (seed % 3);
        }

        if (customer.getRiskScore() > 0.6) {
            return 2 + (int) (seed % 2);
        }

        if (customer.getRiskScore() > 0.4) {
            return (int) (seed % 2);
        }

        return 0;
    }

    private int simulateLastPaymentDays(Customer customer) {
        long seed = customer.getId() * 11;

        if (customer.getRiskScore() > 0.8) {
            return 45 + (int) (seed % 30);
        }

        if (customer.getRiskScore() > 0.6) {
            return 20 + (int) (seed % 20);
        }

        if (customer.getRiskScore() > 0.4) {
            return 5 + (int) (seed % 15);
        }

        return (int) (seed % 10);
    }

    private RiskPredictionResponse createFallbackPrediction(Customer customer) {
        Double currentScore = customer.getRiskScore();
        String riskLevel = getRiskLevel(currentScore);

        return new RiskPredictionResponse(
                customer.getId(),
                currentScore,
                riskLevel
        );
    }

    private String getRiskLevel(Double score) {
        if (score >= 0.8) {
            return "CRITICAL";
        }

        if (score >= 0.6) {
            return "HIGH";
        }

        if (score >= 0.4) {
            return "MEDIUM";
        }

        return "LOW";
    }
}