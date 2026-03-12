<div align="center">

<h1 align="center">
  <img src="https://i.imgur.com/320rEXW.png" width="30" />
  CRM Risk Manager
</h1>

* Sistema completo de gestão de clientes
* Análise de risco em tempo real
* Relatórios profissionais automatizados
* Arquitetura Hexagonal (Ports & Adapters)
* Microserviços com Spring Boot e FastAPI

---

<h1 align="center">
  <img src="https://i.imgur.com/VN6wG7g.gif" width="30"/>
  Demonstração
</h1>

<img src="https://i.imgur.com/lb6yJ9m.png" width="800">

---

<img src="https://i.imgur.com/I3U5YBB.png" width="800">

---

<img src="https://i.imgur.com/0GnF0ZV.png" width="800">

---

<img src="https://i.imgur.com/nhHMptE.png" width="800">

---

<h1 align="center">
  <img src="https://i.imgur.com/vSRgNpa.gif" width="30"/>
  Documentação
</h1>

Sistema CRM com análise de risco automática, dashboard analytics e geração de relatórios Excel. Ideal para gestão de inadimplência e controle de clientes.

</div>

---

<h1 align="center">
  <img src="https://i.imgur.com/dwyUWDH.gif" width="30"/> Features
</h1>

* **Dashboard Analytics**: métricas em tempo real com cache Redis
* **Gestão de Clientes**: CRUD completo com histórico de contatos
* **Upload de Avatar**: sistema de upload de imagens para clientes
* **Análise de Risco**: classificação automática de inadimplência
* **Relatórios Excel**: exportação profissional com XlsxWriter
* **Autenticação JWT**: segurança com roles (ADMIN/USER)
* **Rate Limiting**: proteção contra abuso (100 req/min por IP)
* **Security Headers**: proteção contra ataques comuns
* **Base62 Encoding**: IDs otimizados para URLs
* **Arquitetura Hexagonal**: separação clara entre domínio e infraestrutura
* **Microserviços**: Spring Boot (Java) + FastAPI (Python)

---

<h1 align="center">
  <img src="https://i.imgur.com/eu3StDB.gif" width="30"/> Tech Stack
</h1>

<p align="center">
  <img src="https://go-skill-icons.vercel.app/api/icons?i=java,spring,postgres,redis,python,fastapi,react,tailwind,docker&size=64" />
</p>

---

**Backend Java**
* Java 17
* Spring Boot 3.3.0
* Spring Security + JWT (0.12.3)
* Spring Data JPA
* Spring Cache + Redis
* Rate Limiting (Bucket4j 8.10.1)
* PostgreSQL 15
* Redis 7
* Maven 3.9+
* Lombok

**Backend Python**
* Python 3.11+
* FastAPI
* XlsxWriter
* Uvicorn

**Frontend**
* React 18
* Vite
* Tailwind CSS

---

<h1 align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/1157/1157109.png" width="30"/> Architecture | System Design
</h1>

<div align="center">

<img src="https://i.imgur.com/GkWtTIB.png" width="800">

---

• O projeto segue **Arquitetura Hexagonal (Ports & Adapters)**.

• Fundamentos com SOLID e Clean Code.

• Separação clara entre domínio, portas e adaptadores.
</div>

---

<h1 align="center">
  <img src="https://i.imgur.com/Jvttz1s.png" width="30"/> System Flow | Fluxo
</h1>

<div align="center">
  
```
Cliente faz login (JWT)
        ↓
Acessa Dashboard (cache Redis)
        ↓
Visualiza clientes com risco
        ↓
Registra contato no histórico
        ↓
Exporta relatório Excel (FastAPI)
        ↓
Admin gerencia dados (CRUD)
```
</div>

---

<h1 align="center">
  <img src="https://i.imgur.com/rNaTn43.png" width="30"/> Estrutura do Projeto
</h1>

```
SaasEdu/
├── backend/              # Spring Boot (Java 17)
│   ├── config/           # Configurações (Security, Redis, Rate Limit, File Upload)
│   ├── controller/       # Endpoints REST
│   ├── dto/              # Data Transfer Objects
│   ├── entity/           # Entidades JPA
│   ├── exception/        # Global exception handler
│   ├── repository/       # Acesso a dados (JPA)
│   ├── security/         # JWT + Rate Limiting filters
│   ├── service/          # Lógica de negócio
│   ├── util/             # Utilitários (Base62 Encoder)
│   └── uploads/          # Diretório de avatares
├── backend-python/       # FastAPI (Python)
│   ├── main.py           # Servidor FastAPI
│   └── reports/          # Relatórios Excel gerados
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── hooks/        # Custom hooks (auth, customers, darkMode)
│   │   ├── pages/        # Páginas da aplicação
│   │   ├── services/     # API calls
│   │   └── utils/        # Utilitários
│   └── public/
└── .amazonq/rules/       # Clean Code guidelines
```

<h1 align="center">
  <img src="https://i.imgur.com/PFZmPWb.gif" width="30"/> Como Executar
</h1>

**Pré-requisitos**

* Docker Desktop instalado
* Docker Compose

**Execução com Docker (Recomendado)**

```bash
# Clone o repositório
git clone <seu-repositorio>

# Inicie todos os serviços
start.bat

# Ou manualmente:
docker-compose up --build -d
```

**Acessar a aplicação:**

* Frontend: http://localhost:5175
* Backend API: http://localhost:8080
* Python API: http://localhost:8001
* PostgreSQL: localhost:5432
* Redis: localhost:6379

**Comandos úteis:**

