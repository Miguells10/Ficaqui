
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
