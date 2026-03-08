param(
    [switch]$NoInstall
)

$ErrorActionPreference = "Stop"

if (!(Test-Path ".venv")) {
    python -m venv .venv
}

$python = ".\.venv\Scripts\python.exe"
$pip = ".\.venv\Scripts\pip.exe"

if (-not $NoInstall) {
    & $python -m pip install --upgrade pip
    & $pip install -r requirements.txt
    & ".\.venv\Scripts\playwright.exe" install chromium
}

if (!(Test-Path ".env")) {
    Copy-Item .env.example .env
}

if (!(Test-Path "workspace")) {
    New-Item -ItemType Directory workspace | Out-Null
}

Write-Host "Starting API on http://127.0.0.1:8000"
Write-Host "If OPENAI_API_KEY is missing in .env, /tasks returns HTTP 400 with a clear message."
& ".\.venv\Scripts\uvicorn.exe" api:app --host 127.0.0.1 --port 8000 --reload
