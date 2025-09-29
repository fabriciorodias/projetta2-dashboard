import { create } from 'zustand';
import { PropostaProposta, FilterState, UIState, BenchmarkMetrics, Alert, Insight } from '../types';
import { calculateBenchmarks, generateAlerts, generateInsights } from '../utils/calculations';

interface AppState {
  // Dados
  propostas: PropostaProposta[];
  propostasFiltered: PropostaProposta[];
  loading: boolean;
  error: string | null;
  
  // Filtros
  filtros: FilterState;
  
  // UI State
  ui: UIState;
  
  // Benchmarks e métricas
  benchmarks: BenchmarkMetrics;
  alertas: Alert[];
  insights: Insight[];
  
  // Actions
  setPropostas: (propostas: PropostaProposta[]) => void;
  setFiltros: (filtros: Partial<FilterState>) => void;
  setUIState: (ui: Partial<UIState>) => void;
  applyFilters: () => void;
  dismissAlert: (alertId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialFilters: FilterState = {
  agencia: 'Todos',
  carteiraNegocio: 'Todos',
  statusPrioridade: 'Todos',
  gerenteResponsavel: 'Todos',
  dataRange: [new Date(2020, 0, 1), new Date()],
  valorRange: [0, 1000000000],
  diasRange: [0, 365],
  carteirasMultiplas: [],
  statusMultiplos: [],
  buscaTexto: ''
};

const initialUIState: UIState = {
  sidebarOpen: true,
  currentView: 'geral',
  selectedCarteira: '',
  paginacao: {
    pagina: 1,
    porPagina: 20,
    total: 0
  },
  refreshInterval: 0,
  dashboardMode: 'geral'
};

export const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  propostas: [],
  propostasFiltered: [],
  loading: false,
  error: null,
  filtros: initialFilters,
  ui: initialUIState,
  benchmarks: {
    avgValue: 0,
    medianValue: 0,
    avgDays: 0,
    medianDays: 0,
    excellentDays: 0,
    goodDays: 0,
    poorDays: 0,
    highValue: 0,
    lowValue: 0
  },
  alertas: [],
  insights: [],
  
  // Actions
  setPropostas: (propostas) => {
    set({ propostas });
    get().applyFilters();
  },
  
  setFiltros: (novosFiltros) => {
    set({ 
      filtros: { ...get().filtros, ...novosFiltros }
    });
    get().applyFilters();
  },
  
  setUIState: (novoUI) => {
    set({ 
      ui: { ...get().ui, ...novoUI }
    });
  },
  
  applyFilters: () => {
    const { propostas, filtros } = get();
    
    let filtered = propostas.filter(proposta => {
      // Filtros básicos
      if (filtros.agencia !== 'Todos' && proposta.nomeAgencia !== filtros.agencia) 
        return false;
      
      if (filtros.carteiraNegocio !== 'Todos' && 
          proposta.carteiraNegocio !== filtros.carteiraNegocio) 
        return false;
      
      if (filtros.statusPrioridade !== 'Todos' && 
          proposta.statusPrioridade !== filtros.statusPrioridade) 
        return false;
      
      if (filtros.gerenteResponsavel !== 'Todos' && 
          proposta.gerenteResponsavel !== filtros.gerenteResponsavel) 
        return false;
      
      // Filtro de range de valores
      if (proposta.valor < filtros.valorRange[0] || 
          proposta.valor > filtros.valorRange[1]) 
        return false;
      
      // Filtro de range de dias
      if (proposta.totalDiasGeral < filtros.diasRange[0] || 
          proposta.totalDiasGeral > filtros.diasRange[1]) 
        return false;
      
      // Múltipla seleção de carteiras
      if (filtros.carteirasMultiplas.length > 0 && 
          !filtros.carteirasMultiplas.includes(proposta.carteiraNegocio)) 
        return false;
      
      // Múltipla seleção de status
      if (filtros.statusMultiplos.length > 0 && 
          !filtros.statusMultiplos.includes(proposta.statusPrioridade)) 
        return false;
      
      // Busca textual
      if (filtros.buscaTexto && 
          !proposta.nomeCliente.toLowerCase().includes(filtros.buscaTexto.toLowerCase())) 
        return false;
      
      // Filtro de data
      if (proposta.dataCriacao < filtros.dataRange[0] || 
          proposta.dataCriacao > filtros.dataRange[1]) 
        return false;
      
      return true;
    });
    
    // Calcular benchmarks e alertas com dados filtrados
    const benchmarks = calculateBenchmarks(filtered);
    const alertas = generateAlerts(filtered, benchmarks);
    const insights = generateInsights(filtered);
    
    set({ 
      propostasFiltered: filtered,
      benchmarks,
      alertas,
      insights,
      ui: {
        ...get().ui,
        paginacao: {
          ...get().ui.paginacao,
          total: filtered.length,
          pagina: 1 // Reset para primeira página
        }
      }
    });
  },
  
  dismissAlert: (alertId) => {
    set({
      alertas: get().alertas.map(alert =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    });
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error })
}));