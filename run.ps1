param(
    [switch]$NoInstall
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

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

Get-CimInstance Win32_Process |
    Where-Object { $_.Name -match 'python|uvicorn' -and $_.CommandLine -match 'api:app' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Write-Host "Starting API + Chat UI on http://127.0.0.1:8000"
Write-Host "Working directory: $PWD"
& $python -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload
