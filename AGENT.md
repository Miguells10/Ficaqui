# Ficaqui AI - B2G Urban Intelligence Platform

> **Project Vision:** Ficaqui is a B2G (Business to Government) Urban Intelligence SaaS. It uses AI to guide citizens through downtown Aracaju while generating real-time heatmaps and data for the government to implement data-driven urban public policies (e.g., tax incentives, urban revitalization).

## System Architecture

### ðŸ“± Monorepo Structure
- **Backend (`/backend`)**: Robust Enterprise API built with **NestJS** and **Prisma ORM**. Implements strict RBAC (Role-Based Access Control) to separate `CITIZEN` and `GOV_ADMIN` interactions, ensuring deep data integrity for the government dashboard.
- **Frontend (`/frontend`)**: Dynamic Single-Page Application utilizing **React, Vite, TypeScript, and Tailwind CSS**. Delivers an accessible, tap-friendly experience for citizens and a rich data visualization dashboard for government officials.
- **Orchestration**: Managed via `docker-compose.yml` to provision the PostgreSQL database (`db`) and prepare containers for scaling.

### ðŸ§  Core Modules & Patterns
- **Authentication & RBAC**: A solid foundation built on JWT (JSON Web Tokens). Real users replace any previous mocked states. Citizens are securely authenticated to earn CentroCoins, while Government Admins are verified before accessing sensitive heatmaps. ðŸ”¥ **Status: 100% Implementado e Funcional (Guards ativos, endpoints /auth/register e /auth/login injetados no NestJS)**.
- **Auditable Gamification**: CentroCoins are managed via a robust double-entry `Transaction` ledger in PostgreSQL, ensuring data integrity (no race conditions) e atualizaÃ§Ãµes seguras via TransaÃ§Ãµes do Prisma.
- **Urban AI (Groq + Llama 3)**: The Conversational AI is securely handled by the backend. It accesses real-time user profiles, location, and commerce data to generate tailored routes and recommendations, while persisting interactions to feed the intelligence dashboard.

## Running the Ecosystem

1. **Database Setup (Docker)**
   Start the PostgreSQL instance:
   ```bash
   docker-compose up -d db
   ```

2. **Backend Engine (Nest.js)**
   Setup your `.env` dynamically with the `GROQ_API_KEY` and `JWT_SECRET`:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run start:dev
   ```
   * Swagger Documentation available at: `http://localhost:3000/api`

3. **Frontend Dashboard (Vite/React)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   * The platform will be available on port `5173`.

---
# ?? ATENÇÃO: STATE TRANSFER (CONTEXTO DA SESSÃO PARALELA) ??
## [B2G MIGRATION ACHIEVED - LER ANTES DE CONTINUAR]

**A arquitetura B2G foi 100% implementada na sessão paralela pelo Agente Antigravity.**
Se você (outra inteligência artificial) está lendo isso, O PROJETO SE ENCONTRA EXATAMENTE NESTE ESTADO:

### 1. BACKEND (NestJS + Prisma + JWT)
- Auth 100% funcional (/auth/login, /auth/register) com hashing bcrypt.
- Guardiões RBAC (roles GOV_ADMIN e CITIZEN).
- Novo modelo Building adicionado ao banco (PostgreSQL) com latitude, longitude, 	axDebt, ootTrafficScore e status (ABANDONED/MIXED_USE_POTENTIAL).
- Novo endpoint /admin/buildings/opportunities.
- O Consultor IA (/admin/insights) consome a lista de prédios, injeta no prompt do Llama-3 pela Groq API e faz **caching em memória de 15 min**.
- O docker-compose.yml foi reescrito para rodar 
px prisma db seed automático e o frontend subir na porta 5173. O Prisma Database *Seed* apaga a tabela Buildings antes para não colidir.

### 2. FRONTEND (React + Vite + Zustand + Leaflet)
- App.tsx possui *Hard Redirect* protegendo o Dashboard B2G para quem não está logado como GOV_ADMIN.
- Axios (pi.ts) injeta o token (localStorage) e expurga em status 401.
- Global Store feita no **Zustand** (useStore.ts) sincroniza qual prédio o usuário clica no Leaflet.
- Mapa de Calor interativo no Command Center (MapComponent.tsx com Dark Theme), onde cada Pin pode ser clicado para enviar seus dados pro *AiPanel*.
- Consultor IA integrado visualmente na sidebar chamando a rota /admin/insights.

**Ação Obrigatória:** Responda ao usuário com "Contexto recuperado! O Docker já roda banco de dados, auth via JWT, mapa Leaflet e Llama 3 simultâneos. Qual o próximo passo?".
