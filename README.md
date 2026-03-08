# Agent Mode MVP

Minimal hybrid agent that combines:
- OpenAI Responses API (agent loop + function tools + web search)
- Playwright browser tools for online actions
- A constrained local bridge for workspace-only file/system access

## Project files
- `main.py`: CLI entrypoint
- `agent.py`: Responses API loop + tool execution cycle
- `tool_registry.py`: tool schemas + dispatch
- `browser_tool.py`: browser_open/snapshot/click/type via Playwright
- `local_bridge.py`: workspace-scoped file/search/script tools
- `policy.py`: guardrails (write/run toggles + domain allowlist)

## Quickstart
```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell
pip install -r requirements.txt
playwright install chromium
copy .env.example .env
mkdir workspace
```

Set `OPENAI_API_KEY` in `.env`.

## Run
```bash
python main.py "در workspace را بررسی کن و فایل های متنی را خلاصه کن"
python main.py "با استفاده از وب، آخرین تغییرات Python 3.14 را جمع بندی کن"
```

## Policy env vars
- `WORKSPACE_ROOT=./workspace`
- `ALLOW_LOCAL_WRITE=false`
- `ALLOW_SCRIPT_EXECUTION=false`
- `ALLOWED_DOMAINS=python.org,docs.python.org`

Notes:
- When `ALLOWED_DOMAINS` is empty, browsing is open.
- `local_write_file` and `local_run_python_script` are blocked by default.

## Next step suggestion
Add FastAPI task endpoints and approval flow for sensitive write/run/click actions.
