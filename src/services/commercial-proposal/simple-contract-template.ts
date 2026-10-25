/**
 * Modelo de contrato SIMPLIFICADO.
 *
 * Texto curto e genérico, válido para qualquer máquina, equipamento ou veículo.
 * É gravado em `contract.body_html`, portanto pode ser editado no mesmo editor
 * do contrato completo.
 */

interface PartyData {
  company_name?: string | null
  trading_name?: string | null
  cnpj?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
}

interface SimpleContractItem {
  description?: string | null
  unit?: string | null
  quantity?: unknown
  monthly_value?: unknown
  assetCategory?: { name?: string | null } | null
}

export interface SimpleContractTemplateData {
  contract_number: string
  start_date: Date
  locador?: PartyData | null
  locatario?: PartyData | null
  items?: SimpleContractItem[]
  payment_conditions?: string | null
  rental_period?: string | null
  observations?: string | null
}

const BORDER = 'border: 1px solid #e2e8f0; padding: 10px;'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: Date): string {
  // Usa UTC para não "voltar um dia" por causa do fuso horário
  const d = String(date.getUTCDate()).padStart(2, '0')
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${d}/${m}/${date.getUTCFullYear()}`
}

function describeParty(party: PartyData | null | undefined, fallback: string): string {
  if (!party?.company_name) return `<strong>${fallback}</strong>`

  const parts = [`<strong>${escapeHtml(party.company_name.toUpperCase())}</strong>`]
  if (party.cnpj) parts.push(`inscrita no CNPJ/CPF sob o nº ${escapeHtml(party.cnpj)}`)

  const location = [party.address, party.city && party.state ? `${party.city}/${party.state}` : party.city]
    .filter(Boolean)
    .join(', ')
  if (location) parts.push(`com sede/endereço em ${escapeHtml(location)}`)

  return parts.join(', ')
}

function buildItemsTable(items: SimpleContractItem[]): string {
  if (!items.length) return ''

  let total = 0
  const rows = items
    .map((item) => {
      const qty = Number(item.quantity) || 0
      const value = Number(item.monthly_value) || 0
      total += qty * value
      const name = item.description || item.assetCategory?.name || 'Equipamento/Veículo'

      return `<tr>
        <td style="${BORDER}">${escapeHtml(name)}</td>
        <td style="${BORDER} text-align: center;">${qty}</td>
        <td style="${BORDER} text-align: center;">${escapeHtml(item.unit || 'UN')}</td>
        <td style="${BORDER} text-align: right;">${formatCurrency(value)}</td>
        <td style="${BORDER} text-align: right;">${formatCurrency(qty * value)}</td>
      </tr>`
    })
    .join('')

  return `<table style="width:100%; border-collapse: collapse; border: 1px solid #e2e8f0; font-size: 13px; margin: 10px 0;">
    <thead style="background-color: #f1f5f9">
      <tr>
        <th style="${BORDER} text-align: left;">Descrição</th>
        <th style="${BORDER} text-align: center;">Qtd</th>
        <th style="${BORDER} text-align: center;">Unid</th>
        <th style="${BORDER} text-align: right;">Vlr Unit.</th>
        <th style="${BORDER} text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr style="background-color: #e2e8f0;">
        <td colspan="4" style="${BORDER} text-align: right;"><strong>VALOR TOTAL</strong></td>
        <td style="${BORDER} text-align: right;"><strong>${formatCurrency(total)}</strong></td>
      </tr>
    </tbody>
  </table>`
}

function section(title: string, content: string): string {
  return `<h3 style="color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 5px; margin-top: 25px;">${title}</h3>${content}`
}

export function buildSimpleContractHtml(data: SimpleContractTemplateData): string {
  const items = data.items ?? []
  const itemsTable = buildItemsTable(items)

  const period = data.rental_period
    ? `O prazo de vigência estimado é de <strong>${escapeHtml(data.rental_period)}</strong>, contado a partir de <strong>${formatDate(data.start_date)}</strong>, podendo ser prorrogado ou encerrado por acordo entre as partes.`
    : `O contrato tem início em <strong>${formatDate(data.start_date)}</strong>, por prazo indeterminado, podendo ser encerrado por qualquer das partes mediante aviso prévio por escrito.`

  const payment = data.payment_conditions
    ? `O pagamento será realizado em <strong>${escapeHtml(data.payment_conditions)}</strong> após o recebimento da Nota Fiscal/Fatura, com base na medição mensal do período.`
    : `O faturamento será mensal, com base na medição do período, e o pagamento será realizado conforme combinado entre as partes.`

  const observations = data.observations
    ? section(
        '8. OBSERVAÇÕES',
        `<p style="font-size: 13px;">${escapeHtml(data.observations).replace(/\n/g, '<br/>')}</p>`,
      )
    : ''

  const p = (text: string) => `<p style="font-size: 13px; text-align: justify;">${text}</p>`

  return [
    `<h2 style="text-align: center; color: #1a365d;">CONTRATO DE LOCAÇÃO Nº ${escapeHtml(data.contract_number)}</h2>`,

    section(
      '1. DAS PARTES',
      p(`<strong>LOCADORA:</strong> ${describeParty(data.locador, '[NOME DA LOCADORA]')}.`) +
        p(`<strong>LOCATÁRIA:</strong> ${describeParty(data.locatario, '[NOME DA LOCATÁRIA]')}.`),
    ),

    section(
      '2. DO OBJETO',
      p(
        'O presente contrato tem por objeto a locação do(s) equipamento(s), máquina(s) e/ou veículo(s) abaixo relacionado(s), em perfeitas condições de uso, de propriedade ou sob responsabilidade da LOCADORA:',
      ) +
        (itemsTable ||
          p('[DESCREVER O(S) BEM(NS) LOCADO(S): tipo, marca, modelo, placa/nº de série]')),
    ),

    section('3. DO PRAZO', p(period)),

    section(
      '4. DO VALOR E DO PAGAMENTO',
      p(
        'Pela locação, a LOCATÁRIA pagará à LOCADORA os valores indicados na tabela do item 2, conforme a unidade de cobrança (hora, dia, mês, serviço ou outra) ali especificada.',
      ) + p(payment),
    ),

    section(
      '5. DAS OBRIGAÇÕES DA LOCADORA',
      '<ul style="font-size: 13px;">' +
        '<li>Entregar o bem locado em boas condições de uso e funcionamento.</li>' +
        '<li>Realizar as manutenções preventivas e corretivas decorrentes do desgaste normal de uso, salvo disposição em contrário.</li>' +
        '<li>Manter a documentação do bem em dia.</li>' +
        '</ul>',
    ),

    section(
      '6. DAS OBRIGAÇÕES DA LOCATÁRIA',
      '<ul style="font-size: 13px;">' +
        '<li>Utilizar o bem locado exclusivamente para a finalidade acordada, por pessoa habilitada e de forma adequada.</li>' +
        '<li>Zelar pela guarda e conservação do bem, não podendo sublocá-lo ou cedê-lo a terceiros sem autorização por escrito.</li>' +
        '<li>Responder por danos causados por mau uso, acidentes, furto ou roubo durante o período de locação, bem como por multas e infrações.</li>' +
        '<li>Efetuar os pagamentos nos prazos combinados.</li>' +
        '<li>Devolver o bem nas mesmas condições em que o recebeu, ressalvado o desgaste natural.</li>' +
        '</ul>',
    ),

    section(
      '7. DA RESCISÃO E DO FORO',
      p(
        'O descumprimento de qualquer cláusula deste contrato, ou o encerramento da locação por qualquer das partes mediante aviso prévio por escrito, autoriza a rescisão, devendo ser quitados os valores devidos até a data da efetiva devolução do bem.',
      ) +
        p(
          'As partes elegem o foro da comarca da sede da LOCADORA para dirimir quaisquer dúvidas oriundas deste contrato.',
        ),
    ),

    observations,

    `<p style="font-size: 13px; margin-top: 30px;">E, por estarem de acordo, as partes assinam o presente contrato em 2 (duas) vias de igual teor.</p>`,
    `<p style="font-size: 13px;">Local e data: ____________________, ____ de ______________ de ________.</p>`,
    `<table style="width: 100%; margin-top: 50px; font-size: 13px; text-align: center;"><tr>
      <td style="width: 50%;">______________________________<br/><strong>LOCADORA</strong></td>
      <td style="width: 50%;">______________________________<br/><strong>LOCATÁRIA</strong></td>
    </tr></table>`,
  ].join('')
}
