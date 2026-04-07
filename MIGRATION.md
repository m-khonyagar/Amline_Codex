# Migration Map — Amline Monorepo Consolidation

**Target repo:** `m-khonyagar/Amline_Codex` (this repo)  
**Migration date:** 2026-04-07  
**Performed by:** GitHub Copilot Coding Agent

---

## Source Repositories

| Source Repo | Visibility | Last Active | Status |
|-------------|-----------|-------------|--------|
| `m-khonyagar/Amline_Codex` | Public | 2026-03-22 | Base repo (this repo) |
| `m-khonyagar/Amline_namAvaran` | Public | 2026-04-07 | ✅ Migrated |
| `m-khonyagar/Amline_Old_Power` | Private | 2026-04-06 | ⏳ Pending (see below) |

---

## Phase 1 — Restructure Amline_Codex (done)

The original Amline_Codex had a Python AI agent at the root level. It was reorganized into the monorepo layout:

| Original Location | New Location | Note |
|------------------|-------------|------|
| `agent.py`, `api.py`, `approval.py`, `browser_tool.py`, `local_bridge.py`, `main.py`, `policy.py`, `tool_registry.py` | `services/agent/` | Agent service source |
| `web/` | `services/agent/web/` | Agent web UI |
| `tests/` | `services/agent/tests/` | Agent tests |
| `requirements.txt`, `pytest.ini`, `.env.example`, `run.bat`, `run.ps1` | `services/agent/` | Agent config/scripts |
| `saas-mvp/` | `apps/saas-mvp/` | Next.js SaaS MVP |
| `deployment/` | `scripts/deployment/` | Deployment scripts |
| `AGENT_READ_FIRST.md` | `services/agent/AGENT_READ_FIRST.md` | Agent documentation |
| `hamgit-projects/` | **Removed** | Old hamgit mirror (superseded by namAvaran) |

**Method:** `git mv` (history preserved in git log)

---

## Phase 2 — Amline_namAvaran Import (done)

**Source:** `m-khonyagar/Amline_namAvaran` @ commit `d851e2f355c790c422216aa620d6270a571b8ce6`  
**Destination:** `apps/namAvaran/`  
**Method:** `git subtree add --squash` (squash commit preserves provenance)

### Components imported

| Component | Path in this repo | Tech | Description |
|-----------|------------------|------|-------------|
| Admin UI | `apps/namAvaran/admin-ui/` | React + Vite | Full admin panel with RBAC, CRM, contracts |
| User UI | `apps/namAvaran/amline-ui/` | Next.js 14 | User-facing real estate platform |
| Marketing Site | `apps/namAvaran/site/` | Next.js 15 | Static marketing/SEO site |
| Consultant UI | `apps/namAvaran/consultant-ui/` | React + Vite | Consultant-facing panel |
| Backend API | `apps/namAvaran/backend/backend/` | FastAPI + PostgreSQL | Main business logic API |
| PDF Generator | `apps/namAvaran/pdf-generator/` | FastAPI | Contract PDF rendering |
| Channel Gateway | `apps/namAvaran/channel-gateway/` | Node.js + TypeScript | Messaging integrations |
| Dev Mock API | `apps/namAvaran/dev-mock-api/` | FastAPI | Local development mock |
| Super Agent | `apps/namAvaran/super-agent/` | Python | Self-improving AI orchestrator |
| AI Agents | `apps/namAvaran/agents/` | Python | Coding/testing/review agents |
| Local Dev Hub | `apps/namAvaran/local-dev-hub/` | HTML | Integrated local dev dashboard |
| Docs | `apps/namAvaran/docs/` | Markdown | Platform documentation |
| Scripts | `apps/namAvaran/scripts/` | PowerShell/Shell | Platform scripts |
| Docker Compose | `apps/namAvaran/docker-compose.yml` | Docker | Full stack orchestration |

### Security fix applied during import

- `apps/namAvaran/check_server.py`: Replaced hardcoded SSH credentials with environment variables (`SERVER_HOST`, `SERVER_USER`, `SERVER_PASSWORD`). The original file in `Amline_namAvaran` had a real IP and password — **those credentials should be rotated immediately**.

---

## Phase 3 — Amline_Old_Power (pending)

`m-khonyagar/Amline_Old_Power` is a **private** repository and could not be accessed during this migration.

### What is known

Based on prior analysis, `Amline_Old_Power` contains:
- Older versions of `admin-ui`, `backend`, `pdf-generator`, `site`, `ui`
- Production deployment configurations
- Staging environment settings

### Next steps for Old_Power migration

1. **Review Old_Power content** — check if it has features not present in namAvaran.
2. **Cherry-pick or patch** any unique features into the corresponding directories in this monorepo.
3. **Rotate any credentials** found in Old_Power before importing.
4. Use `git subtree add --prefix=apps/old-power-import <remote> main --squash` after verifying no sensitive data.
5. Archive `Amline_Old_Power` after migration is confirmed.

---

## Archive Guidance for Source Repos

After migration is validated:

### Amline_namAvaran
1. Add to `README.md`:
   ```
   ⚠️ This repository has been consolidated into [Amline_Codex](https://github.com/m-khonyagar/Amline_Codex).
   Please use that repo for all future development.
   ```
2. Go to **Settings → General → Danger Zone → Archive this repository**.

### Amline_Old_Power
1. After Phase 3 migration is complete, archive similarly.

**Do NOT delete the source repos** — archiving keeps history accessible without accepting PRs.

---

## Security Checklist

- [x] Removed hardcoded SSH password from `check_server.py`
- [x] All `.env` files excluded from git (`.gitignore` updated)
- [x] Root `.env.example` added with placeholder values
- [ ] Rotate SSH credentials that were previously exposed in `Amline_namAvaran/check_server.py`
- [ ] Review `Amline_Old_Power` for any additional hardcoded credentials before import
- [ ] Enable GitHub secret scanning on this repo (Settings → Security → Secret scanning)
- [ ] Consider adding Dependabot for automated dependency updates

---

## Future Reorganization (Optional)

The current structure places all namAvaran content under `apps/namAvaran/`. A future reorganization could flatten this to:

```
apps/admin-ui/          (from apps/namAvaran/admin-ui/)
apps/amline-ui/         (from apps/namAvaran/amline-ui/)
apps/site/              (from apps/namAvaran/site/)
apps/consultant-ui/     (from apps/namAvaran/consultant-ui/)
services/backend/       (from apps/namAvaran/backend/)
services/pdf-generator/ (from apps/namAvaran/pdf-generator/)
services/channel-gateway/ (from apps/namAvaran/channel-gateway/)
services/dev-mock-api/  (from apps/namAvaran/dev-mock-api/)
tools/super-agent/      (from apps/namAvaran/super-agent/)
tools/agents/           (from apps/namAvaran/agents/)
```

This can be done incrementally with `git mv` commands to preserve history.
