import { FastifyInstance } from 'fastify'
import { createCommercialProposal } from './create-commercial-proposal-controller'
import { searchCommercialProposals } from './search-commercial-proposals-controller'
import { getCommercialProposal } from './get-commercial-proposal-controller'
import { updateCommercialProposal } from './update-commercial-proposal-controller'
import { convertProposalToContract } from './convert-proposal-to-contract-controller'
import { fetchAllProposalsUnpaginated } from './fetch-all-proposals-unpaginated-controller'
import { deleteCommercialProposal } from './delete-commercial-proposal-controller'

export async function commercialProposalRoutes(app: FastifyInstance) {
  app.post('/proposals', createCommercialProposal)
  app.get('/proposals/all', fetchAllProposalsUnpaginated)
  app.get('/proposals/search', searchCommercialProposals)
  app.get('/proposals/:id', getCommercialProposal)
  app.put('/proposals/:id', updateCommercialProposal)
  app.post('/proposals/convert', convertProposalToContract)
  app.delete('/proposals/:id', deleteCommercialProposal)
}
