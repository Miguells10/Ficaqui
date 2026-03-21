# Ficaqui VIP (Hackathon MVP) 🚀

O **Ficaqui** foi projetado como um sistema "Monorepo Fullstack Mobile-First" altamente escalável. O foco arquitetural do sistema é entregar estabilidade em tempo real, conectando lojistas tradicionais a compradores locais com redução de atrito (calor, trânsito) através da assistência de um LLM Cérebro (Retrieval-Augmented Generation).

---

## 🛠 Tech Stack e Infraestrutura

- **Frontend:** React + Vite, Gamificação (Framer Motion, CentroCoins, QR Scanner).
- **Backend API:** NestJS 11 robusto (TypeScript) servindo rotas seguras e Swagger.
- **Banco de Dados:** PostgreSQL 15 integrado.
- **ORM:** Prisma 6.4 (Conexão tipada e controle de Migrations).
- **Orquestração e Deploy:** Docker e Docker Compose (Roda tudo através de contêineres e imagens).

---

## 🏗️ 1. Como Rodar Tudo Simultaneamente (Build & Start)

O sistema foi unificado para orquestração automática com um simples comando:

Abra o seu terminal **na raiz do seu projeto (`Ficaqui/`)** e orquestre o banco e o servidor de uma vez:
```bash
docker-compose up --build -d
```
* **O que acontece?** O Docker fará o build do Frontend (`:5173`), do Backend (`:3000`), do Banco de Dados Postgres (`:5432`) e instalará automaticamente todas dependências das pastas remotas. O parâmetro `-d` garante que rodem em "Detached Mode" (background), deixando seu terminal livre.

#### 🌐 Onde testar?
- **O Aplicativo Visual:** [http://localhost:5173](http://localhost:5173)
- **Painel da API do Ficaqui (Swagger):** [http://localhost:3000/api](http://localhost:3000/api)

---

## 🛑 2. Parando e Apagando Containers (Stop & Remove)

Para desligar o servidor, liberar as portas e resetar as instâncias do Docker Compose atual, rode na raiz do projeto:

- Desligar sem perder o banco (Parar):
  ```bash
  docker-compose stop
  ```
- Desligar e destruir instâncias ativas do docker (Mas mantendo o Volume/dados do banco sãos e salvos):
  ```bash
  docker-compose down
  ```
- **Apagar TUDO (Resetar Geral inclusive os dados e a memória do Postgres)**:
  ```bash
  docker-compose down -v
  ```

---

## 🗄️ 3. Comandos do Banco de Dados e Prisma

O Ficaqui depende de Modelos como `User`, `CheckIn`, `ChatMessage`, `Store` e `Product`. Para manipular e inspecionar essas tabelas dinâmicas usadas pelo LLM "Cérebro" para recomendar lojas, utilize os comandos do Prisma executados DENTRO do seu container de Backend ou acessando a rota dele.

Para esses comandos, recomendamos abrir um terminal na pasta do `backend/`:
```bash
cd backend
```

#### A. Inspecionar e Cadastrar Dados Graficamente (Prisma Studio)
Abra uma interface bonita no navegador para cadastrar produtos, saldos de usuários e estoques manualmente. 

> [!TIP]
> **Dica de Senior:** Para evitar erros de ambiente no Windows (`STUDIO_EMBED_BUILD`), rode o Studio direto pelo Docker:

```bash
docker exec -it ficaqui_backend npx prisma studio --browser none --port 5555
```
> *(Abra http://localhost:5555 para visualizar. Ideal para adicionar as Panelas da "Loja do Seu João" em tempo real na aba Products).*

#### B. Atualizar e Sincronizar o Banco (Migrate & Push)
Caso você crie novos *models* no arquivo `backend/prisma/schema.prisma` e queira aplicar a mudança forçadamente na nuvem do PostgreSQL:
```bash
npx prisma db push
```
Ou para versionar formalmente a criação (Modo Seguro/Produção):
```bash
npx prisma migrate dev --name "init_tabelas_novas"
```

#### C. Resetar completamente os Dados (Wipe/Apagar)
Caso queira jogar fora todo e qualquer dado do Hackathon e recomeçar do zero (Cuidado!):
```bash
npx prisma migrate reset
```

---

## 🧠 Arquitetura do "Cérebro Llama" - RAG (Retrieval-Augmented Generation)

O Assistente no app consome a inteligência do Llama 3 gerida pela [API da Groq](https://console.groq.com/keys).

A lógica foi arquitetada de forma sigilosa no `/backend` e o Frontend apenas recebe o JSON de respostas sem expor chaves de API:
1. O Front manda o ID do usuário e a mensagem (`"panela"`) pra `/chat`.
2. O NestJS lê o ID e coleta o banco de dados dinamicamente usando Prisma: O contexto espacial (Lojas Próximas), seu saldo em **CentroCoins**, seu Histórico de Conversa e faz um Vector-Search rústico de quais Produtos cadastrados dão match com a palavra da mensagem.
3. Se existe produto correspondente no banco de dados com a busca informada, o Backend avisa a Groq e ela formulará as ações que geram gatilho como `show_route` contendo o ID e metadados reativos com sotaque de Sergipe!

*(Para configurar, coloque a sua `GROQ_API_KEY=xxx` num arquivo `.env` puro na raiz do projeto acompanhando de fato o seu `docker-compose.yml` e refaça o `docker-compose up --build -d` para dar hot load).*
