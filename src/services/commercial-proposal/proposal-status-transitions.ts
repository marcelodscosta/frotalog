import { ProposalStatus } from '../../generated/prisma'
import { AppError } from '../errors/app-error'

/**
 * Máquina de estados da proposta comercial.
 * CONVERTED só é atingido via "Gerar contrato" ou "Vincular contrato".
 */
const ALLOWED_TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  DRAFT: ['SENT', 'APPROVED', 'REJECTED', 'CANCELLED'],
  SENT: ['DRAFT', 'APPROVED', 'REJECTED', 'CANCELLED'],
  APPROVED: ['SENT', 'REJECTED', 'CANCELLED'],
  REJECTED: ['DRAFT', 'SENT'],
  CANCELLED: ['DRAFT'],
  EXPIRED: ['DRAFT', 'SENT'],
  CONVERTED: [],
}

export function assertProposalTransition(from: ProposalStatus, to: ProposalStatus) {
  if (from === to) return
  if (to === 'CONVERTED') {
    throw new AppError('Use a ação "Gerar contrato" para converter uma proposta aprovada.', 400)
  }
  if (!ALLOWED_TRANSITIONS[from]?.includes(to)) {
    throw new AppError(`Transição de status inválida: ${from} → ${to}.`, 400)
  }
}
