# 📋 Índice de Implementação React - Dashboard Projetta2

## 🎯 **GUIA RÁPIDO PARA IA**

Este arquivo serve como índice complementar ao `REACT_FRONTEND_SPECS.md`, organizando as informações por ordem de implementação e prioridade.

---

## 📦 **PASSO 1: CONFIGURAÇÃO INICIAL**

### **Setup do Projeto**
```bash
npx create-react-app projetta2-react --template typescript
# ou
npm create vite@latest projetta2-react -- --template react-ts

cd projetta2-react
npm install zustand react-router-dom react-hook-form zod
npm install recharts react-plotly.js plotly.js
npm install tailwindcss @headlessui/react @heroicons/react
npm install lodash date-fns @types/lodash
npm install xlsx jspdf html2canvas
```

### **Estrutura de Pastas a Criar**
```
src/
├── components/
│   ├── ui/              # Button, Card, Badge, Input
│   ├── charts/          # Todos os componentes de gráficos
│   ├── filters/         # FilterSidebar, AdvancedFilters
│   ├── layout/          # AppLayout, Header, Footer
│   └── dashboard/       # Dashboard específicos
├── hooks/               # Custom hooks
├── store/               # Zustand store
├── utils/               # Formatters e helpers
├── types/               # TypeScript interfaces
└── data/                # CSV de exemplo
```

---

## 🏗️ **PASSO 2: TIPOS E INTERFACES**

### **Prioridade ALTA - Implementar Primeiro**
1. `PropostaProposta` interface (linha 45 do specs)
2. `AppState` interface (linha 73 do specs)
3. `BenchmarkMetrics` interface (linha 103 do specs)
4. `Alert` e `Insight` interfaces (linha 115 do specs)

### **Arquivo: `src/types/index.ts`**
```typescript
// Copiar EXATAMENTE as interfaces das linhas 45-130 do REACT_FRONTEND_SPECS.md
export interface PropostaProposta { /* ... */ }
export interface AppState { /* ... */ }
// ... resto das interfaces
```

---

## 🗂️ **PASSO 3: ESTADO GLOBAL**

### **Arquivo: `src/store/useStore.ts`**
```typescript
import { create } from 'zustand';
import { AppState, PropostaProposta } from '../types';

// Implementar exatamente como especificado nas linhas 73-102
const useStore = create<AppState>((set, get) => ({
  // Estado inicial
  propostas: [],
  propostasFiltered: [],
  loading: false,
  error: null,
  
  // Actions
  setPropostas: (propostas) => set({ propostas }),
  setFiltros: (filtros) => set({ filtros }),
  // ... outras actions
}));
```

---

## 🎨 **PASSO 4: COMPONENTES BASE**

### **Ordem de Implementação**
1. **UI Components** (linhas 550-580)
   - `Button`, `Card`, `Badge`
   - `Input`, `Select`, `DatePicker`
   
2. **Layout Components** (linhas 140-170)
   - `AppLayout`
   - `Header` com título e controles
   - `FilterSidebar`

3. **Metric Cards** (linha 158)
   - `MetricCard` com formatação automática
   - Suporte a trends e cores

---

## 📊 **PASSO 5: COMPONENTES DE GRÁFICOS**

### **Implementar Nesta Ordem** (linhas 190-340)

#### **5.1 Gráficos Simples Primeiro**
```typescript
// 1. HorizontalBarChart (linha 190)
// 2. PieChart (linha 210) 
// 3. TimelineChart (linha 280)
```

#### **5.2 Gráficos Avançados**
```typescript
// 4. ScatterPlot (linha 260)
// 5. GaugeChart (linha 240)
// 6. HeatmapChart (linha 300)
```

#### **5.3 Gráficos Complexos**
```typescript
// 7. SankeyDiagram (linha 220) - lógica nas linhas 220-235
// 8. TreemapChart (linha 240) - lógica nas linhas 240-255
```

### **Dados de Exemplo para Cada Gráfico**
```typescript
// HorizontalBarChart - Top 10 Agências
const agencyData = [
  { name: "Agência A", value: 1000000 },
  { name: "Agência B", value: 800000 }
];

// PieChart - Distribuição Carteiras  
const portfolioData = [
  { name: "AGRONEGÓCIO", value: 42 },
  { name: "EMPRESARIAL", value: 30 }
];

// Sankey - Fluxo Carteira → Agência → Status
const sankeyData = {
  nodes: [
    { id: "AGRONEGÓCIO", label: "Agronegócio" },
    { id: "AG001", label: "Agência 001" }
  ],
  links: [
    { source: "AGRONEGÓCIO", target: "AG001", value: 15 }
  ]
};
```

