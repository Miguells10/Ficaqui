# Ficaqui AI - AGENT LOGS

## Decisões Tomadas com Base nas Skills

### 📱 `@[/app-builder]` & `@[/architecture]`
- **Monorepo Structure:** Através do Socratic Gate e aprovação, migramos a arquitetura para um sistema Monorepo (`/frontend` e `/backend`) visando organização corporativa.
- **Docker Orchestration:** Adicionamos um `docker-compose.yml` que provisiona o PostgreSQL (`db`) , e prepara contêineres para backend e frontend.
- **Backend Robusto:** Escolhido o sólido **NestJS** com **Prisma ORM** por ter segurança de escopo (tipagem absoluta) e velocidade incrível na hora de estruturar tabelas de MVP.

### 🧠 `@[/api-patterns]`
- **Swagger Documentation:** Toda a documentação OpenAPI gerada automaticamente via Decorators nos Controllers, disponível na rota `/api`.
- **Validação de Inputs:** Utilização do `ValidationPipe` do NestJS pareado ao `class-validator` nos novos Data Transfer Objects (`ChatDto`, `CheckInDto`).
- **Data Persistence:** O Llama (via Groq API) não é mais feito do lado cliente por questão de segurança. Agora persiste as mensagens enviadas e a resposta da IA de forma segura na tabela `ChatMessage` no DB, interligado ao UUID do `User`.

## Como inicializar o Ecossistema Ficaqui

1. **Subir Banco de Dados via Docker**
   Abra o terminal na raiz do projeto e crie a instância do Postgres:
   ```bash
   docker-compose up -d db
   ```
2. **Configuração do Backend (Nest.js)**
   Crie um `.env` em `/backend` com a sua `GROQ_API_KEY=xxx`
   ```bash
   cd backend
   npm install
   npx prisma db push
   npm run start:dev
   ```
   * 🔥 O Swagger estará lindamente disponível em: `http://localhost:3000/api`
3. **Configuração do Frontend (Vite/React)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   * O layout interativo abrirá no localhost da porta `5173`.
