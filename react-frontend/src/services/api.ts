import { Proposal, Metrics, Benchmarks, ManagerPerformance } from '@/types/proposals'

// Mock data generator
const generateMockProposals = (count: number): Proposal[] => {
  const clients = ['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D', 'Cliente E']
  const agencies = ['Agencia SP', 'Agencia RJ', 'Agencia BH', 'Agencia Recife']
  const programs = ['Credito Pessoal', 'Financiamento Auto', 'Credito Imobiliario']
  const statuses = ['Aprovado', 'Em Analise', 'Pendente', 'Rejeitado']
  const portfolios = ['Carteira Premium', 'Carteira Standard', 'Carteira Básica']
  const managers = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Oliveira']

  return Array.from({ length: count }, (_, i) => ({
    sicad: 100000 + i,
    nomeCliente: clients[Math.floor(Math.random() * clients.length)] + ` ${i + 1}`,
    nomeAgencia: agencies[Math.floor(Math.random() * agencies.length)],
    valor: Math.floor(Math.random() * 500000) + 10000,
    tarefa: `${Math.floor(Math.random() * 20)} dias`,
    agenciaCentral: agencies[Math.floor(Math.random() * agencies.length)],
    diasTarefa: Math.floor(Math.random() * 30) + 5,
    dataProjecao: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    programaCredito: programs[Math.floor(Math.random() * programs.length)],
    nomeCentral: 'Central SP',
    dataCriacao: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    statusPrioridade: statuses[Math.floor(Math.random() * statuses.length)],
    carteiraNegocio: portfolios[Math.floor(Math.random() * portfolios.length)],
    gerenteResponsavel: managers[Math.floor(Math.random() * managers.length)],
    totalDiasGeral: Math.floor(Math.random() * 180) + 30,
    totalDiasAgencia: Math.floor(Math.random() * 60) + 10,
    totalDiasCentral: Math.floor(Math.random() * 90) + 15,
    totalDiasComite: Math.floor(Math.random() * 45) + 5,
    mesAno: '2024-' + String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'),
    ano: 2024,
    mes: Math.floor(Math.random() * 12) + 1,
    diaSemana: Math.floor(Math.random() * 7) + 1,
    nomeDiaSemana: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][Math.floor(Math.random() * 7)],
    gerenteNome: managers[Math.floor(Math.random() * managers.length)],
    categoriaPerformance: ['Rápido', 'Normal', 'Lento', 'Muito Lento'][Math.floor(Math.random() * 4)] as Proposal['categoriaPerformance'],
    categoriaValor: ['Baixo', 'Médio', 'Alto', 'Muito Alto'][Math.floor(Math.random() * 4)] as Proposal['categoriaValor']
  }))
}

const MOCK_PROPOSALS = generateMockProposals(150)

// API Service
export class ApiService {
  private static delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  static async fetchProposals(): Promise<Proposal[]> {
    await this.delay(1000) // Simulate network delay
    
    try {
      return MOCK_PROPOSALS
    } catch (error) {
      throw new Error('Erro ao carregar propostas')
    }
  }

