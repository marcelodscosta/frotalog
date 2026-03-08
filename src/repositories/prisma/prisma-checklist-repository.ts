import { Prisma, ChecklistParameter, ChecklistItemTemplate, Checklist, ChecklistAnswer } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { IChecklistRepository, ChecklistWithDetails } from '../interfaces/IChecklistRepository'

const checklistInclude = {
  checklistParameter: {
    include: { items: { where: { is_active: true }, orderBy: { order: 'asc' as const } } },
  },
  asset: {
    select: { id: true, brand: true, model: true, plate: true, serial_number: true, current_horometer: true, current_odometer: true },
  },
  supplier: {
    select: { id: true, company_name: true, trading_name: true, cnpj: true },
  },
  answers: {
    include: { checklistItemTemplate: true },
  },
}

export class PrismaChecklistRepository implements IChecklistRepository {
  // ── ChecklistParameter ──
  async createParameter(data: Prisma.ChecklistParameterCreateInput): Promise<ChecklistParameter> {
    return prisma.checklistParameter.create({ data })
  }

  async updateParameter(id: string, data: Prisma.ChecklistParameterUpdateInput): Promise<ChecklistParameter> {
    return prisma.checklistParameter.update({ where: { id }, data })
  }

  async findParameterById(id: string) {
    return prisma.checklistParameter.findUnique({
      where: { id },
      include: { items: { where: { is_active: true }, orderBy: { order: 'asc' } } },
    })
  }

  async findAllParameters() {
    return prisma.checklistParameter.findMany({
      where: { is_active: true },
      include: { items: { where: { is_active: true }, orderBy: { order: 'asc' } } },
      orderBy: { name: 'asc' },
    })
  }

  async deleteParameter(id: string): Promise<void> {
    await prisma.checklistParameter.update({ where: { id }, data: { is_active: false } })
  }

  // ── ChecklistItemTemplate ──
  async createItem(data: Prisma.ChecklistItemTemplateUncheckedCreateInput): Promise<ChecklistItemTemplate> {
    return prisma.checklistItemTemplate.create({ data })
  }

  async updateItem(id: string, data: Prisma.ChecklistItemTemplateUpdateInput): Promise<ChecklistItemTemplate> {
    return prisma.checklistItemTemplate.update({ where: { id }, data })
  }

  async deleteItem(id: string): Promise<void> {
    await prisma.checklistItemTemplate.update({ where: { id }, data: { is_active: false } })
  }

  // ── Checklist ──
  async createChecklist(data: Prisma.ChecklistUncheckedCreateInput): Promise<Checklist> {
    return prisma.checklist.create({ data })
  }

  async findChecklistById(id: string): Promise<ChecklistWithDetails | null> {
    return prisma.checklist.findUnique({
      where: { id },
      include: checklistInclude,
    }) as Promise<ChecklistWithDetails | null>
  }

  async findChecklistByMagicLink(magicLinkId: string): Promise<ChecklistWithDetails | null> {
    return prisma.checklist.findUnique({
      where: { magicLinkId },
      include: checklistInclude,
    }) as Promise<ChecklistWithDetails | null>
  }

  async findAllChecklists(filters?: { assetId?: string; type?: string; status?: string }): Promise<ChecklistWithDetails[]> {
    const where: Prisma.ChecklistWhereInput = { is_active: true }
    if (filters?.assetId) where.assetId = filters.assetId
    if (filters?.type) where.type = filters.type as any
    if (filters?.status) where.status = filters.status as any

    return prisma.checklist.findMany({
      where,
      include: checklistInclude,
      orderBy: { created_at: 'desc' },
    }) as Promise<ChecklistWithDetails[]>
  }

  async updateChecklist(id: string, data: Prisma.ChecklistUncheckedUpdateInput): Promise<Checklist> {
    return prisma.checklist.update({ where: { id }, data })
  }

  async deleteChecklist(id: string): Promise<void> {
    await prisma.checklist.update({ where: { id }, data: { is_active: false } })
  }

  // ── ChecklistAnswer ──
  async upsertAnswer(data: {
    checklistId: string
    checklistItemTemplateId: string
    conforms: boolean | null
    notes?: string | null
    photoUrl?: string | null
  }): Promise<ChecklistAnswer> {
    // Check if answer already exists
    const existing = await prisma.checklistAnswer.findFirst({
      where: {
        checklistId: data.checklistId,
        checklistItemTemplateId: data.checklistItemTemplateId,
      },
    })

    if (existing) {
      return prisma.checklistAnswer.update({
        where: { id: existing.id },
        data: {
          conforms: data.conforms,
          notes: data.notes,
          photoUrl: data.photoUrl,
        },
      })
    }

    return prisma.checklistAnswer.create({
      data: {
        checklistId: data.checklistId,
        checklistItemTemplateId: data.checklistItemTemplateId,
        conforms: data.conforms,
        notes: data.notes,
        photoUrl: data.photoUrl,
      },
    })
  }

  async findAnswersByChecklistId(checklistId: string) {
    return prisma.checklistAnswer.findMany({
      where: { checklistId },
      include: { checklistItemTemplate: true },
    })
  }
}
