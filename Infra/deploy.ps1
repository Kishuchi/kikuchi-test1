# Azure Static Web Apps デプロイスクリプト
# 使用方法: .\deploy.ps1

$ErrorActionPreference = "Stop"

# 設定
$SubscriptionName = "bw12012zz_melgitgai-dev-typez-01"
$ResourceGroupName = "rg-kikuchi-githubcopilot-handson"
$TemplateFile = "$PSScriptRoot\main.bicep"
$ParametersFile = "$PSScriptRoot\main.bicepparam"

Write-Host "=== Azure Static Web Apps デプロイ ===" -ForegroundColor Cyan
Write-Host ""

# Azure CLI ログイン確認
Write-Host "Azure CLI ログイン状態を確認中..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Azure にログインしてください..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Azure ログインに失敗しました"
        exit 1
    }
}
Write-Host "ログイン済み: $($account.user.name)" -ForegroundColor Green
Write-Host "サブスクリプション: $($account.name)" -ForegroundColor Green
Write-Host ""

# サブスクリプションの設定
Write-Host "サブスクリプション '$SubscriptionName' に切り替え中..." -ForegroundColor Yellow
az account set --subscription $SubscriptionName
if ($LASTEXITCODE -ne 0) {
    Write-Error "サブスクリプションの切り替えに失敗しました"
    exit 1
}
Write-Host "サブスクリプション切り替え完了" -ForegroundColor Green
Write-Host ""

# リソースグループの存在確認
Write-Host "リソースグループ '$ResourceGroupName' を確認中..." -ForegroundColor Yellow
$rgExists = az group exists --name $ResourceGroupName
if ($rgExists -eq "false") {
    Write-Error "リソースグループ '$ResourceGroupName' が存在しません。先に作成してください。"
    exit 1
}
Write-Host "リソースグループ確認完了" -ForegroundColor Green
Write-Host ""

# Bicep ファイルの検証
Write-Host "Bicep テンプレートを検証中..." -ForegroundColor Yellow
az deployment group validate `
    --resource-group $ResourceGroupName `
    --template-file $TemplateFile `
    --parameters $ParametersFile

if ($LASTEXITCODE -ne 0) {
    Write-Error "Bicep テンプレートの検証に失敗しました"
    exit 1
}
Write-Host "検証完了" -ForegroundColor Green
Write-Host ""

# デプロイ実行
Write-Host "デプロイを開始します..." -ForegroundColor Yellow
$deploymentName = "swa-deployment-$(Get-Date -Format 'yyyyMMddHHmmss')"

az deployment group create `
    --name $deploymentName `
    --resource-group $ResourceGroupName `
    --template-file $TemplateFile `
    --parameters $ParametersFile `
    --output table

if ($LASTEXITCODE -ne 0) {
    Write-Error "デプロイに失敗しました"
    exit 1
}

Write-Host ""
Write-Host "=== デプロイ完了 ===" -ForegroundColor Green

# デプロイ結果の取得
Write-Host ""
Write-Host "Static Web App 情報:" -ForegroundColor Cyan
az deployment group show `
    --name $deploymentName `
    --resource-group $ResourceGroupName `
    --query "properties.outputs" `
    --output table
