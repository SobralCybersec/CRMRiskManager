-- Schema para separação de dados
CREATE SCHEMA IF NOT EXISTS public;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_customer_risk_score ON customers(risk_score);
CREATE INDEX IF NOT EXISTS idx_customer_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_payment_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_customer ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_risk_reason_customer ON risk_reasons(customer_id);
CREATE INDEX IF NOT EXISTS idx_contact_log_customer ON contact_logs(customer_id);
