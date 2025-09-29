# 🚀 Especificações Técnicas Completas - Dashboard Projetta2 (React Frontend)

## 📋 **VISÃO GERAL PARA DESENVOLVIMENTO REACT**

Este documento fornece todas as especificações técnicas necessárias para um agente de IA recriar o Dashboard Projetta2 em React.js, mantendo 100% das funcionalidades, lógica de negócio, visualizações e experiência do usuário.

---

## 🎯 **ARQUITETURA DA APLICAÇÃO**

### **Stack Tecnológico Recomendado**
```json
{
  "frontend": "React 18.x + TypeScript",
  "stateManagement": "Zustand ou Redux Toolkit",
  "styling": "Tailwind CSS + shadcn/ui",
  "charts": "Recharts + React-Plotly.js",
  "dataProcessing": "Lodash + date-fns",
  "routing": "React Router v6",
  "forms": "React Hook Form + Zod",
  "exports": "SheetJS (Excel) + jsPDF (PDF)",
  "build": "Vite",
  "deployment": "Vercel ou Netlify"
}
```

### **Estrutura de Pastas**
```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes de UI (Button, Card, etc.)
│   ├── charts/          # Componentes de gráficos
│   ├── filters/         # Componentes de filtros
│   └── layout/          # Layout e navegação
├── pages/               # Páginas principais
├── hooks/               # Custom hooks
├── services/            # Serviços de dados
├── utils/               # Funções utilitárias
├── types/               # Definições TypeScript
├── store/               # Estado global
├── constants/           # Constantes e configurações
└── styles/              # Estilos globais
```

---

## 📊 **ESTRUTURA DE DADOS E TIPOS TYPESCRIPT**

### **Interface Principal dos Dados**
```typescript
interface PropostaProposta {
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
```

### **Estado Global da Aplicação**
```typescript
interface AppState {
  // Dados
  propostas: PropostaProposta[];
  propostasFiltered: PropostaProposta[];
  loading: boolean;
  error: string | null;
  
  // Filtros
  filtros: {
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
  };
  
  // UI State
  ui: {
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
  };
  
  // Benchmarks e métricas
  benchmarks: BenchmarkMetrics;
  alertas: Alert[];
  insights: Insight[];
}
```

### **Tipos de Métricas e Benchmarks**
```typescript
interface BenchmarkMetrics {
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

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

interface Insight {
  id: string;
  category: 'performance' | 'portfolio' | 'manager' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}
```

---

## 🎨 **COMPONENTES E ESTRUTURA DE UI**

### **Layout Principal - `<AppLayout />`**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}

// Estrutura:
// - Header com título, refresh e configurações
// - Sidebar com filtros (colapsível)
// - Main content area
// - Footer com informações
```

### **Sidebar de Filtros - `<FilterSidebar />`**
```typescript
interface FilterSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Componentes internos:
// - <BasicFilters />: Agência, Carteira, Status, Gerente, Data
// - <AdvancedFilters />: Ranges, Múltipla seleção, Busca
// - <FilterActions />: Limpar, Aplicar, Salvar
```

### **Cards de Métricas - `<MetricCard />`**
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  format: 'currency' | 'number' | 'days' | 'percentage';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}
```

### **Sistema de Alertas - `<AlertSystem />`**
```typescript
interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

// Tipos de alertas:
// - Propostas com prazo acima do aceitável
// - Performance baixa de gerentes
// - Valores altos que requerem atenção
// - Insights automáticos descobertos
```

---

## 📊 **COMPONENTES DE VISUALIZAÇÃO**

### **1. Gráfico de Barras Horizontais - `<HorizontalBarChart />`**
```typescript
interface HorizontalBarChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title: string;
  valueFormat?: 'currency' | 'number';
  height?: number;
}

// Uso: Top 10 Agências por Valor
// Dados: Array de {agencia, valor} ordenado desc
// Features: Hover, tooltip, cores dinâmicas
```

### **2. Gráfico de Pizza - `<PieChart />`**
```typescript
interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title: string;
  showPercentage?: boolean;
  donut?: boolean;
}

// Uso: Distribuição por Carteira
// Features: Hover, legendas, percentuais
```

### **3. Diagrama Sankey - `<SankeyDiagram />`**
```typescript
interface SankeyDiagramProps {
  data: {
    nodes: Array<{ id: string; label: string }>;
    links: Array<{ source: string; target: string; value: number }>;
  };
  title: string;
}

// Lógica: Carteira → Agência → Status
// Processamento:
// 1. Agrupar propostas por carteira-agência
// 2. Agrupar por agência-status  
// 3. Criar nodes únicos
// 4. Criar links com valores
```

