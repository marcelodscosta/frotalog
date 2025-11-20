import { randomUUID } from 'crypto'
import { Prisma, Supplier } from '../../generated/prisma'
import { ISupplierRepository } from '../interfaces/ISupplierRepository'
import { SupplierNotFoundError } from '../../services/errors/supplier-not-found-error'
import { PaginatedResult } from '../interfaces/IPaginatedResult'

export class InMemorySupplierRepository implements ISupplierRepository {
  public items: Supplier[] = []

  async findByServiceType(
    serviceType: string,
    page: number,
  ): Promise<PaginatedResult<Supplier>> {
    const PAGE_SIZE = 20
    const query = serviceType?.toLowerCase() ?? ''
    const filtered = this.items.filter(
      (item) =>
        Array.isArray(item.service_types) &&
        item.service_types.some((st) => (st ?? '').toLowerCase() === query),
    )
    const skip = (page - 1) * PAGE_SIZE
    const paged = filtered.slice(skip, skip + PAGE_SIZE)
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

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

  async updateSupplier(
    id: string,
    data: Prisma.SupplierUpdateInput,
  ): Promise<Supplier> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new SupplierNotFoundError()
    }
    const existing = this.items[index]
    const updated = {
      ...existing,
      ...data,
      updated_at: new Date(),
    }
    this.items[index] = updated as Supplier
    return this.items[index]
  }

  async findById(id: string): Promise<Supplier | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async findByCompanyName(
    page: number,
    query: string,
  ): Promise<PaginatedResult<Supplier>> {
    const PAGE_SIZE = 20
    const filtered = this.items.filter((item) =>
      item.company_name.toLowerCase().includes(query.toLowerCase()),
    )
    const skip = (page - 1) * PAGE_SIZE
    const paged = filtered.slice(skip, skip + PAGE_SIZE)
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }

  async findAll(page: number): Promise<PaginatedResult<Supplier>> {
    const PAGE_SIZE = 20
    const skip = (page - 1) * PAGE_SIZE
    const paged = this.items.slice(skip, skip + PAGE_SIZE)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / PAGE_SIZE)

    return {
      items: paged,
      currentPage: page,
      pageSize: PAGE_SIZE,
      totalItems,
      totalPages,
    }
  }
}
