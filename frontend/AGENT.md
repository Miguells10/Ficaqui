# Ficaqui AI - FRONTEND MODULE

> **Context:** The frontend is the face of the Ficaqui B2G platform, serving two distinct personas: The Citizen exploring the city and the Government Official analyzing data.

## Architectural Decisions

### üì± Tech Stack
- **React + Vite + TypeScript:** High-performance tooling for a fast, responsive Single-Page Application.
- **Tailwind CSS & Framer Motion:** Used for building a clean, modern interface without bloated frameworks. 

### üß† UX Psychology & Design Principles
- **Citizen Interface (Mobile-First):** 
  - **Fitts' Law:** Call-to-action buttons (e.g., "Ver Rota", "Realizar Check-in") use `w-full` with large padding (`py-4`) to maximize tap-friendliness.
  - **Color Psychology:** **Teal-600** (Primary) evokes trust, sustainability, and nature, aligning perfectly with "bioclimatic routes." **Amber-500** (Secondary) gamifies the experience (CentroCoins) through positive reinforcement without visual exhaustion.
  - **Clean UI:** Avoids excessive glassmorphism in favor of subtle shadows and clean borders, establishing a professional and trustworthy aesthetic suited for government-backed programs.

- **Government Dashboard (Desktop-Optimized):**
  - Data-dense views (Heatmaps, Check-in streams) require clarity. Built for fast scanning to identify urban trends (foot traffic, searches).

### üèõÔ∏è Communication & Security
- **Authentication Handling:** The SPA manages JWT tokens securely (via HttpOnly cookies or secure memory storage) depending on the configuration. All requests to the backend pass the Authorization header dynamically.
- **Graceful Degradation:** Features rely on robust fallbacks to ensure the UI remains usable even under varying network conditions.

## Running the Frontend

1. Install dependencies: `npm install`
2. Create your `.env.local` to point to the remote or local API.
   ```
   VITE_API_URL=http://localhost:3000
   ```
3. Run the development server: `npm run dev`

---
# ?? ATEN«√O: STATE TRANSFER (CONTEXTO DA SESS√O PARALELA) ??
## [B2G MIGRATION ACHIEVED - LER ANTES DE CONTINUAR]

**A arquitetura B2G foi 100% implementada na sess„o paralela pelo Agente Antigravity.**
Se vocÍ (outra inteligÍncia artificial) est· lendo isso, O PROJETO SE ENCONTRA EXATAMENTE NESTE ESTADO:

### 1. BACKEND (NestJS + Prisma + JWT)
- Auth 100% funcional (/auth/login, /auth/register) com hashing bcrypt.
- Guardiıes RBAC (roles GOV_ADMIN e CITIZEN).
- Novo modelo Building adicionado ao banco (PostgreSQL) com latitude, longitude, 	axDebt, ootTrafficScore e status (ABANDONED/MIXED_USE_POTENTIAL).
- Novo endpoint /admin/buildings/opportunities.
- O Consultor IA (/admin/insights) consome a lista de prÈdios, injeta no prompt do Llama-3 pela Groq API e faz **caching em memÛria de 15 min**.
- O docker-compose.yml foi reescrito para rodar 
px prisma db seed autom·tico e o frontend subir na porta 5173. O Prisma Database *Seed* apaga a tabela Buildings antes para n„o colidir.

### 2. FRONTEND (React + Vite + Zustand + Leaflet)
- App.tsx possui *Hard Redirect* protegendo o Dashboard B2G para quem n„o est· logado como GOV_ADMIN.
- Axios (pi.ts) injeta o token (localStorage) e expurga em status 401.
- Global Store feita no **Zustand** (useStore.ts) sincroniza qual prÈdio o usu·rio clica no Leaflet.
- Mapa de Calor interativo no Command Center (MapComponent.tsx com Dark Theme), onde cada Pin pode ser clicado para enviar seus dados pro *AiPanel*.
- Consultor IA integrado visualmente na sidebar chamando a rota /admin/insights.

**AÁ„o ObrigatÛria:** Responda ao usu·rio com "Contexto recuperado! O Docker j· roda banco de dados, auth via JWT, mapa Leaflet e Llama 3 simult‚neos. Qual o prÛximo passo?".