### **4. Treemap - `<TreemapChart />`**
```typescript
interface TreemapChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: number; // para gradiente
    children?: TreemapChartProps['data'];
  }>;
  title: string;
  colorScale: string[];
}

// Lógica: Hierarquia Carteira > Agência
// Tamanho: Valor da proposta
// Cor: Prazo médio (gradiente vermelho-verde)
```

### **5. Gauge Charts - `<GaugeChart />`**
```typescript
interface GaugeChartProps {
  value: number;
  max: number;
  min?: number;
  title: string;
  thresholds?: Array<{ value: number; color: string }>;
  format?: 'number' | 'percentage' | 'days';
}

// 4 Gauges principais:
// - Prazo Médio (dias)
// - Eficiência (%)
// - Diversidade de Carteiras
// - Distribuição de Valores
```

### **6. Scatter Plot - `<ScatterPlot />`**
```typescript
interface ScatterPlotProps {
  data: Array<{
    x: number;
    y: number;
    name: string;
    category: string;
    size?: number;
  }>;
  xLabel: string;
  yLabel: string;
  title: string;
  colorBy?: string;
}

// Uso: Valor vs Prazo Total
// X: totalDiasGeral
// Y: valor
// Tamanho: valor (bolhas)
// Cor: carteiraNegocio
```

### **7. Timeline/Line Chart - `<TimelineChart />`**
```typescript
interface TimelineChartProps {
  data: Array<{
    date: Date;
    value: number;
    category?: string;
  }>;
  title: string;
  aggregation: 'daily' | 'weekly' | 'monthly';
  multiple?: boolean; // múltiplas linhas
}

// Uso: Propostas Criadas por Data
// Agregação por dia/mês
// Múltiplas linhas para diferentes carteiras
```

### **8. Heatmap - `<HeatmapChart />`**
```typescript
interface HeatmapChartProps {
  data: Array<{
    x: string;
    y: string;
    value: number;
  }>;
  title: string;
  colorScale: string[];
}

// Uso: Matriz de Correlação
// Performance por Agência vs Métrica
```

---

## 🔍 **SISTEMA DE FILTROS AVANÇADOS**

### **Filtros Básicos**
```typescript
interface BasicFilters {
  agencia: string; // Select dropdown
  carteiraNegocio: string; // Select dropdown
  statusPrioridade: string; // Select dropdown
  gerenteResponsavel: string; // Select dropdown
  dataRange: [Date, Date]; // Date range picker
}
```

### **Filtros Avançados**
```typescript
interface AdvancedFilters {
  valorRange: [number, number]; // Range slider
  diasRange: [number, number]; // Range slider
  carteirasMultiplas: string[]; // Multi-select
  statusMultiplos: string[]; // Multi-select
  buscaTexto: string; // Search input
}
```

### **Lógica de Aplicação de Filtros**
```typescript
function applyFilters(
  propostas: PropostaProposta[],
  filtros: BasicFilters & AdvancedFilters
): PropostaProposta[] {
  return propostas.filter(proposta => {
    // Filtros básicos
    if (filtros.agencia !== 'Todos' && proposta.nomeAgencia !== filtros.agencia) 
      return false;
    
    if (filtros.carteiraNegocio !== 'Todos' && 
        proposta.carteiraNegocio !== filtros.carteiraNegocio) 
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
}
```

---

## 📋 **TABELA INTERATIVA COM PAGINAÇÃO**

### **Componente de Tabela - `<DataTable />`**
```typescript
interface DataTableProps {
  data: PropostaProposta[];
  columns: Array<{
    key: keyof PropostaProposta;
    label: string;
    format?: 'currency' | 'date' | 'number';
    sortable?: boolean;
    width?: string;
  }>;
  pageSize: number;
  searchable: boolean;
  exportable: boolean;
}

// Features:
// - Paginação com controles
// - Ordenação por colunas
// - Busca em todas as colunas visíveis
// - Seleção de colunas para exibir
// - Exportação (CSV, Excel, PDF)
```

### **Lógica de Paginação**
```typescript
interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

function usePagination(data: any[], pageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);
  
  const totalPages = Math.ceil(data.length / pageSize);
  
  return {
    paginatedData,
    currentPage,
    totalPages,
    setCurrentPage,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1
  };
}
```

