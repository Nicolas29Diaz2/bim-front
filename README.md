# Spybee — Construction Incident Management Platform

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5.0-E87900?logo=zustand&logoColor=white)
![Mapbox GL](https://img.shields.io/badge/Mapbox_GL-3.24-4264FB?logo=mapbox&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS_Modules-1.101-CF649D?logo=sass&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.8-506DFE?logo=recharts&logoColor=white)

---

## Project Overview

Spybee is a construction incident management platform designed to streamline how field teams report, track, and analyze incidents on active projects. Built with the Next.js App Router and React 19, the platform combines interactive 3D map visualization with a real-time analytics dashboard — enabling project managers and field engineers to make faster, data-driven safety decisions.

The architecture prioritizes performance through shallow-selector-based Zustand stores, modular SCSS encapsulation, and a progressive multi-step incident creation flow with persistent form state. All data is currently mock-based, ready to integrate with a real backend.

---

## Key Features

- **3D Mapbox Visualization** — Interactive geographic incident tracking with Mapbox GL, supporting 2D markers, 3D terrain mode, and priority-weighted heatmap overlays.

- **4-Step Incident Creation Stepper** — Progressive form (Basic Info → Assignment → Location → Attachments) with Zod validation per step, crosshair pin placement, and persistent state across navigation.

- **Real-Time Analytics Dashboard** — Recharts-powered charts including status donut, category bar, trend area, aging analysis, KPI cards, and a searchable incidents datatable.

- **Role-Based Access Control** — Simulated RBAC with 5 roles (Super Admin, Admin, Project Manager, Client, Field Engineer) controlling data visibility and UI element access.

- **Optimized State Management** — Zustand stores with `useShallow` selectors to minimize unnecessary re-renders and keep the UI responsive under heavy data loads.

- **Bilingual i18n Support** — Full Spanish/English localization via `next-intl` with locale-aware routing.

- **Drag-and-Drop Attachments** — Native file upload zone supporting PDF, JPG, and PNG formats with client-side file management.

---

## Technical Architecture & Decisions

### Tech Stack

| Layer            | Technology                             | Rationale                                                                            |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| **Framework**    | Next.js 16 (App Router)                | Server components, file-based routing, built-in API routes                           |
| **UI Library**   | React 19.2                             | Latest concurrent features, React Compiler support via `babel-plugin-react-compiler` |
| **Language**     | TypeScript 5 (strict mode)             | Full type safety, interface-driven development, path aliases                         |
| **State**        | Zustand 5                              | Lightweight, no boilerplate, granular re-render control via shallow selectors        |
| **Styling**      | SCSS Modules                           | Zero runtime overhead, scoped classnames, shared design tokens via `_variables.scss` |
| **Maps**         | Mapbox GL JS + react-map-gl            | Industry-standard 3D terrain, heatmap layers, GeoJSON support                        |
| **Charts**       | Recharts 3                             | Declarative, composable chart components built on D3                                 |
| **Auth**         | NextAuth v5 (beta)                     | Credentials provider with JWT callbacks and role propagation                         |
| **Validation**   | Zod 4                                  | Schema-first form validation integrated with incident creation steps                 |
| **i18n**         | next-intl                              | Locale-aware routing, server/client message loading                                  |
| **Code Quality** | ESLint + Prettier + Husky + Commitlint | Enforced linting, formatting, and conventional commits                               |

### Why Zustand with Shallow Selection

Zustand was chosen for its minimal API surface and fine-grained subscription model. By using `useShallow` selectors (e.g., in `useMapWorkspaceStore`), components subscribe only to the exact slices of state they need — preventing re-renders when unrelated state changes. This is critical in a map-heavy interface where view mode toggles, incident selection, and filtered data coexist in the same store.

### SCSS Modules Strategy

All 46 component stylesheets use SCSS Modules for local scoping. A shared `_variables.scss` file defines the design system (colors, typography, spacing, breakpoints, shadows) and is imported via `@use "styles/variables" as *` in every module. The `cn()` utility function handles conditional class composition without external dependencies.

---

## Folder Structure

```
src/
├── app/                              # Next.js App Router
│   ├── api/auth/[...nextauth]/       #   NextAuth route handler
│   └── [locale]/                     #   Locale-aware routes (es/en)
│       ├── _variables.scss           #     Design tokens (colors, type, spacing)
│       ├── globals.scss              #     Global reset + scrollbar styles
│       ├── layout.tsx                #     Root layout (fonts, SessionProvider, i18n)
│       ├── (auth)/login/             #     Login page
│       └── (projects)/
│           ├── page.tsx              #       Projects list
│           └── [project_slug]/
│               ├── layout.tsx        #         Management shell (Navbar + Menu)
│               ├── dashboard/        #         Dashboard page
│               └── incidents/        #         Incidents page
│
├── common/                           # Shared modules
│   ├── api/                          #   HTTP client, Result<T> pattern, error types
│   ├── components/ui/                #   Reusable UI primitives
│   │   ├── Button/
│   │   ├── Calendar/
│   │   ├── Chip/
│   │   ├── CustomSelect/
│   │   ├── DatePicker/
│   │   ├── FormField/
│   │   ├── IconButton/
│   │   ├── Input/
│   │   ├── Menu/
│   │   ├── Modal/
│   │   ├── MultiSelect/
│   │   ├── Navbar/
│   │   ├── Pagination/
│   │   ├── Select/
│   │   ├── Table/
│   │   └── Toast/
│   ├── constants/                    #   Mock users, shared constants
│   ├── hooks/                        #   useClickOutside, useDropdownPosition, useIsMobile
│   ├── store/                        #   useToastStore
│   ├── types/                        #   Role enum, NextAuth module augmentation
│   └── utils/                        #   cn(), date helpers, path normalization
│
├── modules/                          # Feature modules (domain-driven)
│   ├── auth/                         #   Login action (server)
│   ├── dashboard/                    #   Analytics dashboard
│   │   ├── components/               #     KpiCards, Donut, Bar, Area, Aging, Datatable
│   │   ├── hooks/                    #     useKpiData, useDonutCounts, useTrendData, ...
│   │   ├── store/                    #     useDashboardStore (filters + incidents)
│   │   └── types/                    #     DashboardFilters, KpiData, chart types
│   ├── incidents/                    #   Incident management
│   │   ├── components/               #     Map, Stepper, CreationModal, Steps, Popup
│   │   ├── constants/                #     Mock incidents, map layer configs, options
│   │   ├── hooks/                    #     useIncidentsGeoJson
│   │   ├── services/                 #     createIncident, getIncidentsByProject
│   │   ├── store/                    #     useIncidentCreationStore, useMapWorkspaceStore
│   │   └── types/                    #     Incident interface, creation types
│   └── projects/                     #   Project management
│       ├── components/               #     ProjectsPage, ProjectCard, NewProjectCard
│       ├── constants/                #     Mock projects
│       ├── hooks/                    #     useProjects
│       ├── services/                 #     getUserProjects, getProjectBySlug
│       └── types/                    #     Project interface, status types
│
├── i18n/                             # Internationalization
│   ├── navigation.ts                 #   createNavigation wrappers
│   ├── request.ts                    #   getRequestConfig (message loader)
│   └── routing.ts                    #   defineRouting (es, en)
└── proxy/                            # Middleware layer
    ├── auth.ts                       #   Auth redirect resolver
    └── localeCookie.ts              #   Locale cookie handler
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.18.0 (LTS recommended)
- **npm** ≥ 9.0.0
- A **Mapbox** access token — [Get one here](https://account.mapbox.com/access-tokens/)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-org>/bim-front.git
cd bim-front

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
AUTH_SECRET="your-auth-secret"
AUTH_URL=""
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"
```

> **Required:** `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is mandatory for the map visualization. Without it, the incidents map will fail to render.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start the development server                 |
| `npm run build`  | Create a production build                    |
| `npm start`      | Start the production server                  |
| `npm run lint`   | Run ESLint                                   |
| `npm run commit` | Interactive conventional commit (Commitizen) |

---

## Development Philosophy

This codebase follows a strict engineering-first approach: **SOLID principles** guide component design, **semantic HTML** ensures accessibility, and **modular architecture** keeps feature boundaries clear. Every component is typed with **strict TypeScript** — no `any` escapes, no implicit coercions. The project enforces **conventional commits** via Commitlint, **pre-commit linting** via Husky + lint-staged, and **consistent formatting** via Prettier. Mock services simulate network latency to ensure the UI is built against realistic async patterns from day one — making the eventual backend integration a matter of swapping the data source, not rewriting the presentation layer.

---

## License

This project is proprietary. All rights reserved.
