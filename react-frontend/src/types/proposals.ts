export interface Proposal {
  sicad: number
  nomeCliente: string
  nomeAgencia: string
  valor: number
  tarefa: string
  agenciaCentral: string
  diasTarefa: number
  dataProjecao: string
  programaCredito: string
  nomeCentral: string
  dataCriacao: string
  statusPrioridade: string
  carteiraNegocio: string
  gerenteResponsavel: string
  totalDiasGeral: number
  totalDiasAgencia: number
  totalDiasCentral: number
  totalDiasComite: number
  mesAno: string
  ano: number
  mes: number
  diaSemana: number
  nomeDiaSemana: string
  gerenteNome: string
  categoriaPerformance: 'Rápido' | 'Normal' | 'Lento' | 'Muito Lento'
  categoriaValor: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto'
}

export interface Filters {
  agencies: string[]
  portfolios: string[]
  statuses: string[]
  managers: string[]
  dateRange: { start: Date | null; end: Date | null }
  valueRange: { min: number | null; max: number | null }
  daysRange: { min: number | null; max: number | null }
  searchTerm: string
}

export interface Metrics {
  totalProposals: number
  totalValue: number
  averageValue: number
  averageDays: number
  uniqueManagers: number
  proposalsByStatus: Record<string, number>
  averageProcessingTimeByAgency: Record<string, number>
}

export interface Benchmarks {
  agency: string
  proposals: number
  avgValue: number
  avgDays: number
  efficiencyScore: number
}

export interface Alert {
  id: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info'
  timestamp: Date
  autoHide?: boolean
}

export interface ManagerPerformance {
  gerente: string
  qtdPropostas: number
  valorMedio: number
  prazoMedio: number
  produtividade: number
  eficienciaPrazo: number
  scoreGeral: number
  categoria: string
}

export interface DashboardState {
  proposals: Proposal[]
  filters: Filters
  metrics: Metrics | null
  benchmarks: Benchmarks[] | null
  isLoading: boolean
  error: string | null
  alerts: Alert[]
  isDarkMode: boolean
  sidebarCollapsed: boolean
}

export interface StoreActions {
  setProposals: (proposals: Proposal[]) => void
  setFilters: (filters: Partial<Filters>) => void
  resetFilters: () => void
  setMetrics: (metrics: Metrics) => void
  setBenchmarks: (benchmarks: Benchmarks[]) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void
  removeAlert: (alertIndex: number) => void
  clearAlerts: () => void
  toggleDarkMode: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}