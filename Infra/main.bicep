// Azure Static Web Apps - Standard Plan
// GitHub Actions連携は別途設定するため、ビルド設定は最小限で構成

@description('Static Web App の名前')
param staticWebAppName string

@description('デプロイ先のリージョン (Static Web Apps対応: westus2, centralus, eastus2, westeurope, eastasia)')
param location string = 'eastasia'

@description('SKU Tier')
@allowed(['Free', 'Standard'])
param skuTier string = 'Standard'

resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: skuTier
    tier: skuTier
  }
  properties: {
    // GitHub Actions連携は別途設定するため、ビルド設定はスキップ
    buildProperties: {
      skipGithubActionWorkflowGeneration: true
    }
    // ステージング環境を有効化
    stagingEnvironmentPolicy: 'Enabled'
    // 設定ファイルの更新を許可
    allowConfigFileUpdates: true
    // パブリックアクセスを許可
    publicNetworkAccess: 'Enabled'
  }
}

@description('Static Web App のデフォルトホスト名')
output defaultHostname string = staticWebApp.properties.defaultHostname

@description('Static Web App のリソースID')
output resourceId string = staticWebApp.id
