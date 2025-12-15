param(
    [string]$Project = "elite-caster-474014-u9",
    [string]$Region = "europe-southwest1",
    [string]$Repo = "finne-repo"
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path -Path (Join-Path $root "..")
$frontendDir = Join-Path $repoRoot "frontend"
Set-Location $frontendDir

Write-Host "[1/3] Building frontend image via cloudbuild.yaml"
gcloud builds submit `
    --config=cloudbuild.yaml `
    --project=$Project

$frontendImage = "europe-southwest1-docker.pkg.dev/$Project/$Repo/frontend:latest"

Write-Host "[2/3] Deploying frontend service to Cloud Run"
gcloud run deploy frontend `
    --image $frontendImage `
    --region $Region `
    --project $Project `
    --allow-unauthenticated

Write-Host "[3/3] Frontend deployment complete."
