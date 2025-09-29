import type { Proposal, KPIMetrics, Benchmark, Filters } from '@/types/proposals'

// Mock data - in production this would come from CSV processing
const mockProposals: Proposal[] = [
  {
    sicad: 1,
    nomeCliente: 'João Silva',
    nomeAgencia: 'Agência Central',
    valor: 50000,
    tarefa: 'Aprovação',
    carteiraNegocio: 'Pessoa Física',
    gerenteResponsavel: 'Maria Santos - PF001',
    statusPrioridade: 'APROVADA',
    dataCriacao: new Date('2024-01-15'),
    totalDiasGeral: 15,
    categoriaPerformance: 'Rápido',
    categoriaValor: 'Médio',
  },
  {
    sicad: 2,
    nomeCliente: 'Empresa ABC Ltda',
    nomeAgencia: 'Agência Norte',
    valor: 150000,
    tarefa: 'Análise',
    carteiraNegocio: 'Pessoa Jurídica',
    gerenteResponsavel: 'Carlos Oliveira - PJ002',
    statusPrioridade: 'EM_ANALISE',
    dataCriacao: new Date('2024-01-20'),
    totalDiasGeral: 25,
    categoriaPerformance: 'Normal',
    categoriaValor: 'Alto',
  },
  {
    sicad: 3,
    nomeCliente: 'Ana Costa',
    nomeAgencia: 'Agência Sul',
    valor: 25000,
    tarefa: 'Documentação',
    carteiraNegocio: 'Consignado',
    gerenteResponsavel: 'Pedro Almeida - CON003',
    statusPrioridade: 'PENDENTE_DOCUMENTOS',
    dataCriacao: new Date('2024-01-25'),
    totalDiasGeral: 35,
    categoriaPerformance: 'Lento',
    categoriaValor: 'Baixo',
  },
]

// Function to simulate data loading with optional filters
export async function fetchProposals(filters?: Partial<Filters>): Promise<Proposal[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))

  let filteredProposals = [...mockProposals]

  if (filters) {
    // Apply basic filters
    if (filters.agencies && filters.agencies.length > 0) {
      filteredProposals = filteredProposals.filter(proposal => 
        filters.agencies!.includes(proposal.nomeAgencia)
      )
    }

    if (filters.portfolios && filters.portfolios.length > 0) {
      filteredProposals = filteredProposals.filter(proposal => 
        filters.portfolios!.includes(proposal.carteiraNegocio || '')
      )
    }

    if (filters.statuses && filters.statuses.length > 0) {
      filteredProposals = filteredProposals.filter(proposal => 
        filters.statuses!.includes(proposal.statusPrioridade || '')
      )
    }

    if (filters.managers && filters.managers.length > 0) {
      filteredProposals = filteredProposals.filter(proposal => 
        filters.managers!.includes(proposal.gerenteResponsavel || '')
      )
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      filteredProposals = filteredProposals.filter(proposal => 
        proposal.nomeCliente.toLowerCase().includes(searchTerm) ||
        proposal.nomeAgencia.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.valueRange) {
      filteredProposals = filteredProposals.filter(proposal => {
        if (filters.valueRange!.min !== null && proposal.valor < filters.valueRange!.min) return false
        if (filters.valueRange!.max !== null && proposal.valor > filters.valueRange!.max) return false
        return true
      })
    }

    if (filters.daysRange) {
      filteredProposals = filteredProposals.filter(proposal => {
        if (!proposal.totalDiasGeral) return false
        if (filters.daysRange!.min !== null && proposal.totalDiasGeral < filters.daysRange!.min) return false
        if (filters.daysRange!.max !== null && proposal.totalDiasGeral > filters.daysRange!.max) return false
        return true
      })
    }
  }

  return filteredProposals
}

