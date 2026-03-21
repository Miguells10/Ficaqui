# Ficaqui AI - AGENT LOGS

## Decisões Tomadas com Base nas Skills

### 📱 `@[/app-builder]`
- O App Builder sugeriu o setup Next.js ou React App. Como foi exigido pronta-entrega para o Vite ou CodeSandbox, decidi empacotar o MVP através do React via Vite, usando um único arquivo `App.tsx` super robusto que engloba toda a Lógica de Chat, Mapas, QR Code e Perfil (para simplicidade de copia-e-cola em Sandboxes que exigem 1 arquivo).
- **Stack Tecnológico Resolvido:** React, Vite, TS, Tailwind CSS e Framer Motion. 

### 🧠 `@[/frontend-design]` (UX Psychology & UI)
- **Hick's Law:** A navegação por Bottom Bar restringe a experiência principal em 4 blocos de fácil alcance com o dedão.
- **Fitts' Law:** Os botões de ação ("Ver Rota", "Simular Leitura", "Simular Compra") são renderizados com `w-full` e padding interno alto (py-4) para serem tap-friendly nas bordas da tela.
- **Color Psychology:** 
  - Primária: **Teal-600** para passar segurança e tom verde-água refrescante, o que combina com a proposta de "fricção climática" e Rotas Bioclimáticas (cor "natureza" e confiança).
  - Secundária: **Amber-500** para recompensas gamificadas (+Moedas) chamando atenção no Perfil e Mapa sem gritar agressivamente como um vermelho.
- **Glassmorphism Reduzido:** Em vez de clichês de glassmorphism em todo lugar, usei bordas suaves e shadows no "Floating Card", garantindo um visual *Clean* real, e não uma "AI interface fake".

### 🏛️ `@[/architecture]`
- **KISS (Keep it Simple, Stupid):** A comunicação com a API do Groq foi implementada no frontend (App.tsx) de forma desacoplada para o MVP. E possui fallbacks locais caso a variável `VITE_GROQ_API_KEY` falte (o que permite o teste contínuo sem quebrar a UI).

## Como rodar o Ficaqui MVP

1. Puxe as dependências instaladas: `npm install`
2. No root, crie um arquivo `.env.local` e insira sua API Key do Groq:
   ```
   VITE_GROQ_API_KEY=gsk_SuaChaveAqui
   ```
   (Caso você não coloque a chave, o app não irá quebrar. Usará uma *String Simulada* mockada).
3. Rode `npm run dev`.

O aplicativo é programado para `max-w-[450px]` para manter a pureza do MVP Mobile-First, focando na proposta do Centrolab Hackathon.
