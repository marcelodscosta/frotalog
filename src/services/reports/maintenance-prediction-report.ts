import { prisma } from '../../lib/prisma'

interface MaintenancePredictionItem {
  id: string
  code: string | null
  description: string
  
  // Horometer Logic
  currentHorometer: number
  lastMaintenanceHorometer: number
  nextMaintenanceHorometer: number
  remainingHours: number
  frequencyHours: number | null
  
  // Odometer Logic
  currentOdometer: number
  lastMaintenanceOdometer: number
  nextMaintenanceOdometer: number
  remainingKm: number
  frequencyKm: number | null
  
  status: 'OK' | 'WARNING' | 'OVERDUE'
  category: string
}

export class MaintenancePredictionReport {
  async execute() {
    const assets = await prisma.asset.findMany({
      where: { is_Active: true },
      include: {
        assetCategory: true,
      }
    })

    const reportData: MaintenancePredictionItem[] = assets.map(asset => {
      // 1. Horometer Calculations
      const currentHorometer = asset.current_horometer || 0
      const lastMainHorometer = asset.last_maintenance_horometer || asset.initial_horometer || 0
      const freqHours = asset.maintenance_frequency_hours || 0
      
      let nextMainHorometer = 0
      let remainingHours = 0
      
      if (freqHours > 0) {
          // If never maintained, base on initial. If maintained, base on last.
          // Actually, next = last + freq
          nextMainHorometer = lastMainHorometer + freqHours
          remainingHours = nextMainHorometer - currentHorometer
      }

      // 2. Odometer Calculations
      const currentOdometer = asset.current_odometer || 0
      const lastMainOdometer = asset.last_maintenance_odometer || asset.initial_odometer || 0
      const freqKm = asset.maintenance_frequency_km || 0
      
      let nextMainOdometer = 0
      let remainingKm = 0
      
      if (freqKm > 0) {
          nextMainOdometer = lastMainOdometer + freqKm
          remainingKm = nextMainOdometer - currentOdometer
      }

      // 3. Status Determination
      let status: 'OK' | 'WARNING' | 'OVERDUE' = 'OK'

      // Check Hours
      if (freqHours > 0) {
        if (remainingHours < 0) status = 'OVERDUE'
        else if (remainingHours < (freqHours * 0.1)) status = 'WARNING' // < 10% left
      }

      // Check Km (override if worse)
      if (freqKm > 0) {
         if (remainingKm < 0) status = 'OVERDUE'
         else if (remainingKm < (freqKm * 0.1) && status !== 'OVERDUE') status = 'WARNING'
      }
      
      // If no frequency set, status stays OK (or maybe 'N/A' but UI handles empty)

      return {
        id: asset.id,
        code: asset.plate || asset.serial_number || 'S/N',
        description: `${asset.brand} ${asset.model}`,
        
        currentHorometer,
        lastMaintenanceHorometer: lastMainHorometer,
        nextMaintenanceHorometer: nextMainHorometer,
        remainingHours,
        frequencyHours: freqHours > 0 ? freqHours : null,
        
        currentOdometer,
        lastMaintenanceOdometer: lastMainOdometer,
        nextMaintenanceOdometer: nextMainOdometer,
        remainingKm,
        frequencyKm: freqKm > 0 ? freqKm : null,
        
        status,
        category: asset.assetCategory?.name || 'Sem Categoria'
      }
    })

    // Sort by status urgency: OVERDUE > WARNING > OK
    const statusWeight = { 'OVERDUE': 3, 'WARNING': 2, 'OK': 1 }
    
    return reportData.sort((a, b) => statusWeight[b.status] - statusWeight[a.status])
  }
}