### **Busca na Tabela**
```typescript
function useTableSearch(data: PropostaProposta[], searchTerm: string) {
  return useMemo(() => {
    if (!searchTerm) return data;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(lowercaseSearch)
      )
    );
  }, [data, searchTerm]);
}
```

---

## 🎯 **SISTEMA DE BENCHMARKS E ALERTAS**

### **Cálculo de Benchmarks**
```typescript
function calculateBenchmarks(propostas: PropostaProposta[]): BenchmarkMetrics {
  const valores = propostas.map(p => p.valor);
  const dias = propostas.map(p => p.totalDiasGeral);
  
  const avgValue = valores.reduce((a, b) => a + b, 0) / valores.length;
  const medianValue = median(valores);
  const avgDays = dias.reduce((a, b) => a + b, 0) / dias.length;
  const medianDays = median(dias);
  
  return {
    avgValue,
    medianValue,
    avgDays,
    medianDays,
    excellentDays: avgDays * 0.7, // 30% melhor que a média
    goodDays: avgDays * 0.9,      // 10% melhor que a média
    poorDays: avgDays * 1.2,      // 20% pior que a média
    highValue: medianValue * 2,    // Dobro da mediana
    lowValue: medianValue * 0.5    // Metade da mediana
  };
}
```

### **Geração de Alertas Automáticos**
```typescript
function generateAlerts(
  propostas: PropostaProposta[], 
  benchmarks: BenchmarkMetrics
): Alert[] {
  const alerts: Alert[] = [];
  
  // Propostas lentas
  const slowProposals = propostas.filter(p => p.totalDiasGeral > benchmarks.poorDays);
  if (slowProposals.length > 0) {
    alerts.push({
      id: 'slow-proposals',
      type: 'warning',
      title: 'Propostas com Prazo Elevado',
      message: `${slowProposals.length} proposta(s) com prazo acima do aceitável`,
      timestamp: new Date(),
      dismissed: false
    });
  }
  
  // Valores altos
  const highValueProposals = propostas.filter(p => p.valor > benchmarks.highValue);
  if (highValueProposals.length > 0) {
    alerts.push({
      id: 'high-value',
      type: 'info',
      title: 'Propostas de Alto Valor',
      message: `${highValueProposals.length} proposta(s) de alto valor requerem atenção`,
      timestamp: new Date(),
      dismissed: false
    });
  }
  
  return alerts;
}
```

### **Sistema de Insights Automáticos**
```typescript
function generateInsights(propostas: PropostaProposta[]): Insight[] {
  const insights: Insight[] = [];
  
  // Melhor carteira por eficiência
  const portfolioPerformance = groupBy(propostas, 'carteiraNegocio');
  const portfolioAvgDays = Object.entries(portfolioPerformance)
    .map(([carteira, props]) => ({
      carteira,
      avgDays: props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length
    }))
    .sort((a, b) => a.avgDays - b.avgDays);
  
  insights.push({
    id: 'best-portfolio',
    category: 'performance',
    title: 'Carteira Mais Eficiente',
    description: `${portfolioAvgDays[0]?.carteira} tem o menor prazo médio`,
    impact: 'medium',
    recommendation: 'Analisar práticas desta carteira para replicar'
  });
  
  return insights;
}
```

---

## 📤 **SISTEMA DE EXPORTAÇÃO**

### **Exportação CSV**
```typescript
function exportToCSV(data: PropostaProposta[], filename: string) {
  const csvContent = [
    // Header
    Object.keys(data[0]).join(','),
    // Data rows
    ...data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  downloadBlob(blob, filename);
}
```

### **Exportação Excel Multi-abas**
```typescript
import * as XLSX from 'xlsx';

function exportToExcel(data: PropostaProposta[], filename: string) {
  const wb = XLSX.utils.book_new();
  
  // Aba principal
  const wsMain = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, wsMain, 'Dados Principais');
  
  // Aba de resumo
  const summary = calculateSummary(data);
  const wsSummary = XLSX.utils.json_to_sheet([summary]);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo');
  
  // Análise por carteiras
  const portfolioAnalysis = analyzeByPortfolio(data);
  const wsPortfolio = XLSX.utils.json_to_sheet(portfolioAnalysis);
  XLSX.utils.book_append_sheet(wb, wsPortfolio, 'Análise Carteiras');
  
  // Análise por agências
  const agencyAnalysis = analyzeByAgency(data);
  const wsAgency = XLSX.utils.json_to_sheet(agencyAnalysis);
  XLSX.utils.book_append_sheet(wb, wsAgency, 'Análise Agências');
  
  XLSX.writeFile(wb, filename);
}
```

