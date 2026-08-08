import { GoogleGenerativeAI, SchemaType, FunctionDeclaration, Part } from '@google/generative-ai'
import { env } from '../../env'
import { prisma } from '../../lib/prisma'

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null

  constructor() {
    if (env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
    }
  }

  async sendMessage(prompt: string, history?: Array<{ role: 'user' | 'model', parts: Array<any> }>, userName?: string, fileData?: { mimeType: string, base64: string }, authToken?: string): Promise<string> {
    if (!this.genAI) {
      throw new Error('Gemini API Key não está configurada no ambiente.')
    }

    try {
      const functionDeclarations: FunctionDeclaration[] = [
        {
          name: 'executePrismaQuery',
          description: 'Executa uma consulta de LEITURA no banco de dados Prisma. Use isso para buscar qualquer dado de qualquer tabela no sistema.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              modelName: { type: SchemaType.STRING, description: 'Nome do model (ex: user, asset, supplier, maintenance, contract, invoice, payableExpense, etc)' },
              operation: { type: SchemaType.STRING, description: 'Operação Prisma (ex: findMany, findUnique, findFirst, count, aggregate)' },
              queryArgs: { type: SchemaType.STRING, description: 'String JSON com os argumentos (ex: {"where": {"status": "ACTIVE"}, "include": {"client": true}}). Use chaves e valores válidos para o Prisma.' }
            },
            required: ['modelName', 'operation', 'queryArgs']
          }
        },
        {
          name: 'callInternalAPI',
          description: 'Faz uma requisição HTTP para a API interna do sistema. OBRIGATÓRIO usar isso para CRIAR, ATUALIZAR ou DELETAR registros (POST, PUT, DELETE, PATCH). NUNCA use executePrismaQuery para alterar dados.',
          parameters: {
            type: SchemaType.OBJECT,
            properties: {
              method: { type: SchemaType.STRING, description: 'Método HTTP (POST, PUT, DELETE, PATCH)' },
              endpoint: { type: SchemaType.STRING, description: 'Caminho da API (ex: /assets, /suppliers, /maintenances, /contracts)' },
              body: { type: SchemaType.STRING, description: 'Corpo da requisição em JSON (ex: {"brand": "Fiat", "model": "Uno"}). Passe nulo se não houver body.' }
            },
            required: ['method', 'endpoint']
          }
        }
      ]

      const isNewConversation = !history || history.length === 0
      const userContext = userName 
        ? ` O usuário atual se chama ${userName}.${isNewConversation ? ` Como esta é a primeira mensagem da conversa, cumprimente-o educadamente pelo nome no início da resposta (ex: "Olá ${userName}, tudo bem?").` : ''}` 
        : ''

      const systemInstruction = `Você é um assistente analítico e super inteligente do sistema Frotalog. Você tem 100% de acesso aos dados.
Sempre que precisar BUSCAR ou RESPONDER perguntas sobre dados, use a ferramenta 'executePrismaQuery'.
Sempre que o usuário pedir para CADASTRAR, CRIAR ou ALTERAR algo, use a ferramenta 'callInternalAPI' para manter a segurança das regras de negócio da API. Você não precisa pedir confirmação para buscar dados, mas se for alterar algo importante, confirme antes.

Tabelas do Banco (Prisma):
- user, assetCategory, asset, assetDocument, assetReading, supplier (isClient=true para clientes), serviceCategory, maintenance, maintenanceDocument, contract, assetMovement, measurementBulletin, invoice, bulletinExpense, checklist, commercialProposal, proposalItem, bankAccount, payableExpense, expenseInstallment, financialTransaction, chartOfAccount.

Dicas de API:
Rotas seguem o padrão REST (ex: POST /assets, POST /suppliers).
Não use crases \`\`\` para formatar a string de queryArgs ou body, passe diretamente um JSON stringificado simples.
Você pode ler documentos em anexo (como cartões CNPJ, CRLV) para extrair dados. Responda de forma humanizada e focada em ajudar a gerenciar a frota.${userContext}`

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-flash-latest',
        tools: [{ functionDeclarations }],
        systemInstruction,
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
        contents.push(response.candidates![0].content)

        const functionResponses: Part[] = []

        for (const call of functionCalls) {
          let apiResponse: any = null
          
          if (call.name === 'executePrismaQuery') {
            try {
              const args = call.args as any
              const modelName = args.modelName
              const operation = args.operation
              let queryArgs = {}
              if (args.queryArgs && args.queryArgs.trim() !== '') {
                queryArgs = JSON.parse(args.queryArgs)
              }
              
              const prismaModel = (prisma as any)[modelName]
              if (!prismaModel || typeof prismaModel[operation] !== 'function') {
                apiResponse = { error: `Modelo ${modelName} ou operação ${operation} inválidos no Prisma.` }
              } else {
                // Previne alterações acidentais via executePrismaQuery
                if (['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'].includes(operation)) {
                  apiResponse = { error: 'Operações de escrita devem ser feitas via callInternalAPI para respeitar regras de negócio.' }
                } else {
                  apiResponse = await prismaModel[operation](queryArgs)
                }
              }
            } catch (error: any) {
              apiResponse = { error: `Falha ao executar query: ${error.message}` }
            }
          } 
          else if (call.name === 'callInternalAPI') {
            try {
              const args = call.args as any
              const method = args.method.toUpperCase()
              let endpoint = args.endpoint
              if (!endpoint.startsWith('/')) endpoint = '/' + endpoint
              
              const url = `http://localhost:3333${endpoint}`
              const fetchOptions: RequestInit = {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': authToken || ''
                }
              }
              
              if (args.body && args.body.trim() !== '') {
                fetchOptions.body = typeof args.body === 'string' ? args.body : JSON.stringify(args.body)
              }
              
              const res = await fetch(url, fetchOptions)
              const contentType = res.headers.get('content-type')
              
              let data
              if (contentType && contentType.includes('application/json')) {
                data = await res.json()
              } else {
                data = await res.text()
              }
              
              apiResponse = {
                status: res.status,
                ok: res.ok,
                data
              }
            } catch (error: any) {
              apiResponse = { error: `Falha ao chamar API: ${error.message}` }
            }
          }

          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: apiResponse
            }
          })
        }

        contents.push({ role: 'user', parts: functionResponses })
        result = await model.generateContent({ contents })
        response = result.response
        functionCalls = response.functionCalls()
      }

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
