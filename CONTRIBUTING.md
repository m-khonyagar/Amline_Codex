# Contributing

## Scope
Keep production-impacting changes focused on the root agent runtime unless a pull request explicitly targets `saas-mvp/`, `deployment/`, `web/`, or `hamgit-projects/`.

## Workflow
1. Branch from `main`.
2. Keep changes scoped to one concern.
3. Update repository-boundary documentation when folder ownership changes.
4. Run local validation before opening a pull request.

## Expected checks
- `pip install -r requirements.txt`
- `pytest -q`
- verify the FastAPI app still starts

## Artifact rule
Do not commit generated runtimes, recordings, or disposable archives to git. Use external artifact storage or release assets instead.
