export function isValidCNPJ(cnpj: string) {
  const cleaned = cnpj.replace(/[^\d]+/g, '')
  return /^[0-9]{14}$/.test(cleaned)
}
