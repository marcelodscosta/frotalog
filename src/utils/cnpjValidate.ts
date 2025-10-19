export function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = cnpj.replace(/[^\d]+/g, '')
  
  // Verifica se tem 14 dígitos
  if (cleaned.length !== 14) {
    return false
  }
  
  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cleaned)) {
    return false
  }
  
  // Calcula o primeiro dígito verificador
  let sum = 0
  let weight = 5
  
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  
  const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  if (parseInt(cleaned[12]) !== firstDigit) {
    return false
  }
  
  // Calcula o segundo dígito verificador
  sum = 0
  weight = 6
  
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  
  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  
  return parseInt(cleaned[13]) === secondDigit
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/[^\d]+/g, '')
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}
