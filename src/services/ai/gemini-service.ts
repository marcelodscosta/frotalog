import { GoogleGenerativeAI, SchemaType, FunctionDeclaration, Part } from '@google/generative-ai'
import { env } from '../../env'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { uploadToB2 } from '../../lib/storage'
import { marked } from 'marked'
import { JSDOM } from 'jsdom'
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake'
// @ts-ignore
const PdfPrinter = require('pdfmake/js/printer').default

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private assetRepo: PrismaAssetRepository
  private supplierRepo: PrismaSupplierRepository
  private expenseRepo: PrismaPayableExpenseRepository
  private maintenanceRepo: PrismaMaintenanceRepository
  private contractRepo: PrismaContractRepository

  constructor() {
    if (env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    }
    this.assetRepo = new PrismaAssetRepository()
    this.supplierRepo = new PrismaSupplierRepository()
    this.expenseRepo = new PrismaPayableExpenseRepository()
    this.maintenanceRepo = new PrismaMaintenanceRepository()
    this.contractRepo = new PrismaContractRepository()
  }

  async sendMessage(prompt: string, history?: Array<{ role: 'user' | 'model', parts: Array<{ text: string }> }>, userName?: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini API Key não está configurada no ambiente.')
    }

    try {
      const functionDeclarations: FunctionDeclaration[] = [
        {
          name: 'searchAssets',
          description: 'Busca os veículos ou equipamentos (assets) cadastrados na frota.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              plate: { type: SchemaType.STRING, description: 'Placa do veículo (opcional)' },
              brand: { type: SchemaType.STRING, description: 'Marca do veículo (opcional)' },
            },
          },
        },
        {
          name: 'searchSuppliers',
          description: 'Busca os fornecedores cadastrados no sistema.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              companyName: { type: SchemaType.STRING, description: 'Nome do fornecedor (opcional)' },
            },
          },
        },
        {
          name: 'getExpenseSummary',
          description: 'Puxa o painel financeiro geral de um mês específico (contas a pagar vencidas, para hoje, pagas, e total).',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              month: { type: SchemaType.NUMBER, description: 'Mês (1-12)' },
              year: { type: SchemaType.NUMBER, description: 'Ano (ex: 2026)' },
            },
            required: ['month', 'year']
          },
        },
        {
          name: 'searchMaintenances',
          description: 'Busca manutenções no sistema. Pode buscar por status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED).',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              status: { type: SchemaType.STRING, description: 'Status da manutenção' },
            },
          },
        },
        {
          name: 'searchContracts',
          description: 'Busca contratos ativos e seus status.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              clientName: { type: SchemaType.STRING, description: 'Nome do cliente (opcional)' }
            },
          },
        }
      ]

      const isNewConversation = !history || history.length === 0
      const userContext = userName 
        ? ` O usuário atual se chama ${userName}.${isNewConversation ? ` Como esta é a primeira mensagem da conversa, cumprimente-o educadamente pelo nome no início da resposta (ex: "Olá ${userName}, tudo bem?").` : ''}` 
        : ''

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        tools: [{ functionDeclarations }],
        systemInstruction: `Você é um assistente analítico e inteligente do sistema Frotalog. Você usa as ferramentas disponíveis para cruzar dados de veículos, financeiro (despesas), manutenções e contratos para responder as perguntas do usuário. Responda de forma humanizada, direta e focada em ajudar a gerenciar a frota. Você agora possui MEMÓRIA e entende o contexto das mensagens anteriores.${userContext}`,
      })

      const contents: any[] = history ? [...history] : []
      contents.push({ role: 'user', parts: [{ text: prompt }] })

      let result = await model.generateContent({ contents })
      let response = result.response

      let functionCalls = response.functionCalls()
      while (functionCalls && functionCalls.length > 0) {
        // Save the model's function call response to history
        contents.push(response.candidates![0].content)

        const functionResponses: Part[] = []

        for (const call of functionCalls) {
          let apiResponse: any = null
          
          if (call.name === 'searchAssets') {
            const plate = (call.args as any)?.plate as string | undefined
            const brand = (call.args as any)?.brand as string | undefined
            const searchResult = await this.assetRepo.search({ plate, brand, page: 1 })
            apiResponse = { 
              totalFound: searchResult.totalItems,
              items: searchResult.items.map(i => ({ model: i.model, brand: i.brand, plate: i.plate, year: i.year }))
            }
          } 
          else if (call.name === 'searchSuppliers') {
            const companyName = (call.args as any)?.companyName as string | undefined
            if (companyName) {
              const searchResult = await this.supplierRepo.findByCompanyName(1, companyName)
              apiResponse = {
                totalFound: searchResult.totalItems,
                items: searchResult.items.map(s => ({ name: s.company_name, cnpj: s.cnpj }))
              }
            } else {
              const all = await this.supplierRepo.findAllUnpaginated()
              apiResponse = {
                totalFound: all.length,
                items: all.slice(0, 20).map(s => ({ name: s.company_name, cnpj: s.cnpj }))
              }
            }
          }
          else if (call.name === 'getExpenseSummary') {
            const month = (call.args as any)?.month as number
            const year = (call.args as any)?.year as number
            apiResponse = await this.expenseRepo.getSummary(month, year)
          }
          else if (call.name === 'searchMaintenances') {
            const status = (call.args as any)?.status as string | undefined
            const searchResult = await this.maintenanceRepo.findAll({ page: 1, status })
            apiResponse = {
              totalFound: searchResult.totalItems,
              items: searchResult.items.map(m => ({
                type: m.type,
                status: m.status,
                assetPlate: m.asset?.plate,
                scheduledDate: m.scheduled_date
              }))
            }
          }
          else if (call.name === 'searchContracts') {
            const searchResult = await this.contractRepo.findAllUnpaginated()
            apiResponse = {
              totalFound: searchResult.length,
              items: searchResult.map(c => ({
                number: c.contract_number,
                status: c.status,
                amount: c.total_value,
                startDate: c.start_date,
                endDate: c.end_date
              }))
            }
          }

          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: apiResponse
            }
          })
        }

        // Send back the function responses as 'user' role
        contents.push({ role: 'user', parts: functionResponses })
        result = await model.generateContent({ contents })
        response = result.response
        functionCalls = response.functionCalls()
      }

      // Check if text is present to avoid crashing if it only contains functionCalls
      const text = response.text ? response.text() : ''
      return text
    } catch (error) {
      console.error('Erro ao chamar o Gemini:', error)
      throw new Error('Falha ao processar a mensagem com a inteligência artificial.')
    }
  }
}