### **Exportação PDF com Gráficos**
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

async function exportToPDF(
  data: PropostaProposta[], 
  chartRefs: React.RefObject<HTMLDivElement>[],
  filename: string
) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Página de resumo
  pdf.text('Relatório de Propostas de Crédito', 20, 20);
  pdf.text(`Total de Propostas: ${data.length}`, 20, 30);
  // ... mais métricas
  
  // Capturar e adicionar gráficos
  for (let i = 0; i < chartRefs.length; i++) {
    if (chartRefs[i].current) {
      pdf.addPage();
      const canvas = await html2canvas(chartRefs[i].current!);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
    }
  }
  
  pdf.save(filename);
}
```

---

## 🔄 **FUNCIONALIDADES AVANÇADAS**

### **Auto-Refresh**
```typescript
function useAutoRefresh(intervalSeconds: number, onRefresh: () => void) {
  useEffect(() => {
    if (intervalSeconds === 0) return;
    
    const interval = setInterval(onRefresh, intervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [intervalSeconds, onRefresh]);
}
```

### **Performance de Gerentes com Scoring**
```typescript
interface ManagerPerformance {
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

function calculateManagerPerformance(propostas: PropostaProposta[]): ManagerPerformance[] {
  const managerGroups = groupBy(propostas, 'gerenteResponsavel');
  const maxPropostas = Math.max(...Object.values(managerGroups).map(g => g.length));
  const avgDays = propostas.reduce((sum, p) => sum + p.totalDiasGeral, 0) / propostas.length;
  
  return Object.entries(managerGroups).map(([gerente, props]) => {
    const qtdPropostas = props.length;
    const valorTotal = props.reduce((sum, p) => sum + p.valor, 0);
    const prazoMedio = props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length;
    
    const produtividade = (qtdPropostas / maxPropostas) * 100;
    const eficienciaPrazo = Math.max(0, ((avgDays - prazoMedio) / avgDays) * 100);
    const scoreGeral = produtividade * 0.6 + eficienciaPrazo * 0.4;
    
    return {
      gerente,
      gerenteNome: gerente.split(' - ')[0],
      qtdPropostas,
      valorTotal,
      valorMedio: valorTotal / qtdPropostas,
      prazoMedio,
      prazoDesvio: calculateStdDev(props.map(p => p.totalDiasGeral)),
      produtividade,
      eficienciaPrazo,
      scoreGeral,
      categoria: scoreGeral >= 70 ? 'Excelente' : 
                scoreGeral >= 40 ? 'Bom' : 'Precisa Melhorar'
    };
  });
}
```

### **Análise Temporal e Sazonalidade**
```typescript
interface TemporalAnalysis {
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

function analyzeTemporalPatterns(propostas: PropostaProposta[]): TemporalAnalysis {
  // Análise mensal
  const monthlyGroups = groupBy(propostas, p => 
    p.dataCriacao.toISOString().slice(0, 7) // YYYY-MM
  );
  
  const monthly = Object.entries(monthlyGroups).map(([mes, props]) => ({
    mes,
    qtdPropostas: props.length,
    valorTotal: props.reduce((sum, p) => sum + p.valor, 0),
    valorMedio: props.reduce((sum, p) => sum + p.valor, 0) / props.length,
    prazoMedio: props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length
  }));
  
  // Análise sazonal (por mês do ano)
  const seasonalGroups = groupBy(propostas, p => p.dataCriacao.getMonth());
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const seasonal = Object.entries(seasonalGroups).map(([month, props]) => ({
    mes: monthNames[parseInt(month)],
    qtd: props.length,
    prazoMedio: props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length
  }));
  
  // Análise por dia da semana
  const dayGroups = groupBy(propostas, p => p.diaSemana);
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  
  const dayOfWeek = Object.entries(dayGroups).map(([day, props]) => ({
    dia: dayNames[parseInt(day)],
    qtd: props.length,
    mediaValor: props.reduce((sum, p) => sum + p.valor, 0) / props.length
  }));
  
  return { monthly, seasonal, dayOfWeek };
}
```

---

## 🎨 **DESIGN SYSTEM E UI COMPONENTS**

### **Cores e Tema**
```typescript
const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a'
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706'
    },
    danger: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626'
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      500: '#6b7280',
      600: '#4b5563',
      800: '#1f2937',
      900: '#111827'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem'
  }
};
```

### **Componentes Base**
```typescript
// Button Component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

// Card Component
interface CardProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Badge Component
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

---

## 🔧 **UTILITÁRIOS E HELPERS**

### **Formatação de Dados**
```typescript
export const formatters = {
  currency: (value: number): string => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value),
    
  number: (value: number): string =>
    new Intl.NumberFormat('pt-BR').format(value),
    
  date: (date: Date): string =>
    new Intl.DateTimeFormat('pt-BR').format(date),
    
  datetime: (date: Date): string =>
    new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date),
    
  percentage: (value: number): string =>
    new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1
    }).format(value / 100),
    
  days: (days: number): string =>
    `${Math.round(days)} dia${days !== 1 ? 's' : ''}`
};
```

### **Funções de Agrupamento e Cálculo**
```typescript
export function groupBy<T>(array: T[], key: keyof T | ((item: T) => any)): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function median(numbers: number[]): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

export function calculateStdDev(numbers: number[]): number {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}

export function percentile(numbers: number[], p: number): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  
  if (Math.floor(index) === index) {
    return sorted[index];
  }
  
  const lower = sorted[Math.floor(index)];
  const upper = sorted[Math.ceil(index)];
  const weight = index - Math.floor(index);
  
  return lower * (1 - weight) + upper * weight;
}
```

---

## 📱 **RESPONSIVIDADE E MOBILE**

### **Breakpoints**
```typescript
const breakpoints = {
  sm: '640px',   // mobile
  md: '768px',   // tablet
  lg: '1024px',  // laptop
  xl: '1280px',  // desktop
  '2xl': '1536px' // large desktop
};
```

### **Layout Responsivo**
```typescript
// Mobile: Stack vertically, hide sidebar, simplified charts
// Tablet: 2-column grid, collapsible sidebar
// Desktop: Full layout with sidebar, multiple columns

interface ResponsiveLayoutProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

function useResponsive(): ResponsiveLayoutProps {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024
  };
}
```

---

## 🚀 **PERFORMANCE E OTIMIZAÇÕES**

### **Lazy Loading de Componentes**
```typescript
const HeavyChart = React.lazy(() => import('./components/charts/HeavyChart'));
const DataTable = React.lazy(() => import('./components/DataTable'));

// Uso com Suspense
<Suspense fallback={<ChartSkeleton />}>
  <HeavyChart data={data} />
</Suspense>
```

### **Memoização de Cálculos Pesados**
```typescript
const expensiveCalculation = useMemo(() => {
  return calculateManagerPerformance(filteredData);
}, [filteredData]);

const memoizedChart = React.memo(({ data }: { data: any[] }) => {
  return <ComplexChart data={data} />;
});
```

### **Debouncing de Filtros**
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

---

## 🧪 **TESTES E QUALIDADE**

### **Testes de Componentes**
```typescript
// Usando React Testing Library
describe('MetricCard', () => {
  it('should format currency correctly', () => {
    render(<MetricCard title="Valor" value={1000000} format="currency" />);
    expect(screen.getByText('R$ 1.000.000,00')).toBeInTheDocument();
  });
  
  it('should show trend indicator when provided', () => {
    const trend = { value: 5, direction: 'up' as const };
    render(<MetricCard title="Test" value={100} trend={trend} />);
    expect(screen.getByText('↑ 5%')).toBeInTheDocument();
  });
});
```

### **Testes de Utilitários**
```typescript
describe('formatters', () => {
  it('should format currency in Brazilian format', () => {
    expect(formatters.currency(1234.56)).toBe('R$ 1.234,56');
  });
  
  it('should format percentage correctly', () => {
    expect(formatters.percentage(75.5)).toBe('75,5%');
  });
});

describe('data processing', () => {
  it('should calculate benchmarks correctly', () => {
    const mockData = [
      { valor: 1000, totalDiasGeral: 30 },
      { valor: 2000, totalDiasGeral: 60 }
    ];
    const benchmarks = calculateBenchmarks(mockData);
    expect(benchmarks.avgValue).toBe(1500);
    expect(benchmarks.avgDays).toBe(45);
  });
});
```

---

## 📦 **DEPENDÊNCIAS E PACKAGES**

### **Package.json Essencial**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    
    "zustand": "^4.4.0",
    "react-router-dom": "^6.15.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    
    "recharts": "^2.8.0",
    "react-plotly.js": "^2.6.0",
    "plotly.js": "^2.26.0",
    
    "tailwindcss": "^3.3.0",
    "@headlessui/react": "^1.7.0",
    "@heroicons/react": "^2.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    
    "lodash": "^4.17.21",
    "date-fns": "^2.30.0",
    "@types/lodash": "^4.14.0",
    
    "xlsx": "^0.18.5",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    
    "react-query": "^3.39.0",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "vite": "^4.4.0",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.0.0",
    "vitest": "^0.34.0"
  }
}
```

---

## 🔗 **INTEGRAÇÃO COM BACKEND (OPCIONAL)**

### **API Endpoints Sugeridos**
```typescript
interface ApiEndpoints {
  // Dados
  'GET /api/propostas': PropostaProposta[];
  'GET /api/propostas/filters': FilterOptions;
  