  static async fetchMetrics(): Promise<Metrics> {
    await this.delay(800)
    
    const totalProposals = MOCK_PROPOSALS.length
    const totalValue = MOCK_PROPOSALS.reduce((sum, p) => sum + p.valor, 0)
    const averageValue = totalValue / totalProposals
    const averageDays = MOCK_PROPOSALS.reduce((sum, p) => sum + p.diasTarefa, 0) / totalProposals
    
    // Status breakdown
    const proposalsByStatus = MOCK_PROPOSALS.reduce((acc, p) => {
      acc[p.statusPrioridade] = (acc[p.statusPrioridade] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Agency performance
    const agencyStats = MOCK_PROPOSALS.reduce((acc, p) => {
      if (!acc[p.nomeAgencia]) {
        acc[p.nomeAgencia] = { total: 0, days: 0 }
      }
      acc[p.nomeAgencia].total += p.valor
      acc[p.nomeAgencia].days += p.diasTarefa
      return acc
    }, {} as Record<string, { total: number; days: number }>)

    const averageProcessingTimeByAgency = Object.entries(agencyStats).reduce((acc, [agency, stats]) => {
      const proposalCount = MOCK_PROPOSALS.filter(p => p.nomeAgencia === agency).length
      acc[agency] = stats.days / proposalCount
      return acc
    }, {} as Record<string, number>)

    const uniqueManagers = new Set(MOCK_PROPOSALS.map(p => p.gerenteResponsavel)).size

    return {
      totalProposals,
      totalValue,
      averageValue,
      averageDays: Math.round(averageDays),
      uniqueManagers,
      proposalsByStatus,
      averageProcessingTimeByAgency
    }
  }

  static async fetchBenchmarks(): Promise<Benchmarks[]> {
    await this.delay(600)
    
    const agencies = [...new Set(MOCK_PROPOSALS.map(p => p.nomeAgencia))]
    
    return agencies.map(agency => {
      const agencyProposals = MOCK_PROPOSALS.filter(p => p.nomeAgencia === agency)
      const proposals = agencyProposals.length
      const avgValue = agencyProposals.reduce((sum, p) => sum + p.valor, 0) / proposals
      const avgDays = agencyProposals.reduce((sum, p) => sum + p.diasTarefa, 0) / proposals
      
      // Simple efficiency score calculation
      const efficiencyScore = Math.max(0, Math.min(100, 100 - (avgDays - 15) * 2))
      
      return {
        agency,
        proposals,
        avgValue: Math.round(avgValue),
        avgDays: Math.round(avgDays),
        efficiencyScore: Math.round(efficiencyScore)
      }
    }).sort((a, b) => b.efficiencyScore - a.efficiencyScore)
  }

  static async fetchManagerPerformance(): Promise<ManagerPerformance[]> {
    await this.delay(700)
    
    const managers = [...new Set(MOCK_PROPOSALS.map(p => p.gerenteResponsavel))]
    
    const managerPerformance = managers.map(gerente => {
      const proposals = MOCK_PROPOSALS.filter(p => p.gerenteResponsavel === gerente)
      const qtdPropostas = proposals.length
      const valorMedio = proposals.reduce((sum, p) => sum + p.valor, 0) / qtdPropostas
      const prazoMedio = proposals.reduce((sum, p) => sum + p.diasTarefa, 0) / qtdPropostas
      
      return {
        gerente,
        qtdPropostas,
        valorMedio: Math.round(valorMedio),
        prazoMedio: Math.round(prazoMedio),
        produtividade: 0, // Will be calculated below
        eficienciaPrazo: 0, // Will be calculated below
        scoreGeral: 0, // Will be calculated below
        categoria: '' // Will be calculated below
      }
    })

    // Calculate relative performance metrics
    const maxProposals = Math.max(...managerPerformance.map(m => m.qtdPropostas))
    const maxDays = Math.max(...managerPerformance.map(m => m.prazoMedio))

    return managerPerformance.map(item => {
      item.produtividade = (item.qtdPropostas / maxProposals) * 100
      item.eficienciaPrazo = ((maxDays - item.prazoMedio) / maxDays) * 100
      item.scoreGeral = (item.produtividade * 0.6) + (item.eficienciaPrazo * 0.4)

      if (item.scoreGeral >= 70) {
        item.categoria = 'Excelente'
      } else if (item.scoreGeral >= 40) {
        item.categoria = 'Bom'
      } else {
        item.categoria = 'Precisa Melhorar'
      }

      return item
    }).sort((a, b) => b.scoreGeral - a.scoreGeral)
  }

  static async exportData(format: 'csv' | 'excel' | 'pdf', proposals: Proposal[]): Promise<void> {
    await this.delay(1000)
    
    // Simulate file download
    const csvContent = proposals.map(p => 
      `${p.sicad},${p.nomeCliente},${p.valor},${p.statusPrioridade}`
    ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `propostas-${format}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  static async filterProposals(filters: any): Promise<Proposal[]> {
    await this.delay(300)
    
    return MOCK_PROPOSALS.filter(proposal => {
      // Agency filter
      if (filters.agencies && filters.agencies.length > 0 && !filters.agencies.includes('Todos')) {
        if (!filters.agencies.includes(proposal.nomeAgencia)) return false
      }
      
      // Portfolio filter
      if (filters.portfolios && filters.portfolios.length > 0 && !filters.portfolios.includes('Todos')) {
        if (!filters.portfolios.includes(proposal.carteiraNegocio)) return false
      }
      
      // Status filter
      if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes('Todos')) {
        if (!filters.statuses.includes(proposal.statusPrioridade)) return false
      }
      
      // Manager filter
      if (filters.managers && filters.managers.length > 0 && !filters.managers.includes('Todos')) {
        if (!filters.managers.includes(proposal.gerenteResponsavel)) return false
      }
      
      // Value range filter
      if (filters.valueRange?.min !== null && proposal.valor < filters.valueRange.min) return false
      if (filters.valueRange?.max !== null && proposal.valor > filters.valueRange.max) return false
      
      // Days range filter
      if (filters.daysRange?.min !== null && proposal.diasTarefa < filters.daysRange.min) return false
      if (filters.daysRange?.max !== null && proposal.diasTarefa > filters.daysRange.max) return false
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        if (!proposal.nomeCliente.toLowerCase().includes(searchLower) &&
            !proposal.nomeAgencia.toLowerCase().includes(searchLower) &&
            !proposal.sicad.toString().includes(searchLower)) {
          return false
        }
      }
      
      return true
    })
  }
}

export default ApiService