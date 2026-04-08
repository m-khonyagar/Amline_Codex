# Repository Boundaries

## Canonical runtime
The root-level Python files and `tests/` are the canonical agent runtime for this repository.

## Secondary areas
- `deployment/`: deployment helpers and environment-specific scripts
- `saas-mvp/`: a separate exploratory application
- `web/`: lightweight web material, not the core runtime
- `hamgit-projects/`: legacy/supporting material that should not silently expand the main runtime boundary

## Rules
- New agent runtime code should stay in the root runtime area unless there is a deliberate refactor.
- If `saas-mvp/` continues to grow independently, it should be split into its own repository.
- Do not add large generated artifacts, portable runtimes, or recorded test outputs to git.
