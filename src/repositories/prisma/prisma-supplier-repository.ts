import { Prisma, Supplier } from '../../generated/prisma'
import { prisma } from '../../lib/prisma'
import { ISupplierRepository } from '../interfaces/ISupplierRepository'

export class PrismaSupplierRepository implements ISupplierRepository {
  async create(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    return await prisma.supplier.create({ data })
  }

  async findById(id: string): Promise<Supplier | null> {
    return await prisma.supplier.findFirst({
      where: {
        id,
      },
    })
  }

  async updateSupplier(
    id: string,
    data: Prisma.SupplierUpdateInput,
  ): Promise<Supplier> {
    const supplier = await prisma.supplier.update({
      where: {
        id,
      },
      data,
    })
    return supplier
  }
}
