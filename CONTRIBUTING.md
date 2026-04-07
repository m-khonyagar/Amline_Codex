# Contributing to Amline

Thank you for contributing! Please follow these guidelines.

---

## Getting Started

1. **Fork** the repository and clone your fork.
2. Create a **feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes following the code style below.
4. Add or update tests for your changes.
5. Open a **Pull Request** against `main`.

---

## Branch Naming

| Prefix | Purpose |
|--------|---------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `refactor/` | Code refactor |
| `docs/` | Documentation only |
| `chore/` | Build/tooling changes |
| `test/` | Test additions/fixes |

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(admin-ui): add contract wizard pagination
fix(backend): handle null phone number in OTP flow
docs(migration): add Old_Power migration notes
```

---

## Code Style

### Python
- Format with `black` or `ruff format`
- Lint with `ruff check`
- Type hints encouraged for public functions
- Tests with `pytest`

### JavaScript / TypeScript
- Format with `prettier`
- Lint with `eslint`
- Tests with `vitest` (unit) or `playwright` (E2E)

---

## Environment Setup

Each sub-project has a `.env.example`. Copy it to `.env` and fill in values:

```bash
cp apps/namAvaran/.env.example apps/namAvaran/.env
cp services/agent/.env.example services/agent/.env
```

**Never commit `.env` files with real credentials.**

---

## Pull Request Checklist

- [ ] Tests pass locally (`pytest -q` / `npm test`)
- [ ] No hardcoded secrets or API keys
- [ ] `.env.example` updated if new env vars added
- [ ] Documentation updated if behavior changed
- [ ] PR description explains *what* and *why*

---

## Reporting Issues

Open a [GitHub Issue](https://github.com/m-khonyagar/Amline_Codex/issues) with:
- Clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Relevant logs or screenshots
