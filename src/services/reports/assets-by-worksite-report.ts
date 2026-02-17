import { prisma } from '../../lib/prisma'

interface AssetReportItem {
  id: string
  code: string | null // Plate or Serial
  description: string // Brand + Model
  category: string
  ownership: 'OWN' | 'THIRD'
  worksite: string
  contractNumber: string | null
  mobilizationDate: Date | null
  integrationDate: Date | null
  demobilizationDate: Date | null
  rentalValue: number | null
}

interface WorksiteGroup {
  worksiteName: string
  categories: {
    categoryName: string
    assets: AssetReportItem[]
  }[]
}

export class AssetsByWorksiteReport {
  async execute() {
    // 1. Fetch all active assets with their categories and ACTIVE movements
    // An active movement is one where demob is null or in the future
    const assets = await prisma.asset.findMany({
      where: {
        is_Active: true,
      },
      include: {
        assetCategory: true,
        Movements: {
          where: {
            OR: [
              { demobilization_date: null },
              { demobilization_date: { gt: new Date() } }
            ]
          },
          orderBy: { mobilization_date: 'desc' }, // Get most recent if multiple (shouldn't happen but safe)
          take: 1,
          include: {
            contract: {
              include: {
                client: true
              }
            }
          }
        }
      }
    })

    // 2. Process and Group
    const reportData: AssetReportItem[] = assets.map(asset => {
      const activeMovement = asset.Movements[0]
      
      let worksite = 'Sem Contrato'
      let contractNumber = null
      let mobilizationDate = null
      let integrationDate = null 
      let demobilizationDate = null
      let rentalValue = null

      if (activeMovement) {
        const clientName = activeMovement.contract.client.company_name || activeMovement.contract.client.trading_name
        worksite = `${clientName} - ${activeMovement.contract.contract_number}`
        contractNumber = activeMovement.contract.contract_number
        mobilizationDate = activeMovement.mobilization_date
        integrationDate = activeMovement.integration_date
        demobilizationDate = activeMovement.demobilization_date
        rentalValue = Number(activeMovement.rental_value)
      }

      return {
        id: asset.id,
        code: asset.plate || asset.serial_number || 'S/N',
        description: `${asset.brand} ${asset.model}`,
        category: asset.assetCategory.name,
        ownership: asset.ownership,
        worksite,
        contractNumber,
        mobilizationDate,
        integrationDate,
        demobilizationDate,
        rentalValue
      }
    })

    // 3. Group by Worksite -> Category
    const groupedData: Record<string, Record<string, AssetReportItem[]>> = {}

    // Initialize "Sem Contrato" to ensure it exists (optional, or just let it form naturally)
    
    reportData.forEach(item => {
      if (!groupedData[item.worksite]) {
        groupedData[item.worksite] = {}
      }
      if (!groupedData[item.worksite][item.category]) {
        groupedData[item.worksite][item.category] = []
      }
      groupedData[item.worksite][item.category].push(item)
    })

    // 4. Format for output
    // Put "Sem Contrato" at the end or beginning? User said "Primeiro por Obra". 
    // Usually "Sem Contrato" is last.
    
    const result: WorksiteGroup[] = Object.keys(groupedData)
      .filter(key => key !== 'Sem Contrato')
      .sort() // Alphabetical worksites
      .map(worksite => ({
        worksiteName: worksite,
        categories: Object.keys(groupedData[worksite])
          .sort()
          .map(category => ({
            categoryName: category,
            assets: groupedData[worksite][category]
          }))
      }))

    // Add Metadata/No Contract group at the end
    if (groupedData['Sem Contrato']) {
      result.push({
        worksiteName: 'Sem Contrato / Disponível',
        categories: Object.keys(groupedData['Sem Contrato'])
          .sort()
          .map(category => ({
            categoryName: category,
            assets: groupedData['Sem Contrato'][category]
          }))
      })
    }

    return { report: result }
  }
}
