export class AssetCategoryNotFoundError extends Error {
  constructor() {
    super('Asset category does not exist.')
  }
}
