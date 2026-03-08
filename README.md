# Agent Mode MVP + Stage 2 API

Hybrid agent starter built around OpenAI Responses API with:
- Agent loop + function tools + `web_search_preview`
- Playwright browser actions for online execution
- Constrained local bridge for workspace-only file access
- FastAPI task endpoints with approval flow for sensitive actions

## Files
- `main.py`: CLI entrypoint
- `agent.py`: Responses loop with tool execution and approval hook
- `tool_registry.py`: tool schemas + execution dispatch
- `browser_tool.py`: `browser_open`, `browser_snapshot`, `browser_click`, `browser_type`
- `local_bridge.py`: local tools under `WORKSPACE_ROOT`
- `policy.py`: environment-driven guardrails
- `approval.py`: in-memory approval request store
- `api.py`: task API + resume and approvals endpoints

## Setup (Windows PowerShell)
```bash
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
playwright install chromium
Copy-Item .env.example .env
mkdir workspace
```

Set `OPENAI_API_KEY` in `.env`.

## CLI usage
```bash
python main.py "در workspace را بررسی کن و فایل های متنی را خلاصه کن"
python main.py "با استفاده از وب، آخرین تغییرات Python 3.14 را جمع بندی کن"
```

## API usage (Stage 2)
Run server:
```bash
uvicorn api:app --reload --port 8000
```

### 1) Create a task
```bash
curl -X POST http://127.0.0.1:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"prompt":"در workspace یک فایل report.txt بساز"}'
```

If model asks for a sensitive action (`browser_click`, `local_write_file`, `local_run_python_script`) the task goes to `awaiting_approval`.

### 2) List task approvals
```bash
curl http://127.0.0.1:8000/tasks/<TASK_ID>/approvals
```

### 3) Approve or deny
```bash
curl -X POST http://127.0.0.1:8000/approvals/<APPROVAL_ID> \
  -H "Content-Type: application/json" \
  -d '{"decision":"approve"}'
```

### 4) Resume task
```bash
curl -X POST http://127.0.0.1:8000/tasks/<TASK_ID>/resume
```

## Policy env vars
- `WORKSPACE_ROOT=./workspace`
- `ALLOW_LOCAL_WRITE=false`
- `ALLOW_SCRIPT_EXECUTION=false`
- `ALLOWED_DOMAINS=`

Notes:
- Empty `ALLOWED_DOMAINS` means no domain restriction.
- `local_write_file` and `local_run_python_script` are still policy-gated, even with API approvals.
- Approval and task store are in-memory for MVP.
