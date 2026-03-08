import {
  ChecklistParameter,
  ChecklistItemTemplate,
  Checklist,
  ChecklistAnswer,
  Prisma,
} from '../../generated/prisma'

export interface ChecklistWithDetails extends Checklist {
  checklistParameter: ChecklistParameter & {
    items: ChecklistItemTemplate[]
  }
  asset: { id: string; brand: string; model: string; plate: string | null; serial_number: string | null; current_horometer: number | null; current_odometer: number | null }
  supplier: { id: string; company_name: string; trading_name: string | null; cnpj: string } | null
  answers: (ChecklistAnswer & {
    checklistItemTemplate: ChecklistItemTemplate
  })[]
}

export interface IChecklistRepository {
  // ChecklistParameter
  createParameter(data: Prisma.ChecklistParameterCreateInput): Promise<ChecklistParameter>
  updateParameter(id: string, data: Prisma.ChecklistParameterUpdateInput): Promise<ChecklistParameter>
  findParameterById(id: string): Promise<(ChecklistParameter & { items: ChecklistItemTemplate[] }) | null>
  findAllParameters(): Promise<(ChecklistParameter & { items: ChecklistItemTemplate[] })[]>
  deleteParameter(id: string): Promise<void>

  // ChecklistItemTemplate
  createItem(data: Prisma.ChecklistItemTemplateUncheckedCreateInput): Promise<ChecklistItemTemplate>
  updateItem(id: string, data: Prisma.ChecklistItemTemplateUpdateInput): Promise<ChecklistItemTemplate>
  deleteItem(id: string): Promise<void>

  // Checklist
  createChecklist(data: Prisma.ChecklistUncheckedCreateInput): Promise<Checklist>
  findChecklistById(id: string): Promise<ChecklistWithDetails | null>
  findChecklistByMagicLink(magicLinkId: string): Promise<ChecklistWithDetails | null>
  findAllChecklists(filters?: { assetId?: string; type?: string; status?: string }): Promise<ChecklistWithDetails[]>
  updateChecklist(id: string, data: Prisma.ChecklistUncheckedUpdateInput): Promise<Checklist>
  deleteChecklist(id: string): Promise<void>

  // ChecklistAnswer
  upsertAnswer(data: {
    checklistId: string
    checklistItemTemplateId: string
    conforms: boolean | null
    notes?: string | null
    photoUrl?: string | null
  }): Promise<ChecklistAnswer>
  findAnswersByChecklistId(checklistId: string): Promise<(ChecklistAnswer & { checklistItemTemplate: ChecklistItemTemplate })[]>
}
