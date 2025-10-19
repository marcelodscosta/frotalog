import { describe, it, expect } from 'vitest'
import { isValidCNPJ, formatCNPJ } from '../cnpjValidate'

describe('CNPJ Validation', () => {
  describe('isValidCNPJ', () => {
    it('should validate correct CNPJ', () => {
      // CNPJ válido: 11.222.333/0001-81
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true)
      expect(isValidCNPJ('11222333000181')).toBe(true)
    })

    it('should reject invalid CNPJ', () => {
      expect(isValidCNPJ('11.222.333/0001-82')).toBe(false)
      expect(isValidCNPJ('11222333000182')).toBe(false)
    })

    it('should reject CNPJ with wrong length', () => {
      expect(isValidCNPJ('1234567890123')).toBe(false) // 13 digits
      expect(isValidCNPJ('123456789012345')).toBe(false) // 15 digits
    })

    it('should reject CNPJ with all same digits', () => {
      expect(isValidCNPJ('11111111111111')).toBe(false)
      expect(isValidCNPJ('00000000000000')).toBe(false)
    })

    it('should reject empty or invalid input', () => {
      expect(isValidCNPJ('')).toBe(false)
      expect(isValidCNPJ('abc')).toBe(false)
      expect(isValidCNPJ('1234567890123a')).toBe(false)
    })
  })

  describe('formatCNPJ', () => {
    it('should format CNPJ correctly', () => {
      expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81')
      expect(formatCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81')
    })

    it('should handle invalid input gracefully', () => {
      expect(formatCNPJ('123')).toBe('123')
      expect(formatCNPJ('')).toBe('')
    })
  })
})
