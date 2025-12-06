# CRM Risk Manager

<p><strong style="font-size: 15px;">
    Sistema completo de gestão de clientes com análise de risco e relatórios profissionais.
  </strong></p>

## Demonstração:

<img src="https://i.imgur.com/qIy6qsK.png" width="800">

## System Design:

<img src="https://i.imgur.com/GkWtTIB.png" width="800">

## 🚀 Stack Tecnológica

<div style="display: flex; align-items: center; gap: 6px;">
  <h3 style="margin: 0;">Front-End</h3>
  <img src="https://skillicons.dev/icons?i=react" height="30" alt="react logo" />
  <img src="https://skillicons.dev/icons?i=tailwind" height="30" alt="tailwind logo" />
  <img src="https://skillicons.dev/icons?i=vite" height="30" alt="vite logo" />
</div>

- **React 18** + Vite + Tailwind CSS
- **Porta**: 5175
- **Localização**: `/frontend`

<div style="display: flex; align-items: center; gap: 6px;">
  <h3 style="margin: 0;">Back-End</h3>
  <img src="https://skillicons.dev/icons?i=java" height="30" alt="java logo" />
  <img src="https://skillicons.dev/icons?i=spring" height="30" alt="spring logo" />
  <img src="https://skillicons.dev/icons?i=redis" height="30" alt="redis logo" />
</div>

- **Java 17** + Spring Boot 3
- **Porta**: 8080
- **Localização**: `/backend`
- **Features**: JWT Auth, Base62, Cache Redis

<div style="display: flex; align-items: center; gap: 6px;">
  <h3 style="margin: 0;">Analytics Service</h3>
  <img src="https://skillicons.dev/icons?i=python" height="30" alt="python logo" />
  <img src="https://skillicons.dev/icons?i=fastapi" height="30" alt="fastapi logo" />
</div>

- **Python** + FastAPI + XlsxWriter
- **Porta**: 8001
- **Localização**: `/backend-python`
- **Features**: Relatórios Excel, Analytics

<div style="display: flex; align-items: center; gap: 6px;">
  <h3 style="margin: 0;">Banco de Dados</h3>
  <img src="https://skillicons.dev/icons?i=postgres" height="30" alt="postgres logo" />
  <img src="https://skillicons.dev/icons?i=redis" height="30" alt="redis logo" />
  <img src="https://skillicons.dev/icons?i=docker" height="30" alt="docker logo" />
</div>

- **PostgreSQL 15** (porta 5432)
- **Redis 7** (porta 6379)

## 📦 Como executar

### 1. Banco de dados (Docker)
```bash
# PostgreSQL
docker run --name postgres-saas -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=saas_inadimplencia -p 5432:5432 -d postgres:15

# Redis
docker run --name redis-saas -p 6379:6379 -d redis:7
```

### 2. Backend Spring Boot
```bash
cd backend
mvn spring-boot:run
# Acesse: http://localhost:8080
```

### 3. Analytics Service (FastAPI)
```bash
cd backend-python
pip install -r requirements.txt
python main.py
# Acesse: http://localhost:8001
```

### 4. Frontend React
```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5175
```

## 🎯 Funcionalidades
- ✅ Dashboard de risco com analytics em tempo real
- ✅ Gestão completa de clientes (CRM)
- ✅ API REST com Base62 e autenticação JWT
- ✅ Sistema de contato com histórico
- ✅ Análise de risco automática
- ✅ Relatórios Excel profissionais
- ✅ Painel Admin completo
- ✅ Estatísticas e gráficos interativos

## 📊 Endpoints principais
- `POST /api/auth/login` - Login
- `GET /api/dashboard` - Dashboard (cached)
- `GET /api/customers` - Lista clientes
- `GET /api/customers/{id}` - Detalhes + riscos
- `POST /api/customers/contact` - Registrar contato
- `GET /api/admin/data` - Painel admin (ADMIN only)
- `POST /api/admin/customers` - Criar cliente
- `DELETE /api/admin/customers/{id}` - Deletar
- `GET /export/customers-excel` - Relatório Excel

## 🔐 Credenciais
- **Admin**: admin@crm.com / 123456
- **User**: user@crm.com / 123

## 🛠️ Debug
```bash
# PostgreSQL
docker exec -it postgres-saas psql -U postgres -d saas_inadimplencia

# Redis
docker exec -it redis-saas redis-cli
```

## 🛑 Parar os serviços

### Parar aplicações
```bash
# Frontend, Backend e FastAPI
# Pressione Ctrl+C no terminal de cada serviço
```

### Parar containers Docker
```bash
# Parar containers
docker compose down

# Ver containers rodando
docker ps
```
