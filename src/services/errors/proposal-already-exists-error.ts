export class ProposalAlreadyExistsError extends Error {
  public readonly statusCode: number

  constructor() {
    super('Commercial proposal with this number already exists')
    this.name = 'ProposalAlreadyExistsError'
    this.statusCode = 409
  }
}
