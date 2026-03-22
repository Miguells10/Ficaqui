# Ficaqui AI - FRONTEND MODULE

> **Context:** The frontend is the face of the Ficaqui B2G platform, serving two distinct personas: The Citizen exploring the city and the Government Official analyzing data.

## Architectural Decisions

### 📱 Tech Stack
- **React + Vite + TypeScript:** High-performance tooling for a fast, responsive Single-Page Application.
- **Tailwind CSS & Framer Motion:** Used for building a clean, modern interface without bloated frameworks. 

### 🧠 UX Psychology & Design Principles
- **Citizen Interface (Mobile-First):** 
  - **Fitts' Law:** Call-to-action buttons (e.g., "Ver Rota", "Realizar Check-in") use `w-full` with large padding (`py-4`) to maximize tap-friendliness.
  - **Color Psychology:** **Teal-600** (Primary) evokes trust, sustainability, and nature, aligning perfectly with "bioclimatic routes." **Amber-500** (Secondary) gamifies the experience (CentroCoins) through positive reinforcement without visual exhaustion.
  - **Clean UI:** Avoids excessive glassmorphism in favor of subtle shadows and clean borders, establishing a professional and trustworthy aesthetic suited for government-backed programs.

- **Government Dashboard (Desktop-Optimized):**
  - Data-dense views (Heatmaps, Check-in streams) require clarity. Built for fast scanning to identify urban trends (foot traffic, searches).

### 🏛️ Communication & Security
- **Authentication Handling:** The SPA manages JWT tokens securely (via HttpOnly cookies or secure memory storage) depending on the configuration. All requests to the backend pass the Authorization header dynamically.
- **Graceful Degradation:** Features rely on robust fallbacks to ensure the UI remains usable even under varying network conditions.

## Running the Frontend

1. Install dependencies: `npm install`
2. Create your `.env.local` to point to the remote or local API.
   ```
   VITE_API_URL=http://localhost:3000
   ```
3. Run the development server: `npm run dev`
