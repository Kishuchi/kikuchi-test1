using './main.bicep'

// Static Web App 名
param staticWebAppName = 'calc-swa-hadson'

// デプロイ先リージョン (Static Web Apps対応: westus2, centralus, eastus2, westeurope, eastasia)
param location = 'eastasia'

// SKU Tier (Standard プラン)
param skuTier = 'Standard'