---

## 🔍 **PASSO 6: SISTEMA DE FILTROS**

### **Implementação dos Filtros** (linhas 340-420)

#### **6.1 Filtros Básicos** 
```typescript
// BasicFilters component
// - Select para Agência, Carteira, Status, Gerente
// - DateRangePicker para período
```

#### **6.2 Filtros Avançados**
```typescript
// AdvancedFilters component
// - Range sliders para valor e dias
// - Multi-select para carteiras e status
// - Search input para busca textual
```

#### **6.3 Lógica de Aplicação**
```typescript
// Função applyFilters (linhas 370-420)
// Implementar EXATAMENTE como especificado
function applyFilters(propostas: PropostaProposta[], filtros: Filtros) {
  return propostas.filter(proposta => {
    // Cada filtro como especificado
  });
}
```

---

## 📋 **PASSO 7: TABELA INTERATIVA**

### **Componente DataTable** (linhas 420-480)
```typescript
// Features obrigatórias:
// 1. Paginação (usePagination hook)
// 2. Busca (useTableSearch hook) 
// 3. Ordenação por colunas
// 4. Seleção de colunas
// 5. Formatação automática (currency, date, number)
```

### **Hooks Necessários**
```typescript
// usePagination (linhas 450-470)
// useTableSearch (linhas 470-480)
// useSortableTable (criar baseado na lógica)
```

---

## 🎯 **PASSO 8: BENCHMARKS E ALERTAS**

### **Sistema de Benchmarks** (linhas 480-520)
```typescript
// calculateBenchmarks - IMPLEMENTAR EXATAMENTE
function calculateBenchmarks(propostas: PropostaProposta[]): BenchmarkMetrics {
  // Cálculos nas linhas 490-510
}

// generateAlerts - IMPLEMENTAR EXATAMENTE  
function generateAlerts(propostas: PropostaProposta[], benchmarks: BenchmarkMetrics): Alert[] {
  // Lógica nas linhas 520-545
}

// generateInsights - IMPLEMENTAR EXATAMENTE
function generateInsights(propostas: PropostaProposta[]): Insight[] {
  // Lógica nas linhas 545-570
}
```

---

## 📤 **PASSO 9: EXPORTAÇÕES**

### **Ordem de Implementação** (linhas 570-620)
1. **CSV Export** (mais simples)
2. **Excel Multi-abas** (médio) 
3. **PDF com Gráficos** (mais complexo)

### **Dependências Necessárias**
```bash
npm install xlsx jspdf html2canvas
```

---

## 🚀 **PASSO 10: FUNCIONALIDADES AVANÇADAS**

### **Auto-Refresh** (linha 630)
```typescript
// useAutoRefresh hook - implementar exatamente
```

### **Performance de Gerentes** (linhas 640-690)
```typescript
// calculateManagerPerformance - lógica completa especificada
// ManagerPerformance interface definida
```

### **Análise Temporal** (linhas 690-750)
```typescript
// analyzeTemporalPatterns - implementação completa
// TemporalAnalysis interface definida
```

---

## 🎨 **PASSO 11: DESIGN SYSTEM**

### **Tema e Cores** (linhas 750-780)
```typescript
// Theme object - usar EXATAMENTE as cores especificadas
const theme = {
  colors: { /* cores da linha 760 */ },
  spacing: { /* espaçamentos da linha 770 */ }
};
```

### **Componentes UI**
```typescript
// Button, Card, Badge - interfaces nas linhas 780-800
```

---

## 🔧 **PASSO 12: UTILITÁRIOS**

### **Formatters** (linhas 810-850)
```typescript
// formatters object - implementar EXATAMENTE
export const formatters = {
  currency: (value: number) => /* implementação linha 820 */,
  number: (value: number) => /* implementação linha 825 */,
  // ... resto dos formatters
};
```

### **Helper Functions** (linhas 850-900)
```typescript
// groupBy, median, calculateStdDev, percentile
// Implementar EXATAMENTE como especificado
```

---

## 📱 **PASSO 13: RESPONSIVIDADE**

