# PowerShell script to run backend and frontend locally in development
param(
  [ValidateSet('cloud','local')]
  [string]$DbMode = 'cloud',
  [string]$BackendPort = '4000',
  [string]$FrontendPort = '3000',
  [string]$ApiUrl = 'http://localhost:4000'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Ensure-File {
  param([string]$Path, [string]$Content)
  if (-not (Test-Path $Path)) {
    New-Item -ItemType File -Path $Path -Force | Out-Null
    Set-Content -Path $Path -Value $Content -NoNewline
    Write-Host "Created $Path" -ForegroundColor Green
  } else {
    Write-Host "Found $Path (leaving as is)" -ForegroundColor DarkGray
  }
}

# Backend env file (dotenv looks for .env in CWD)
$backendEnvPath = Join-Path -Path "backend" -ChildPath ".env"
$dbHostDefault = if ($DbMode -eq 'cloud') { '34.175.90.191' } else { 'localhost' }
$backendEnv = @"
PORT=$BackendPort
FRONTEND_ORIGIN=http://localhost:$FrontendPort

# Database connection (non-production path uses direct connection)
DB_HOST=$dbHostDefault
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sa85%}5G^&}%
DB_NAME=postgres

# JWT for backend
JWT_SECRET=dev-secret
"@
Ensure-File -Path $backendEnvPath -Content $backendEnv

# Frontend env file (Next loads .env.local automatically)
$frontendEnvPath = Join-Path -Path "frontend" -ChildPath ".env.local"
$frontendEnv = @"
PORT=$FrontendPort
NEXT_PUBLIC_API_URL=$ApiUrl

# Disable IAM in local dev; API routes call backend directly
DISABLE_IAM=1

# Optional in dev; used only if you enable IAM locally
BACKEND_AUDIENCE=$ApiUrl
"@
Ensure-File -Path $frontendEnvPath -Content $frontendEnv

Write-Host ""; Write-Host "Backend .env preview:" -ForegroundColor Cyan
Get-Content $backendEnvPath | ForEach-Object { if ($_ -match '^(DB_PASSWORD=).+') { 'DB_PASSWORD=<hidden>' } else { $_ } }
Write-Host ""; Write-Host "Frontend .env.local preview:" -ForegroundColor Cyan
Get-Content $frontendEnvPath

if ((Get-Content $backendEnvPath) -match 'FILL_ME') {
  Write-Warning "Backend .env has placeholders (FILL_ME_*). Edit backend/.env with your DB credentials (Cloud SQL public IP or local Postgres)."
}

Write-Host ""; Write-Host "Starting backend and frontend in separate terminals..." -ForegroundColor Cyan

# Start backend
Start-Process -FilePath pwsh -ArgumentList @("-NoExit","-Command","Set-Location backend; $env:NODE_ENV='development'; npm i --no-audit --no-fund; npm run dev")

# Start frontend
Start-Process -FilePath pwsh -ArgumentList @("-NoExit","-Command","Set-Location frontend; $env:NODE_ENV='development'; npm i --no-audit --no-fund; npm run dev")

Write-Host ""; Write-Host "Done. Open http://localhost:$FrontendPort" -ForegroundColor Green
