export class AssetNotFoundError extends Error {
  constructor() {
    super('Asset does not exist.')
  }
}
