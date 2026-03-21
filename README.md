# Ficaqui MVP 🚀

O Ficaqui MVP foi projetado como um Monorepo **Mobile-First** escalável. A infraestrutura possui separação nativa de Frontend (React + Vite), Backend (NestJS + Prisma ORM) e Banco de Dados (PostgreSQL via Docker).

## Requisitos Iniciais

- Node.js (v18 ou mais recente)
- Docker Desktop e Docker Compose (Apenas para levantar o Postgres via um comando simples)
- Uma [chave da API do Groq](https://console.groq.com/keys) (Opcional, se você não setá-la, o app responde usando o modo simulador).

---

## 🏗️ Como Rodar o Ficaqui (Passo a Passo)

### 1️⃣ Inicializar o Banco de Dados (PostgreSQL)

O nosso Docker Compose vai gerenciar o banco pesado pra você não precisar instalar MySQL/Postgres localmente do zero.

Abra o terminal **na raiz do seu projeto (`Ficaqui/`)** e rode:

```bash
docker-compose up -d db
```

> Isso fará o download da imagem limpa do Postgres e deixará o banco rodando silenciosamente na porta `5432` do seu computador.

---

### 2️⃣ Inicializar a API Backend (NestJS + Swagger)

O Backend Ficaqui contém a documentação da API, Endpoints de Check-in em rotas sustentáveis e a integração de Gamificação de Moedas (CentroCoins) + Conexão LLM Segura.

1. No terminal aberto, navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo chamado exatamente **`.env`** no diretório `backend/` (você pode se inspirar no arquivo `backend/.env example` que você abriu agora mesmo) e adicione as variáveis:
   ```env
   # Como o banco de dados Docker abriu a porta para seu SO, use localhost:
   DATABASE_URL="postgresql://ficaqui:ficaqui_password@localhost:5432/ficaqui_db?schema=public"
   
   # Insira aqui a sua Key do Groq para o Chat ser real (Opcional):
   GROQ_API_KEY="gsk_SuaChaveAqui"
   ```
   *(Caso opte por não configurar a chave do Groq, o chat utilizará o simulador interno automático recomendando praças em Aracaju para você não passar vergonha numa apresentação sem internet).*

4. Sincronize o Banco (este comando lê sua tabela Prisma e força no Docker pra você de primeira viagem):
   ```bash
   npx prisma db push
   ```
5. Inicie o servidor do Backend API:
   ```bash
   npm run start:dev
   ```

✅ Seu backend estará rodando 100% no link `http://localhost:3000`.  
🔥 Para acessar e testar o **Swagger (Documentação da API do Ficaqui)**, vá no seu navegador em: [`http://localhost:3000/api`](http://localhost:3000/api)

---

### 3️⃣ Inicializar o App Frontend (Vite/React Gamificado)

A UI do usuário final. Agora robusta, conectada a API e sem nenhuma lógica de LLM vulnerável em código fonte web. 

1. Abra um **NOVO** terminal (para não fechar a janela preta rodando seu backend em `start:dev`).
2. Vá até a pasta do frontend e instale:
   ```bash
   cd frontend
   npm install
   ```
3. Suba o servidor Web de testes do app (Vite):
   ```bash
   npm run dev
   ```

✅ Seu MVP abrirá. Clique na URL informada no log (geralmente `http://localhost:5173`) e teste a interface inteira! Todo o sistema reativo (QR Code, Chat Llama, e Check in do Perfil do seu usuário) funcionará conectado aos endpoints.
