# FICAQUI AI - BACKEND CEREBRUM 🧠

> **Project Vision:** The Ficaqui Backend is the central nervous system of our B2G Urban Intelligence Platform. It processes citizen interactions, secures sensitive data, and fuels the Government Dashboard for data-driven public policies in Aracaju.

## 🏛️ Foundational Modules

### 1. Authentication & RBAC (Role-Based Access Control)
The platform utilizes a robust security paradigm to strictly separate end-users and administrators.
- **JWT Strategy:** We use a simple, robust 24-hour JSON Web Token (JWT) strategy for immediate delivery and stability. 
  - *🔴 Technical Debt Alert:* For post-MVP scaling, especially regarding `GOV_ADMIN` security, a **Short JWT + Refresh Token** architecture is mapped in the roadmap to allow immediate session revocation.
- **Guards:** NestJS native `@UseGuards(JwtAuthGuard, RolesGuard)` decorators ensure that endpoints like heatmaps are exclusively accessible by the `GOV_ADMIN` role, while check-ins remain restricted to the `CITIZEN` role.

### 2. Gamification Integrity (CentroCoins)
- **Transaction Ledger:** To prevent race conditions and provide deep urban intelligence (knowing *where* and *how* a user acquired or spent coins), all CentroCoins movements are recorded in a dedicated `Transaction` table. This audit trail is indispensable for the government to accurately measure the success of tax incentives or commercial engagements. The `centrocoins_balance` on the `User` is dynamically maintained alongside these atomic transactions.

## 🤖 System Prompt (Urban AI)

The Llama 3 (Groq) integration relies on the authenticated, verified database state, abandoning any prior hardcoded constraints.

```text
Você é o "Cérebro" do Ficaqui, uma IA especialista em inteligência urbana e comércio do Centro de Aracaju.
Sua missão é reduzir a fricção física conectando o cidadão ao lojista, gerando rastros de dados para a administração pública.

Contexto de Dados (Real-time DB Injected via JWT Context):
1. User Profile: { id: "uuid", name: "Cidadão Autenticado", balance: 150, role: "CITIZEN" }
2. Current View (Map): Foco nas coordenadas do Centro de Aracaju.
3. Store Data (Prisma/Postgres): Lojas ativas validadas no raio de proximidade.
4. Histórico: [Últimas 5 interações reais].

Regras de Resposta:
- RAG (Retrieval-Augmented Generation): Sempre cruze os dados do RAG com o inventário real do Postgres. Informe lojas exatas.
- Consciência Urbana: Ao sugerir rotas, considere variáveis ambientais. O trajeto recomendado alimentará o heatmap da prefeitura.
- Incentivo Financeiro: Relembre o usuário sobre seus CentroCoins e recomende lojas parceiras da prefeitura.
- Tom de Voz: Institucional, porém acessível e local (sotaque sergipano amigável, sem gírias pesadas).

Sua saída deve ser EXCLUSIVAMENTE um objeto JSON válido para a engine de UI reagir.
```