### **Breakpoints e Hook** (linhas 900-950)
```typescript
// useResponsive hook - implementação completa
// Breakpoints object definido
```

---

## ⚡ **PASSO 14: PERFORMANCE**

### **Otimizações** (linhas 950-990)
```typescript
// Lazy loading com React.lazy e Suspense
// Memoização com useMemo e React.memo
// Debouncing com useDebounce
```

---

## 🧪 **PASSO 15: TESTES**

### **Testes Essenciais** (linhas 990-1050)
```typescript
// Testes para formatters
// Testes para componentes principais
// Testes para hooks personalizados
```

---

## 📦 **DEPENDÊNCIAS COMPLETAS**

### **Package.json** (linhas 1050-1100)
```json
// Lista COMPLETA de dependências necessárias
// Copiar EXATAMENTE o package.json especificado
```

---

## 🎯 **CHECKLIST DE IMPLEMENTAÇÃO**

### **✅ MVP (Mínimo Viável)**
- [ ] Tipos TypeScript definidos
- [ ] Estado global com Zustand
- [ ] Layout básico responsivo
- [ ] 3 gráficos principais (Bar, Pie, Line)
- [ ] Filtros básicos funcionando
- [ ] Tabela com paginação
- [ ] Formatação de dados (currency, date)
- [ ] Cards de métricas principais

### **✅ Versão Completa**
- [ ] Todos os 8 tipos de gráficos
- [ ] Sistema completo de filtros avançados
- [ ] Benchmarks automáticos
- [ ] Sistema de alertas
- [ ] Exportações (CSV, Excel, PDF)
- [ ] Performance de gerentes
- [ ] Análise temporal
- [ ] Auto-refresh
- [ ] Testes unitários

### **✅ Funcionalidades Premium**
- [ ] Dashboard por carteira
- [ ] Análise de correlação
- [ ] Insights automáticos
- [ ] Performance otimizada
- [ ] PWA (Progressive Web App)

---

## 🔄 **FLUXO DE DADOS**

### **1. Carregamento Inicial**
```
CSV → Parse → ProcessData → Store → Components
```

### **2. Aplicação de Filtros**
```
FilterChange → ApplyFilters → UpdateStore → ReRenderCharts
```

### **3. Cálculo de Métricas**
```
FilteredData → CalculateBenchmarks → GenerateAlerts → UpdateUI
```

---

## 📊 **LÓGICAS DE NEGÓCIO CRÍTICAS**

### **Categorização Automática** (linha 55-60)
```typescript
// categoriaPerformance: baseada em totalDiasGeral
// categoriaValor: baseada em valor
// Implementar exatamente como especificado
```

### **Scoring de Gerentes** (linhas 650-680)
```typescript
// Fórmula específica:
// produtividade = (qtdPropostas / maxPropostas) * 100
// eficienciaPrazo = ((avgDays - prazoMedio) / avgDays) * 100
// scoreGeral = produtividade * 0.6 + eficienciaPrazo * 0.4
```

### **Thresholds de Benchmark** (linhas 495-505)
```typescript
// excellentDays = avgDays * 0.7 (30% melhor)
// goodDays = avgDays * 0.9 (10% melhor)  
// poorDays = avgDays * 1.2 (20% pior)
// highValue = medianValue * 2 (dobro da mediana)
```

---

## 💡 **DICAS DE IMPLEMENTAÇÃO**

1. **Comece pelos tipos** - Definir todas as interfaces primeiro
2. **Use o estado global** - Centralize dados e filtros no Zustand
3. **Implemente gráficos gradualmente** - Comece pelos mais simples
4. **Teste cada filtro** - Verifique se a lógica funciona antes de avançar
5. **Valide formatação** - Use os formatters especificados exatamente
6. **Performance primeiro** - Use memoização em cálculos pesados
7. **Mobile first** - Implemente responsividade desde o início

---

## 🎯 **RESULTADO ESPERADO**

Um dashboard React que:
- **Aparência idêntica** ao dashboard Streamlit original
- **Funcionalidades 100% equivalentes** 
- **Performance superior** com otimizações React
- **Responsivo** para mobile/tablet/desktop
- **Typescript completo** com type safety
- **Testável** com testes unitários
- **Manutenível** com código bem estruturado

---

**📝 Este índice deve ser usado junto com o arquivo `REACT_FRONTEND_SPECS.md` para implementação completa do dashboard em React.**