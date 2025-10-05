import { Prisma, Supplier } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { ISupplierRepository } from '../interfaces/ISupplierRepository'

export class PrismaSupplierRepository implements ISupplierRepository {
  async create(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    return await prisma.supplier.create({ data })
  }
}
