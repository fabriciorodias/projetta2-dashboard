// Types for proposals and dashboard data

export interface Proposal {
  sicad: number;
  nomeCliente: string;
  nomeAgencia: string;
  valor: number;
  tarefa: string;
  agenciaCentral?: string;
  diasTarefa?: number;
  dataProjecao?: Date;
  programaCredito?: string;
  acompanhamento?: string;
  nomeCentral?: string;
  dataCriacao?: Date;
  totalDiasAgencia?: number;
  totalDiasCentral?: number;
  totalDiasComite?: number;
  totalDiasGeral?: number;
  statusPrioridade?: string;
  nomeSuperEstadual?: string;
  carteiraNegocio?: string;
  gerenteResponsavel?: string;
  categoriaPerformance?: 'Rápido' | 'Normal' | 'Lento' | 'Muito Lento';
  categoriaValor?: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto';
  mesAno?: string;
  ano?: number;
  mes?: number;
  diaSemana?: number;
  nomeDiaSemana?: string;
  gerenteNome?: string;
}

export interface Filters {
  agencies: string[];
  portfolios: string[];
  statuses: string[];
  managers: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  valueRange: {
    min: number | null;
    max: number | null;
  };
  daysRange: {
    min: number | null;
    max: number | null;
  };
  searchTerm: string;
}

export interface KPIMetrics {
  totalProposals: number;
  totalValue: number;
  averageValue: number;
  medianValue: number;
  averageDays: number;
  medianDays: number;
  uniqueClients: number;
  uniqueAgencies: number;
  uniqueManagers: number;
  portfolioDistribution: PortfolioDistribution[];
  agencyDistribution: AgencyDistribution[];
  managerPerformance: ManagerPerformance[];
  timelineData: TimelineData[];
  performanceDistribution: PerformanceDistribution;
}

export interface PortfolioDistribution {
  carteira: string;
  qtd: number;
  valor_total: number;
  valor_medio: number;
  prazo_medio: number;
  porcentagem: number;
}

export interface AgencyDistribution {
  agencia: string;
  qtd: number;
  valor_total: number;
  valor_medio: number;
  prazo_medio: number;
  porcentagem: number;
}

export interface ManagerPerformance {
  gerente: string;
  gerente_nome: string;
  qtd_propostas: number;
  valor_total: number;
  valor_medio: number;
  prazo_medio: number;
  prazo_desvio: number;
  prazo_agencia: number;
  prazo_central: number;
  produtividade: number;
  eficiencia_prazo: number;
  score_geral: number;
  categoria: 'Precisa Melhorar' | 'Bom' | 'Excelente';
}

export interface TimelineData {
  date: Date;
  count: number;
  value_sum: number;
  value_avg: number;
  days_avg: number;
}

export interface PerformanceDistribution {
  rapido: number;
  normal: number;
  lento: number;
  muito_lento: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  category?: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeCharts: boolean;
  includeFilters: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface Benchmark {
  avg_value: number;
  median_value: number;
  avg_days: number;
  median_days: number;
  excellent_days: number;
  good_days: number;
  poor_days: number;
  high_value: number;
  low_value: number;
}

export interface Alert {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
}

export interface DashboardState {
  proposals: Proposal[];
  filters: Filters;
  metrics: KPIMetrics | null;
  benchmarks: Benchmark | null;
  isLoading: boolean;
  error: string | null;
  alerts: Alert[];
  isDarkMode: boolean;
  sidebarCollapsed: boolean;
}
