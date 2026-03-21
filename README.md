# Ficaqui MVP 🚀

O Ficaqui MVP foi projetado como um Monorepo **Mobile-First** escalável. A infraestrutura possui separação nativa de Frontend (React + Vite), Backend (NestJS + Prisma ORM) e Banco de Dados (PostgreSQL).

Tudo foi orquestrado para rodar com **apenas um único comando via Docker Compose**!

## Requisitos Iniciais
- Docker Desktop (e Docker Compose) instalados.
- Uma [chave da API do Groq](https://console.groq.com/keys) (Opcional. Sem ela, o chat funciona em modo Offline/Simulação no backend).

---

## 🏗️ Como Subir Todos os Serviços de Uma Vez

Se você possui o Docker rodando na sua máquina, a inicialização ocorre de forma automática. O Docker Compose vai:
1. Baixar e ligar o PostgreSQL.
2. Executar as dependências do Backend, gerar o Prisma Client e aplicar as tabelas (CheckIn, ChatMessage, User).
3. Levantar o Frontend e amarrá-lo ao servidor da API.

Abra o terminal **na raiz do seu projeto (`Ficaqui/`)** e rode:

```bash
docker-compose up --build -d
```

> **Dica:** O `--build` garante que suas imagens Docker leiam o código-fonte mais recente. O `-d` libera seu terminal para que os processos rodem limpos em background!

---

## 🎯 Onde Acessar Cada App?

Após o comando acima terminar (leva 1 minuto na primeira vez), tudo estará ao vivo:

### 📱 1. O App Ficaqui (Frontend React + Gamificação)
Acesse pelo seu navegador:
👉 [http://localhost:5173](http://localhost:5173)

### 🔥 2. Documentação da API (NestJS Swagger)
Visualize os endpoints disponíveis e teste o banco de dados graficamente:
👉 [http://localhost:3000/api](http://localhost:3000/api)

### 🗄️ 3. O Banco de Dados (Postgres)
Ele roda no host local na porta `5432`.
Credentials: 
* User: `ficaqui`
* Password: `ficaqui_password`
* DB: `ficaqui_db`

---

## ⚙️ E a Chave do Groq/Llama? (Opcional)

Se quiser usar a IA real da Groq, basta abrir o seu terminal *antes* de rodar o compose e exportar a variável, ou criar um arquivo `.env` puro **na raiz do seu projeto** (junto ao docker-compose.yml) com a linha:

```env
GROQ_API_KEY="gsk_SuaChaveDaAPI"
```

O `docker-compose` puxará essa variável automaticamente e a inserirá direto no container blindado do seu Backend NestJS. Mágica pura!
