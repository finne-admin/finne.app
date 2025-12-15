param(
    [string]$Project = "elite-caster-474014-u9",
    [string]$Region = "europe-southwest1",
    [string]$Repo = "finne-repo",
    [switch]$UpdateJob
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path -Path (Join-Path $root "..")
Set-Location $repoRoot

$backendImage = "europe-southwest1-docker.pkg.dev/$Project/$Repo/backend:latest"

Write-Host "[1/4] Building backend image: $backendImage"
gcloud builds submit `
    --project=$Project `
    --region=$Region `
    --tag=$backendImage `
    ./backend

Write-Host "[2/4] Deploying backend service to Cloud Run"
gcloud run deploy backend `
    --project=$Project `
    --region=$Region `
    --image=$backendImage `
    --allow-unauthenticated `
    --port=8080 `
    --timeout=300

if ($UpdateJob) {
    $jobName = "notification-dispatcher"
    Write-Host "[3/4] Updating Cloud Run Job '$jobName' with the same image"
    gcloud run jobs deploy $jobName `
        --project=$Project `
        --region=$Region `
        --image=$backendImage `
        --command="npm" `
        --args="run,notifications:run"

    Write-Host "Job '$jobName' re-linked to the new image. Trigger it via Cloud Scheduler or:"
    Write-Host "    gcloud run jobs execute $jobName --project=$Project --region=$Region"
} else {
    Write-Host "[3/4] Skipping Cloud Run Job update (use -UpdateJob to enable)."
}

Write-Host "[4/4] Backend deployment complete."