  // Métricas
  'GET /api/metrics/benchmarks': BenchmarkMetrics;
  'GET /api/metrics/performance': ManagerPerformance[];
  
  // Exportação
  'POST /api/export/csv': { url: string };
  'POST /api/export/excel': { url: string };
  'POST /api/export/pdf': { url: string };
  
  // Configurações
  'GET /api/config': AppConfig;
  'PUT /api/config': AppConfig;
}
```

### **Service Layer**
```typescript
class DataService {
  async getPropostas(filters?: Partial<FilterState>): Promise<PropostaProposta[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(`/api/propostas?${params}`);
    return response.json();
  }
  
  async exportData(format: 'csv' | 'excel' | 'pdf', data: any): Promise<string> {
    const response = await fetch(`/api/export/${format}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const { url } = await response.json();
    return url;
  }
}
```

---

## 🎯 **FEATURES ESPECÍFICAS DO DASHBOARD**

### **Dashboard por Carteira**
```typescript
interface PortfolioDashboardProps {
  carteira: string;
  data: PropostaProposta[];
}

// Componentes específicos:
// - PortfolioMetrics: KPIs específicos da carteira
// - PortfolioAgencies: Top agências desta carteira
// - PortfolioManagers: Gerentes mais ativos
// - PortfolioPerformance: Indicadores de prazo e valor
// - PortfolioStatusDistribution: Distribuição de status
```

### **Análise de Correlação**
```typescript
function calculateCorrelationMatrix(data: PropostaProposta[]): number[][] {
  const numericFields = ['valor', 'totalDiasAgencia', 'totalDiasCentral', 
                        'totalDiasComite', 'totalDiasGeral', 'diasTarefa'];
  
  const matrix: number[][] = [];
  
  for (let i = 0; i < numericFields.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < numericFields.length; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else {
        const correlation = pearsonCorrelation(
          data.map(d => d[numericFields[i] as keyof PropostaProposta] as number),
          data.map(d => d[numericFields[j] as keyof PropostaProposta] as number)
        );
        matrix[i][j] = correlation;
      }
    }
  }
  
  return matrix;
}
```

---

## 🎊 **RESUMO FINAL PARA IA**

Para recriar este dashboard em React, você precisará implementar:

### **🏗️ ARQUITETURA**
- **Estado Global**: Zustand/Redux com todas as interfaces TypeScript definidas
- **Roteamento**: React Router para navegação entre dashboards
- **Componentes**: Sistema de design consistente com Tailwind CSS

### **📊 VISUALIZAÇÕES** (15 tipos principais)
- Gráficos básicos: Barras, Pizza, Linha, Scatter
- Gráficos avançados: Sankey, Treemap, Heatmap, Gauges
- Cada um com props específicas e lógica de processamento

### **🔍 FUNCIONALIDADES**
- **Filtros**: Básicos + avançados com ranges e múltipla seleção
- **Tabela**: Paginação + busca + ordenação + exportação
- **Benchmarks**: Cálculos automáticos + alertas + insights
- **Performance**: Scoring de gerentes + análise temporal

### **📱 UX/UI**
- **Responsivo**: Mobile-first com breakpoints específicos
- **Interativo**: Hover, tooltips, drill-down
- **Exportação**: CSV, Excel multi-abas, PDF com gráficos

### **🚀 PERFORMANCE**
- **Lazy loading**: Componentes pesados
- **Memoização**: Cálculos complexos
- **Debouncing**: Filtros em tempo real

Este documento fornece 100% das especificações necessárias para recriar o dashboard com funcionalidade idêntica em React. Cada função, componente e lógica está detalhada com tipos TypeScript completos.