export async function fetchAnalytics(filters?: Partial<Filters>): Promise<{ metrics: KPIMetrics; benchmarks: Benchmark }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const proposals = await fetchProposals(filters)
  
  if (proposals.length === 0) {
    return {
      metrics: {
        totalProposals: 0,
        totalValue: 0,
        averageValue: 0,
        medianValue: 0,
        averageDays: 0,
        medianDays: 0,
        uniqueClients: 0,
        uniqueAgencies: 0,
        uniqueManagers: 0,
        portfolioDistribution: [],
        agencyDistribution: [],
        managerPerformance: [],
        timelineData: [],
        performanceDistribution: {
          rapido: 0,
          normal: 0,
          lento: 0,
          muito_lento: 0,
        },
      },
      benchmarks: {
        avg_value: 0,
        median_value: 0,
        avg_days: 0,
        median_days: 0,
        excellent_days: 0,
        good_days: 0,
        poor_days: 0,
        high_value: 0,
        low_value: 0,
      },
    }
  }

  // Calculate metrics
  const totalProposals = proposals.length
  const totalValue = proposals.reduce((sum, p) => sum + p.valor, 0)
  const averageValue = totalValue / totalProposals
  const sortedValues = proposals.map(p => p.valor).sort((a, b) => a - b)
  const medianValue = sortedValues[Math.floor(sortedValues.length / 2)]

  const daysWithValues = proposals.filter(p => p.totalDiasGeral !== undefined).map(p => p.totalDiasGeral!)
  const averageDays = daysWithValues.reduce((sum, days) => sum + days, 0) / daysWithValues.length
  const sortedDays = daysWithValues.sort((a, b) => a - b)
  const medianDays = sortedDays[Math.floor(sortedDays.length / 2)]

  const uniqueClients = new Set(proposals.map(p => p.nomeCliente)).size
  const uniqueAgencies = new Set(proposals.map(p => p.nomeAgencia)).size
  const uniqueManagers = new Set(proposals.map(p => p.gerenteResponsavel)).size

  // Portfolio distribution
  const portfolioMap = new Map()
  proposals.forEach(proposal => {
    const portfolio = proposal.carteiraNegocio || 'Não Informado'
    if (!portfolioMap.has(portfolio)) {
      portfolioMap.set(portfolio, {
        carteira: portfolio,
        qtd: 0,
        valor_total: 0,
        valor_medio: 0,
        prazo_medio: 0,
      })
    }
    const data = portfolioMap.get(portfolio)
    data.qtd += 1
    data.valor_total += proposal.valor
    data.prazo_medio += proposal.totalDiasGeral || 0
  })

  const portfolioDistribution = Array.from(portfolioMap.values()).map(item => ({
    ...item,
    valor_medio: item.valor_total / item.qtd,
    prazo_medio: item.prazo_medio / item.qtd,
    porcentagem: (item.qtd / totalProposals * 100),
  }))

  // Agency distribution
  const agencyMap = new Map()
  proposals.forEach(proposal => {
    const agency = proposal.nomeAgencia
    if (!agencyMap.has(agency)) {
      agencyMap.set(agency, {
        agencia: agency,
        qtd: 0,
        valor_total: 0,
        valor_medio: 0,
        prazo_medio: 0,
      })
    }
    const data = agencyMap.get(agency)
    data.qtd += 1
    data.valor_total += proposal.valor
    data.prazo_medio += proposal.totalDiasGeral || 0
  })

  const agencyDistribution = Array.from(agencyMap.values()).map(item => ({
    ...item,
    valor_medio: item.valor_total / item.qtd,
    prazo_medio: item.prazo_medio / item.qtd,
    porcentagem: (item.qtd / totalProposals * 100),
  }))

  // Manager performance
  const managerMap = new Map()
  proposals.forEach(proposal => {
    const manager = proposal.gerenteResponsavel || 'Não Informado'
    const managerName = manager.split(' - ')[0]
    
    if (!managerMap.has(manager)) {
      managerMap.set(manager, {
        gerente: manager,
        gerente_nome: managerName,
        qtd_propostas: 0,
        valor_total: 0,
        valor_medio: 0,
        prazo_medio: 0,
        prazo_desvio: 0,
        produtividade: 0,
        eficiencia_prazo: 0,
        score_geral: 0,
      })
    }
    const data = managerMap.get(manager)
    data.qtd_propostas += 1
    data.valor_total += proposal.valor
    data.prazo_medio += proposal.totalDiasGeral || 0
  })

  const managerPerformance = Array.from(managerMap.values()).map(item => {
    item.valor_medio = item.valor_total / item.qtd_propostas
    item.prazo_medio = item.prazo_medio / item.qtd_propostas
    
    const maxProposals = Math.max(...Array.from(managerMap.values()).map(m => m.qtd_propostas))
    const maxDays = Math.max(...Array.from(managerMap.values()).map(m => m.prazo_medio))
    
    item.produtividade = (item.qtd_propostas / maxProposals) * 100
    item.eficiencia_prazo = ((maxDays - item.prazo_medio) / maxDays) * 100
    item.score_geral = (item.produtividade * 0.6) + (item.eficiencia_prazo * 0.4)
    
    if (item.score_geral >= 70) {
    (item as any).categoria = 'Excelente'
    } else if (item.score_geral >= 40) {
    (item as any).categoria = 'Bom'
    } else {
    (item as any).categoria = 'Precisa Melhorar'
    }
    
    return item
  })

  // Performance distribution
  const performanceDistribution = {
    rapido: proposals.filter(p => p.categoriaPerformance === 'Rápido').length,
    normal: proposals.filter(p => p.categoriaPerformance === 'Normal').length,
    lento: proposals.filter(p => p.categoriaPerformance === 'Lento').length,
    muito_lento: proposals.filter(p => p.categoriaPerformance === 'Muito Lento').length,
  }

  const metrics: KPIMetrics = {
    totalProposals,
    totalValue,
    averageValue,
    medianValue,
    averageDays,
    medianDays,
    uniqueClients,
    uniqueAgencies,
    uniqueManagers,
    portfolioDistribution,
    agencyDistribution,
    managerPerformance,
    timelineData: [], // Timeline would be calculated based on date range
    performanceDistribution,
  }

  // Calculate benchmarks
  const benchmarks: Benchmark = {
    avg_value: averageValue,
    median_value: medianValue,
    avg_days: averageDays,
    median_days: medianDays,
    excellent_days: averageDays * 0.7,
    good_days: averageDays * 0.9,
    poor_days: averageDays * 1.2,
    high_value: medianValue * 2,
    low_value: medianValue * 0.5,
  }

  return { metrics, benchmarks }
}

export async function exportData(format: 'csv' | 'excel' | 'pdf', filters?: Partial<Filters>): Promise<Blob> {
  // Simulate export processing
  await new Promise(resolve => setTimeout(resolve, 1000))

  const proposals = await fetchProposals(filters)

  switch (format) {
    case 'csv':
      const csvContent = `
sicad,nomeCliente,nomeAgencia,valor,carteiraNegocio,gerenteResponsavel,statusPrioridade,dataCriacao,totalDiasGeral
${proposals.map(p => `${p.sicad},"${p.nomeCliente}","${p.nomeAgencia}",${p.valor},"${p.carteiraNegocio}","${p.gerenteResponsavel}","${p.statusPrioridade}",${p.dataCriacao?.toISOString()},${p.totalDiasGeral}`).join('\n')}
      `
      return new Blob([csvContent], { type: 'text/csv' })

    case 'excel':
    case 'pdf':
      // These would generate actual Excel/PDF files
      return new Blob(['Mock export data'], { type: 'application/octet-stream' })

    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}
