import { randomUUID } from 'crypto'
import { Prisma, Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../interfaces/ISupplierRepository'

export class InMemorySupplierRepository implements ISupplierRepository {
  public items: Supplier[] = []

  async create(data: Prisma.SupplierCreateInput): Promise<Supplier> {
    const supplier: Supplier = {
      id: data.id ?? randomUUID(),
      company_name: data.company_name,
      trading_name: data.trading_name ?? null,
      cnpj: data.cnpj,
      email: data.email,
      phone: data.phone,
      contact: data.contact,

      adrdress: data.adrdress ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      zip_code: data.zip_code ?? null,

      service_types: Array.isArray(data.service_types)
        ? data.service_types
        : (data.service_types?.set ?? []),

      created_at: new Date(),
      updated_at: new Date(),

      is_Active: data.is_Active ?? true,
    }
    this.items.push(supplier)

    return supplier
  }
}
