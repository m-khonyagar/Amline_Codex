# Agent Mode (Production-Ready MVP)

این پروژه یک Agent هیبریدی می‌دهد با:
- OpenAI Responses API + Function Calling
- ابزار مرورگر Playwright
- Local Bridge محدود به `WORKSPACE_ROOT`
- FastAPI با Task/Approval Flow
- تست‌های خودکار (`pytest`)
- اجرای یک‌فرمانی (`run.bat` / `run.ps1`)

## اجرای سریع (تقریبا بدون کار دستی)
در ویندوز فقط این را اجرا کن:
```bash
run.bat
```

این اسکریپت کارهای زیر را خودکار انجام می‌دهد:
- ساخت `.venv` (در صورت نبود)
- نصب dependencyها
- نصب Chromium برای Playwright
- ساخت `.env` از روی `.env.example` (در صورت نبود)
- ساخت پوشه `workspace`
- اجرای API روی `http://127.0.0.1:8000`

## نکته کلیدی
برای اجرای واقعی `POST /tasks` باید `OPENAI_API_KEY` در `.env` تنظیم باشد.
اگر تنظیم نباشد، API خطای واضح `400` برمی‌گرداند.

## Endpointها
- `GET /health`
- `GET /tasks`
- `POST /tasks`
- `GET /tasks/{task_id}`
- `GET /tasks/{task_id}/approvals`
- `GET /approvals/pending`
- `POST /approvals/{approval_id}` (`approve|deny`)
- `POST /tasks/{task_id}/resume`

## رفتار Approval
اکشن‌های حساس که approval می‌خواهند:
- `browser_click`
- `local_write_file`
- `local_run_python_script`

نکات:
- approval یک‌بار تصمیم‌گیری می‌شود و قابل تغییر نیست.
- اگر approval `pending` یا `denied` باشد، `resume` با `409` رد می‌شود.

## تست‌ها
```bash
.\.venv\Scripts\pytest.exe -q
```

## فایل‌های اصلی
- `main.py`: CLI
- `agent.py`: حلقه عامل + مدیریت approval
- `tool_registry.py`: رجیستری ابزارها
- `browser_tool.py`: ابزار مرورگر
- `local_bridge.py`: ابزارهای لوکال با محدودسازی مسیر
- `policy.py`: policy از env
- `approval.py`: ذخیره approvalها
- `api.py`: endpointها و state task
- `tests/`: تست‌های واحد/یکپارچه سبک
- `run.ps1` / `run.bat`: اجرای یک‌فرمانی
