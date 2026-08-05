import { GoogleGenerativeAI, SchemaType, FunctionDeclaration, Part } from '@google/generative-ai'
import { env } from '../../env'
import { PrismaAssetRepository } from '../../repositories/prisma/prisma-asset-repository'
import { PrismaSupplierRepository } from '../../repositories/prisma/prisma-supplier-repository'
import { PrismaPayableExpenseRepository } from '../../repositories/prisma/prisma-payable-expense-repository'
import { PrismaMaintenanceRepository } from '../../repositories/prisma/prisma-maintenance-repository'
import { PrismaContractRepository } from '../../repositories/prisma/prisma-contract-repository'
import { PrismaAssetCategoryRepository } from '../../repositories/prisma/prisma-asset-category-repository'
import { uploadToB2 } from '../../lib/storage'


export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private assetRepo: PrismaAssetRepository
  private assetCategoryRepo: PrismaAssetCategoryRepository
  private supplierRepo: PrismaSupplierRepository
  private expenseRepo: PrismaPayableExpenseRepository
  private maintenanceRepo: PrismaMaintenanceRepository
  private contractRepo: PrismaContractRepository

  constructor() {
    if (env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    }
    this.assetRepo = new PrismaAssetRepository()
    this.assetCategoryRepo = new PrismaAssetCategoryRepository()
    this.supplierRepo = new PrismaSupplierRepository()
    this.expenseRepo = new PrismaPayableExpenseRepository()
    this.maintenanceRepo = new PrismaMaintenanceRepository()
    this.contractRepo = new PrismaContractRepository()
  }

  async sendMessage(prompt: string, history?: Array<{ role: 'user' | 'model', parts: Array<any> }>, userName?: string, fileData?: { mimeType: string, base64: string }): Promise<string> {
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
        },
        {
          name: 'searchAssetCategories',
          description: 'Busca as categorias de veículos/equipamentos disponíveis (necessário para descobrir o ID antes de cadastrar um asset).',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING, description: 'Nome da categoria (opcional)' },
            },
          },
        },
        {
          name: 'createAsset',
          description: 'Cadastra um novo veículo ou equipamento no sistema.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              plate: { type: SchemaType.STRING, description: 'Placa do veículo (obrigatório para carros/motos, opcional para equipamentos)' },
              brand: { type: SchemaType.STRING, description: 'Marca (ex: Fiat, Ford)' },
              model: { type: SchemaType.STRING, description: 'Modelo do veículo (ex: Uno, Gol)' },
              year: { type: SchemaType.NUMBER, description: 'Ano de fabricação' },
              ownership: { type: SchemaType.STRING, description: 'Propriedade: "OWN" (próprio) ou "THIRD" (terceiro)' },
              assetCategoryId: { type: SchemaType.STRING, description: 'ID da Categoria (obtido via searchAssetCategories)' },
            },
            required: ['brand', 'model', 'ownership', 'assetCategoryId']
          },
        },
        {
          name: 'createSupplier',
          description: 'Cadastra um novo cliente ou fornecedor no sistema.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              companyName: { type: SchemaType.STRING, description: 'Razão social ou nome da empresa' },
              cnpj: { type: SchemaType.STRING, description: 'CNPJ da empresa (somente os números, ou formato com pontuação)' },
              email: { type: SchemaType.STRING, description: 'E-mail de contato' },
              phone: { type: SchemaType.STRING, description: 'Telefone de contato' },
              contact: { type: SchemaType.STRING, description: 'Nome da pessoa de contato na empresa' },
              address: { type: SchemaType.STRING, description: 'Endereço completo (Rua, Número, Bairro)' },
              city: { type: SchemaType.STRING, description: 'Cidade' },
              state: { type: SchemaType.STRING, description: 'Estado (UF)' },
              zipCode: { type: SchemaType.STRING, description: 'CEP' },
              serviceTypes: { 
                type: SchemaType.ARRAY, 
                items: { type: SchemaType.STRING },
                description: 'Tipos de serviço prestados (ex: Mecânica, Peças, Borracharia)' 
              },
              isClient: { type: SchemaType.BOOLEAN, description: 'True se for um Cliente, False se for um Fornecedor' },
            },
            required: ['companyName', 'cnpj', 'email', 'phone', 'contact', 'address', 'city', 'state', 'zipCode', 'serviceTypes', 'isClient']
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
        systemInstruction: `Você é um assistente analítico e inteligente do sistema Frotalog. Você usa as ferramentas disponíveis para cruzar dados de veículos, financeiro (despesas), manutenções e contratos para responder as perguntas do usuário. Você agora possui permissão para realizar cadastros (como criar veículos, fornecedores e clientes) caso o usuário solicite. Você pode ler documentos em anexo (como cartões CNPJ, CRLV) para extrair dados. Não faça alterações destrutivas sem confirmar. Responda de forma humanizada, direta e focada em ajudar a gerenciar a frota. Você agora possui MEMÓRIA e entende o contexto das mensagens anteriores.${userContext}`,
      })

      const contents: any[] = history ? [...history] : []
      const userParts: any[] = [{ text: prompt }]
      if (fileData) {
        userParts.push({
          inlineData: {
            data: fileData.base64,
            mimeType: fileData.mimeType
          }
        })
      }
      contents.push({ role: 'user', parts: userParts })

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
          else if (call.name === 'searchAssetCategories') {
            const name = (call.args as any)?.name as string | undefined
            const searchResult = await this.assetCategoryRepo.searchAssetCategory(name || '', 1)
            apiResponse = {
              totalFound: searchResult.totalItems,
              items: searchResult.items.map(c => ({ id: c.id, name: c.name, type: c.type }))
            }
          }
          else if (call.name === 'createAsset') {
            try {
              const args = call.args as any
              const newAsset = await this.assetRepo.create({
                brand: args.brand,
                model: args.model,
                plate: args.plate,
                year: args.year,
                ownership: args.ownership,
                assetCategoryId: args.assetCategoryId,
                is_Active: true,
              })
              apiResponse = { 
                success: true, 
                message: 'Veículo cadastrado com sucesso!',
                assetId: newAsset.id 
              }
            } catch (error) {
              apiResponse = { success: false, error: 'Falha ao cadastrar o veículo. Verifique se a placa já existe ou se os dados estão corretos.' }
            }
          }
          else if (call.name === 'createSupplier') {
            try {
              const args = call.args as any
              
              // Remove qualquer caractere que não seja número do CNPJ
              const cleanCnpj = args.cnpj.replace(/\D/g, '')

              const exists = await this.supplierRepo.findByCNPJ(cleanCnpj)
              if (exists) {
                 apiResponse = { success: false, error: 'Já existe um cadastro com este CNPJ no sistema.' }
              } else {
                 const newSupplier = await this.supplierRepo.create({
                   company_name: args.companyName,
                   cnpj: cleanCnpj,
                   email: args.email,
                   phone: args.phone,
                   contact: args.contact,
                   address: args.address,
                   city: args.city,
                   state: args.state,
                   zip_code: args.zipCode,
                   service_types: args.serviceTypes || [],
                   isClient: args.isClient,
                   is_Active: true,
                 })
                 apiResponse = { 
                   success: true, 
                   message: args.isClient ? 'Cliente cadastrado com sucesso!' : 'Fornecedor cadastrado com sucesso!',
                   supplierId: newSupplier.id 
                 }
              }
            } catch (error) {
              apiResponse = { success: false, error: 'Falha ao cadastrar no banco de dados. Verifique os dados e tente novamente.' }
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
      console.error('Erro ao comunicar com o Gemini:', error)
      throw new Error('Falha ao processar a mensagem com a Inteligência Artificial.')
    }
  }

  async analyzePricing(data: any): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini API Key não está configurada no ambiente.')
    }
    const model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

    const prompt = `Você é um Consultor Financeiro Sênior especialista em locação de frotas e equipamentos.
Analise a seguinte formação de preço de locação e dê um parecer claro e direto sobre a viabilidade (riscos, se a margem está boa, se a manutenção ou os juros estão coerentes com as práticas de mercado). Não use jargões difíceis, fale como se estivesse aconselhando o dono da locadora. Responda em Markdown.

DADOS DA SIMULAÇÃO:
- Equipamento / Categoria: ${data.categoryName}
- Valor do Ativo de Locação: R$ ${data.assetValue.toFixed(2)}
- Prazo do Contrato: ${data.durationMonths} meses
- Vida Útil Estimada do Ativo: ${data.usefulLifeMonths} meses
- Valor Residual Esperado ao final da Vida Útil: ${data.residualValuePerc}%
- Custo de Capital / TMA: ${data.interestRate}% ao mês
${data.financingInstallment ? `- Parcela Mensal de Financiamento: R$ ${data.financingInstallment.toFixed(2)}\n` : ''}- Provisão de Manutenção Anual: ${data.maintenancePerc}% do valor do ativo
- Seguro Anual: ${data.insurancePerc}%
- IPVA / Taxas Anuais: ${data.ipvaPerc}%
- Impostos sobre Faturamento: ${data.taxesPerc}%
- Despesas Administrativas: ${data.adminPerc}%
- Margem de Lucro Líquida Alvo: ${data.marginPerc}%
-----------------------
RESULTADOS CALCULADOS (Considerando a depreciação pela vida útil):
- Preço da Parcela Sugerida: R$ ${data.suggestedMonthlyPrice.toFixed(2)} por mês
- Receita Bruta Total do Contrato (${data.durationMonths}m): R$ ${data.totalRevenue.toFixed(2)}
- Custo Total Estimado no Contrato: R$ ${data.totalCost.toFixed(2)}
- Lucro Líquido Esperado no Contrato: R$ ${data.netProfit.toFixed(2)}

Por favor, forneça um parecer destacando:
1. Se a taxa de depreciação e manutenção fazem sentido para o equipamento (${data.categoryName}).
2. Se o Custo de Capital e a Margem estão protegendo a empresa.
3. Se a parcela de locação está atrativa ou fora do mercado.`

    try {
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error('Erro ao analisar precificação com o Gemini:', error)
      throw new Error('Falha ao gerar o parecer financeiro.')
    }
  }
}