```bash
# Ver logs
logs.bat
# ou
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f backend-python
docker-compose logs -f frontend

# Parar serviços
stop.bat
# ou
docker-compose down

# Rebuild completo
rebuild.bat
# ou
docker-compose up --build -d

# Restart serviços específicos
restart-services.bat
# ou
docker-compose restart backend-python frontend

# Ver status dos serviços
docker-compose ps

# Acessar container
docker exec -it saas-backend sh
docker exec -it saas-postgres psql -U postgres -d saas_inadimplencia
```

---

**Execução Manual (Desenvolvimento)**

**1. Banco de Dados (Docker)**

```bash
# PostgreSQL
docker run --name postgres-saas \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=saas_inadimplencia \
  -p 5432:5432 -d postgres:15

# Redis
docker run --name redis-saas -p 6379:6379 -d redis:7
```

**2. Backend Spring Boot**

```bash
cd backend
mvn clean package
java -jar target/saas-backend.jar
# Acesse: http://localhost:8080
```

**3. Analytics Service (FastAPI)**

```bash
cd backend-python
pip install -r requirements.txt
python main.py
# Acesse: http://localhost:8001
```

**4. Frontend React**

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5175
```

<h1 align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/2103/2103633.png" width="30"/> API Endpoints
</h1>

**Autenticação**

```json
POST /api/auth/login
{
  "email": "admin@crm.com",
  "password": "123456"
}
```

**Resposta (200 OK)**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "ADMIN"
}
```

**Dashboard**

```bash
GET /api/dashboard
Authorization: Bearer {token}
```

**Clientes**

```bash
GET /api/customers              # Lista todos
GET /api/customers/{id}         # Detalhes + análise de risco
POST /api/customers/contact     # Registrar contato
```

**Upload**

```bash
POST /api/upload/avatar         # Upload de avatar (multipart/form-data)
# Retorna: {"url": "/uploads/avatars/uuid.jpg"}
```

**Admin (ADMIN only)**

```bash
GET /api/admin/data             # Painel administrativo
GET /api/admin/statistics       # Estatísticas detalhadas
POST /api/admin/customers       # Criar cliente
PUT /api/admin/customers/{id}   # Atualizar cliente
DELETE /api/admin/customers/{id} # Deletar cliente
POST /api/admin/users           # Criar usuário
PUT /api/admin/users/{id}       # Atualizar usuário
DELETE /api/admin/users/{id}    # Deletar usuário
```

**Relatórios (FastAPI)**

```bash
GET /export/customers-excel     # Download Excel
```

---

<h1 align="center">
  <img src="https://i.imgur.com/6nSJzZ2.gif" width="30"/> Credenciais de Teste
</h1>

**Admin**
* Email: admin@crm.com
* Senha: 123456

**User**
* Email: user@crm.com
* Senha: 123

---

<h1 align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/2092/2092663.png" width="30"/> Segurança
</h1>

**Autenticação e Autorização**
* JWT (JSON Web Tokens) com expiração de 24h
* BCrypt para hash de senhas
* Roles (ADMIN/USER) com controle de acesso
* Tokens stateless para escalabilidade

**Proteções Implementadas**
* Rate Limiting: 100 requisições por minuto por IP (Bucket4j)
* CORS configurado para origens específicas
* Sessões stateless (sem cookies de sessão)
* Headers de segurança configurados
* Stacktraces e mensagens de erro ocultas em produção
* SQL logs desabilitados em produção
* Global Exception Handler para respostas padronizadas
* Upload de arquivos com validação (apenas imagens, máx 5MB)
* Filtros de segurança em cadeia (Rate Limit + JWT)

**Variáveis de Ambiente Sensíveis**
* JWT_SECRET: chave secreta para assinatura de tokens
* Database credentials via environment variables
* AI Service URL configurável

**Monitoramento**
* Spring Boot Actuator health endpoint
* Rate limit headers (X-Rate-Limit-Remaining)

---

<h1 align="center">
  <img src="https://i.imgur.com/O7HwCZt.gif" width="30"/> Roadmap
</h1>

* [x] Dashboard analytics com cache Redis
* [x] Gestão de clientes (CRUD)
* [x] Upload de avatar para clientes
* [x] Análise de risco automática
* [x] Relatórios Excel profissionais
* [x] Autenticação JWT
* [x] Rate Limiting (100 req/min)
* [x] Security Headers
* [x] Global Exception Handler
* [x] Arquitetura Hexagonal
* [x] Microserviços (Java + Python)
* [x] Docker Compose completo
* [x] Base62 Encoding para IDs
* [x] Painel administrativo completo
* [ ] Notificações em tempo real (WebSocket)
* [ ] Integração com APIs de crédito
* [ ] Machine Learning para predição de risco

---

<h1 align="center"><img src="https://i.imgur.com/6nSJzZ2.gif" width="35"/> Referências e Documentações utilizadas</h1>

<h2 align="center">
  
**Spring Boot Docs**: [Link](https://docs.spring.io/spring-boot/index.html)  <img src="https://go-skill-icons.vercel.app/api/icons?i=spring&size=64" width="40" />

</h2>

<h2 align="center">
  
**FastAPI Docs**: [Link](https://fastapi.tiangolo.com/)  <img src="https://go-skill-icons.vercel.app/api/icons?i=fastapi&size=64" width="40" />

</h2>

<h2 align="center">
  
**React Docs**: [Link](https://react.dev/)  <img src="https://go-skill-icons.vercel.app/api/icons?i=react&size=64" width="40" />

</h2>

<h2 align="center">
  
**PostgreSQL**: [Link](https://www.postgresql.org/docs/)  <img src="https://go-skill-icons.vercel.app/api/icons?i=postgres&size=32" width="40" />

</h2>

<h2 align="center">
  
**Redis**: [Link](https://redis.io/docs/)  <img src="https://go-skill-icons.vercel.app/api/icons?i=redis&size=32" width="40" />

</h2>
