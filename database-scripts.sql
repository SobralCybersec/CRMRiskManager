-- ========================================
-- SCRIPTS PARA MANIPULAÇÃO DIRETA DO BANCO
-- ========================================

-- 1. INSERIR NOVO CLIENTE
INSERT INTO customers (name, email, phone, cpf, address, city, state, enrollment_date, risk_score, status)
VALUES 
('Novo Cliente', 'cliente@email.com', '11987654321', '111.222.333-44', 'Rua Exemplo, 100', 'São Paulo', 'SP', CURRENT_DATE, 0.5, 'ACTIVE');

-- 2. INSERIR NOVO USUÁRIO (senha: 123456)
INSERT INTO users (name, email, password_hash, role)
VALUES 
('Novo Admin', 'novoadmin@saas.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- 3. INSERIR MOTIVO DE RISCO PARA UM CLIENTE
INSERT INTO risk_reasons (customer_id, reason, description, impact_score, detected_at)
VALUES 
(1, 'Devendo no Serasa', 'Cliente possui restrições no Serasa com dívidas acima de R$ 5.000', 0.4, CURRENT_TIMESTAMP);

-- 4. INSERIR PAGAMENTO
INSERT INTO payments (customer_id, due_date, paid_date, amount, status)
VALUES 
(1, CURRENT_DATE + INTERVAL '10 days', NULL, 299.90, 'PENDING');

-- 5. INSERIR LOG DE CONTATO
INSERT INTO contact_logs (customer_id, user_id, contact_type, notes, contacted_at)
VALUES 
(1, 1, 'PHONE', 'Cliente atendeu e prometeu pagar até sexta-feira', CURRENT_TIMESTAMP);

-- ========================================
-- CONSULTAS ÚTEIS
-- ========================================

-- Ver todos os clientes
SELECT id, name, email, phone, cpf, risk_score, status FROM customers ORDER BY risk_score DESC;

-- Ver todos os usuários
SELECT id, name, email, role FROM users;

-- Ver clientes com alto risco
SELECT id, name, email, risk_score, status FROM customers WHERE risk_score > 0.7;

-- Ver motivos de risco de um cliente específico
SELECT c.name, rr.reason, rr.description, rr.impact_score 
FROM customers c 
JOIN risk_reasons rr ON c.id = rr.customer_id 
WHERE c.id = 1;

-- Ver histórico de contatos de um cliente
SELECT c.name, cl.contact_type, cl.notes, cl.contacted_at, u.name as contacted_by
FROM customers c
JOIN contact_logs cl ON c.id = cl.customer_id
JOIN users u ON cl.user_id = u.id
WHERE c.id = 1
ORDER BY cl.contacted_at DESC;

-- Ver pagamentos em atraso
SELECT c.name, p.amount, p.due_date, p.status
FROM customers c
JOIN payments p ON c.id = p.customer_id
WHERE p.status = 'OVERDUE'
ORDER BY p.due_date;

-- ========================================
-- ATUALIZAR DADOS
-- ========================================

-- Atualizar score de risco de um cliente
UPDATE customers SET risk_score = 0.95, status = 'HIGH_RISK' WHERE id = 1;

-- Marcar pagamento como pago
UPDATE payments SET status = 'PAID', paid_date = CURRENT_DATE WHERE id = 1;

-- Atualizar dados de contato do cliente
UPDATE customers 
SET phone = '11999887766', 
    address = 'Nova Rua, 999', 
    city = 'São Paulo', 
    state = 'SP'
WHERE id = 1;

-- Promover usuário para ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'test@test.com';

-- ========================================
-- DELETAR DADOS
-- ========================================

-- Deletar cliente (cuidado: vai deletar em cascata!)
DELETE FROM customers WHERE id = 999;

-- Deletar usuário
DELETE FROM users WHERE id = 999;

-- Deletar motivo de risco
DELETE FROM risk_reasons WHERE id = 999;

-- Deletar log de contato
DELETE FROM contact_logs WHERE id = 999;

-- ========================================
-- ESTATÍSTICAS
-- ========================================

-- Contar clientes por status
SELECT status, COUNT(*) as total FROM customers GROUP BY status;

-- Contar pagamentos por status
SELECT status, COUNT(*) as total FROM payments GROUP BY status;

-- Média de score de risco
SELECT AVG(risk_score) as media_risco FROM customers;

-- Top 10 clientes com maior risco
SELECT name, email, risk_score, status 
FROM customers 
ORDER BY risk_score DESC 
LIMIT 10;

-- Clientes sem motivos de risco registrados
SELECT c.id, c.name, c.email, c.risk_score
FROM customers c
LEFT JOIN risk_reasons rr ON c.id = rr.customer_id
WHERE rr.id IS NULL;

-- ========================================
-- LIMPAR DADOS DE TESTE
-- ========================================

-- CUIDADO: Isso vai deletar TODOS os dados!
-- TRUNCATE TABLE contact_logs CASCADE;
-- TRUNCATE TABLE risk_reasons CASCADE;
-- TRUNCATE TABLE payments CASCADE;
-- TRUNCATE TABLE customers CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- ========================================
-- CONECTAR AO BANCO VIA TERMINAL
-- ========================================

-- docker exec -it saas-postgres psql -U postgres -d saas_inadimplencia
-- ou
-- psql -h localhost -U postgres -d saas_inadimplencia

-- ========================================
-- BACKUP E RESTORE
-- ========================================

-- Fazer backup:
-- docker exec -t saas-postgres pg_dump -U postgres saas_inadimplencia > backup.sql

-- Restaurar backup:
-- docker exec -i saas-postgres psql -U postgres saas_inadimplencia < backup.sql
