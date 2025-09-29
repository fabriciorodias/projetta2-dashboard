// Tipos principais para o Dashboard Projetta2

export interface PropostaProposta {
  sicad: number;
  nomeCliente: string;
  nomeAgencia: string;
  valor: number;
  tarefa: string;
  agenciaCentral: string;
  diasTarefa: number;
  dataProjecao: Date;
  programaCredito: string;
  acompanhamento: string;
  nomeCentral: string;
  dataCriacao: Date;
  statusPrioridade: string;
  nomeSuperEstadual: string;
  codigoSuperEstadual: number;
  dataSolicitacao: Date;
  dataPriorizacao: Date;
  totalDiasAgencia: number;
  totalDiasCentral: number;
  totalDiasComite: number;
  totalDiasGeral: number;
  gerenteResponsavel: string;
  carteiraNegocio: string;
  
  // Campos derivados calculados
  gerenteNome: string;
  categoriaPerformance: 'Rápido' | 'Normal' | 'Lento' | 'Muito Lento';
  categoriaValor: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto';
  diaSemana: number;
  nomeDiaSemana: string;
  mesAno: string;
  ano: number;
  mes: number;
}

export interface BenchmarkMetrics {
  avgValue: number;
  medianValue: number;
  avgDays: number;
  medianDays: number;
  excellentDays: number;
  goodDays: number;
  poorDays: number;
  highValue: number;
  lowValue: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

export interface Insight {
  id: string;
  category: 'performance' | 'portfolio' | 'manager' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export interface FilterState {
  agencia: string;
  carteiraNegocio: string;
  statusPrioridade: string;
  gerenteResponsavel: string;
  dataRange: [Date, Date];
  valorRange: [number, number];
  diasRange: [number, number];
  carteirasMultiplas: string[];
  statusMultiplos: string[];
  buscaTexto: string;
}

export interface UIState {
  sidebarOpen: boolean;
  currentView: 'geral' | 'carteira';
  selectedCarteira: string;
  paginacao: {
    pagina: number;
    porPagina: number;
    total: number;
  };
  refreshInterval: number;
  dashboardMode: 'geral' | 'portfolio';
}

export interface ManagerPerformance {
  gerente: string;
  gerenteNome: string;
  qtdPropostas: number;
  valorTotal: number;
  valorMedio: number;
  prazoMedio: number;
  prazoDesvio: number;
  produtividade: number; // 0-100
  eficienciaPrazo: number; // 0-100
  scoreGeral: number; // 0-100
  categoria: 'Excelente' | 'Bom' | 'Precisa Melhorar';
}

export interface TemporalAnalysis {
  monthly: Array<{
    mes: string;
    qtdPropostas: number;
    valorTotal: number;
    valorMedio: number;
    prazoMedio: number;
  }>;
  seasonal: Array<{
    mes: string;
    qtd: number;
    prazoMedio: number;
  }>;
  dayOfWeek: Array<{
    dia: string;
    qtd: number;
    mediaValor: number;
  }>;
}