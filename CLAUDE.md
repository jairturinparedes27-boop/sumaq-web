# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sumaq Ñan** - Restaurant management system built with React 19 + Vite 8. A Progressive Web App (PWA) with offline capabilities via Workbox. Currently frontend-only with planned Spring Boot backend integration.

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run lint` | Run ESLint on all `.js`/`.jsx` files |
| `npm run preview` | Preview production build locally |

## Architecture

### Tech Stack
- **React 19** + **React Router 7** (SPA routing)
- **Vite 8** with `@vitejs/plugin-react` (uses Oxc)
- **PWA** via `vite-plugin-pwa` (Workbox, auto-update, offline support)
- **ESLint 10** (flat config) with react-hooks & react-refresh plugins
- **idb** (IndexedDB wrapper) for client-side storage

### Project Structure
```
src/
├── main.jsx              # Entry point, renders <App />
├── App.jsx               # Router: / (Login) → /dashboard (Dashboard)
├── index.css             # Global styles, CSS custom properties
├── App.css               # App-level styles
├── components/
│   ├── Header/           # Top bar: menu toggle, notifications, user avatar
│   └── Sidebar/          # Collapsible nav: Dashboard, Mesas, Pedidos, Cocina, Productos, Insumos, Trabajadores, Reportes
├── layouts/
│   └── MainLayout.jxs    # (Currently empty)
└── pages/
    ├── Login/            # Login form (placeholder - no backend yet)
    └── Dashboard/        # Stats cards, recent activity, table status grid
```

### Routing
- `/` → Login page
- `/dashboard` → Dashboard (main admin panel)
- `*` → Redirects to `/`

### PWA Configuration
- **Manifest**: `Sumaq Ñan - Sistema de Restaurante`, standalone display, portrait orientation
- **Icons**: 192×192 and 512×512 in `/public/icons/`
- **Workbox**: `navigateFallback: /index.html`, `cleanupOutdatedCaches: true`
- **Dev mode enabled** (`devOptions: { enabled: true }`)

## Development Notes

### Current State
- Login form is a **static placeholder** — shows alert on submit ("El diseño está listo. Falta conectar el backend.")
- Dashboard uses **hardcoded mock data** (stats, tables, activity)
- Sidebar navigation items are **non-functional** (only Dashboard route exists)
- No authentication/authorization implemented

### Planned Backend Integration
Comments in `Login.jsx` indicate Spring Boot API integration:
- POST credentials → receive token + worker data
- Token storage (likely IndexedDB via `idb`)

### Styling Approach
- Plain CSS with CSS custom properties (see `index.css`: `--color-*` not used but base palette defined)
- Component-scoped CSS files (e.g., `Login.css`, `Dashboard.css`)
- No CSS framework or utility classes

### ESLint Config
Flat config (`eslint.config.js`) targeting browser globals, JSX enabled. Extends:
- `js.configs.recommended`
- `reactHooks.configs.flat.recommended`
- `reactRefresh.configs.vite`

Ignores `dist/` directory.