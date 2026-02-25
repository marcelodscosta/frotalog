import { FastifyInstance } from 'fastify'
import { createContract } from './create-contract-controller'
import { updateContract } from './update-contract-controller'
import { getContractById } from './get-contract-by-id-controller'
import { deleteContract } from './delete-contract-controller'
import { fetchAllContracts } from './fetch-all-contracts-controller'
import { fetchAllContractsUnpaginated } from './fetch-all-contracts-unpaginated-controller'
import { fetchContractsByClient } from './fetch-contracts-by-client-controller'
import { getContractByNumber } from './get-contract-by-number-controller'
import { searchContracts } from './search-contracts-controller'
import { getContractWithDetails } from './get-contract-with-details-controller'
import { getActiveContractByAsset } from './get-active-contract-by-asset-controller'
import { getContractFinancialSummary } from './get-contract-financial-summary-controller'

export async function contractRoutes(app: FastifyInstance) {
  app.post('/contract', createContract)
  app.patch('/contract/:id', updateContract)
  app.get('/contract/:id', getContractById)
  app.get('/contracts', fetchAllContracts)
  app.get('/contracts/all', fetchAllContractsUnpaginated)
  app.get('/contracts/client', fetchContractsByClient)
  app.get('/contract/search/', getContractByNumber)
  app.get('/contracts/search', searchContracts)
  app.get('/contract/:id/details', getContractWithDetails)
  app.get('/contract/:id/financials', getContractFinancialSummary)
  app.get('/contract/asset/:assetId', getActiveContractByAsset)

  app.patch('/contract/:id/delete', deleteContract)
}
