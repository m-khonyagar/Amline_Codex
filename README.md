# Amline — پلتفرم هوشمند قرارداد ملکی

> **Monorepo** — Single source of truth for all Amline services and applications.

[![Python CI](https://github.com/m-khonyagar/Amline_Codex/actions/workflows/ci-python.yml/badge.svg)](https://github.com/m-khonyagar/Amline_Codex/actions/workflows/ci-python.yml)
[![JS/TS CI](https://github.com/m-khonyagar/Amline_Codex/actions/workflows/ci-js.yml/badge.svg)](https://github.com/m-khonyagar/Amline_Codex/actions/workflows/ci-js.yml)

---

## Architecture Overview

```
Amline_Codex (monorepo)
│
├── apps/
│   ├── namAvaran/           ← Main platform (imported from Amline_namAvaran)
│   │   ├── admin-ui/        React + Vite — Admin panel            (port 3002)
│   │   ├── amline-ui/       Next.js 14   — User-facing UI         (port 3000)
│   │   ├── site/            Next.js 15   — Static marketing site  (port 3001)
│   │   ├── consultant-ui/   React + Vite — Consultant panel       (port 3004)
│   │   ├── backend/         FastAPI + PostgreSQL — Main API       (port 8080)
│   │   ├── channel-gateway/ Node.js TypeScript — Messaging GW
│   │   ├── pdf-generator/   FastAPI — PDF rendering service       (port 8001)
│   │   ├── dev-mock-api/    FastAPI — Local dev mock              (port 8080)
│   │   ├── super-agent/     Python — Self-improving AI orchestrator
│   │   ├── agents/          Python — AI agent implementations
│   │   └── local-dev-hub/   HTML — Local dev launch hub
│   │
│   └── saas-mvp/            Next.js 14 — SaaS MVP (Codex origin)
│
├── services/
│   └── agent/               Python — Hybrid AI agent (FastAPI + OpenAI + Playwright)
│
├── scripts/
│   └── deployment/          Deployment and sync scripts
│
└── .github/
    └── workflows/           CI pipelines
```

---

## Quickstart

### Prerequisites

- Docker + Docker Compose
- Node.js ≥ 18
- Python ≥ 3.11
- PowerShell 7+ (Windows) or Bash

### 1. Clone & Configure

```bash
git clone https://github.com/m-khonyagar/Amline_Codex.git
cd Amline_Codex
cp .env.example .env
# Fill in .env with real values
```

### 2. Run with Docker Compose (recommended)

```bash
cd apps/namAvaran
cp .env.example .env   # adjust values
docker-compose up -d
```

This starts: postgres, redis, minio, backend, pdf-generator, channel-gateway.

### 3. Run UIs locally (mock mode — no backend needed)

```powershell
# Start mock API (port 8080)
cd apps/namAvaran/dev-mock-api
.\run.ps1

# Admin UI (port 3002) — separate terminal
cd apps/namAvaran/admin-ui
npm install && npm run dev

# User UI (port 3000) — separate terminal
cd apps/namAvaran/amline-ui
npm install && npm run dev
```

**Or use the integrated dev hub:**
```powershell
cd apps/namAvaran
powershell -ExecutionPolicy Bypass -File .\scripts\start-platform-local-hub.ps1
```

### 4. Run AI Agent service

```powershell
cd services/agent
.\run.ps1
```

Requires `OPENAI_API_KEY` in `services/agent/.env`.

---

## Service Map

| Service | Tech | Port | Directory |
|---------|------|------|-----------|
| Admin UI | React + Vite | 3002 | `apps/namAvaran/admin-ui/` |
| User UI (amline-ui) | Next.js 14 | 3000 | `apps/namAvaran/amline-ui/` |
| Marketing Site | Next.js 15 | 3001 | `apps/namAvaran/site/` |
| Consultant UI | React + Vite | 3004 | `apps/namAvaran/consultant-ui/` |
| Backend API | FastAPI + PostgreSQL | 8080 | `apps/namAvaran/backend/backend/` |
| PDF Generator | FastAPI | 8001 | `apps/namAvaran/pdf-generator/` |
| Channel Gateway | Node.js TypeScript | — | `apps/namAvaran/channel-gateway/` |
| Dev Mock API | FastAPI | 8080 | `apps/namAvaran/dev-mock-api/` |
| AI Agent | FastAPI + OpenAI | 8000 | `services/agent/` |
| SaaS MVP | Next.js 14 | 3000 | `apps/saas-mvp/` |

---

## Testing

```bash
# Python (agent service)
cd services/agent
pip install -r requirements.txt
pytest -q

# Python (backend)
cd apps/namAvaran/backend/backend
pytest -q

# JS unit tests (admin-ui)
cd apps/namAvaran/admin-ui
npm test

# E2E tests (admin-ui, requires mock API on port 8080)
cd apps/namAvaran/admin-ui
npx playwright test
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full reference.
Each sub-project also has its own `.env.example`:

- `apps/namAvaran/.env.example` — Platform (backend, docker-compose)
- `apps/namAvaran/admin-ui/.env.example` — Admin UI Vite vars
- `services/agent/.env.example` — Agent service

**Never commit `.env` files with real credentials.**

---

## Migration History

See [`MIGRATION.md`](MIGRATION.md) for the full record of what was migrated, from which repo, and what remains.

---

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).

---

## License

© ۱۴۰۳ اَملاین — All rights reserved.
