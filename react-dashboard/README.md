# 📊 Dashboard Projetta2 - React Frontend

## 🎯 Visão Geral

Dashboard React implementado com base nas especificações técnicas do projeto Streamlit original. Oferece análises avançadas, métricas de performance e insights para propostas de crédito bancário.

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **Zustand** para gerenciamento de estado
- **Tailwind CSS** para estilização
- **Recharts** para visualizações
- **Vite** para build e desenvolvimento

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Comandos

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção  
npm run build

# Preview da build
npm run preview
```

### Acessar aplicação
Após executar `npm run dev`, acesse: http://localhost:3000

## 🎨 Funcionalidades Implementadas

### ✅ MVP (Implementado)
- [x] Layout responsivo com sidebar colapsível
- [x] Sistema de filtros básicos (Agência, Carteira, Status, Gerente)
- [x] Busca textual por cliente
- [x] Gráficos básicos (Bar, Pie, Line)
- [x] Cards de métricas principais
- [x] Sistema de alertas automáticos
- [x] Cálculo de benchmarks
- [x] Formatação brasileira (moeda, datas)

### 🚧 Em Desenvolvimento
- [ ] Filtros avançados (ranges, múltipla seleção)
- [ ] Gráficos avançados (Sankey, Treemap, Gauges)
- [ ] Tabela interativa com paginação
- [ ] Sistema de exportação (CSV, Excel, PDF)
- [ ] Performance de gerentes
- [ ] Análise temporal

### 📈 Roadmap
- [ ] Dashboard por carteira
- [ ] Correlações estatísticas
- [ ] Insights de IA
- [ ] Auto-refresh
- [ ] PWA

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Card, MetricCard)
│   ├── charts/          # Gráficos (Bar, Pie, Line)
│   ├── layout/          # Layout (Header, Sidebar, AppLayout)
│   └── dashboard/       # Componentes específicos do dashboard
├── pages/               # Páginas principais
├── hooks/               # Custom hooks
├── store/               # Zustand store
├── utils/               # Utilitários (formatters, calculations)
├── types/               # Interfaces TypeScript
└── data/                # Dados de exemplo/mock
```

## 📊 Dados de Exemplo

O dashboard usa dados de exemplo similares ao projeto Streamlit original:
- 3 propostas de crédito de amostra
- Diferentes carteiras (CORPORATE, AGRONEGÓCIO)
- Valores em Real brasileiro
- Datas e prazos realistas

## 🎯 Estado Global (Zustand)

```typescript
interface AppState {
  propostas: PropostaProposta[];
  propostasFiltered: PropostaProposta[];
  filtros: FilterState;
  ui: UIState;
  benchmarks: BenchmarkMetrics;
  alertas: Alert[];
  insights: Insight[];
}
```

## 🔍 Sistema de Filtros

### Filtros Implementados:
- **Agência**: Dropdown com todas as agências
- **Carteira de Negócio**: Seleção por carteira  
- **Status**: Filtro por status da proposta
- **Gerente**: Seleção por gerente responsável
- **Busca Textual**: Busca no nome do cliente

### Aplicação Automática:
Os filtros são aplicados automaticamente quando alterados, recalculando:
- Propostas filtradas
- Benchmarks atualizados
- Alertas dinâmicos
- Métricas dos cards

## 📈 Métricas e Benchmarks

### Cálculos Automáticos:
- **Valor médio/mediano** das propostas
- **Prazo médio/mediano** de processamento
- **Thresholds de performance** (excelente/bom/ruim)
- **Alertas inteligentes** para propostas lentas

### Fórmulas de Benchmark:
```typescript
excellentDays = avgDays * 0.7  // 30% melhor que a média
goodDays = avgDays * 0.9       // 10% melhor que a média  
poorDays = avgDays * 1.2       // 20% pior que a média
```

## 🎨 Design System

### Cores Principais:
- **Primary**: Tons de azul (#3B82F6)
- **Success**: Verde (#22C55E)  
- **Warning**: Amarelo (#F59E0B)
- **Danger**: Vermelho (#EF4444)

### Componentes UI:
- **Button**: 4 variantes (primary, secondary, outline, ghost)
- **Card**: Container padrão com título e ações
- **MetricCard**: Card especializado para métricas

## 🚀 Deploy e Produção

### Build:
```bash
npm run build
# Gera pasta dist/ otimizada
```

### Deploy Sugerido:
- **Vercel**: Deploy automático via Git
- **Netlify**: Build e deploy contínuo  
- **GitHub Pages**: Para projetos estáticos

### Variáveis de Ambiente:
```bash
VITE_API_URL=https://api.exemplo.com
VITE_ENVIRONMENT=production
```

## 🔄 Próximas Implementações

### Prioridade Alta:
1. **Filtros avançados**: Ranges de valor e prazo
2. **Tabela paginada**: Com busca e ordenação
3. **Exportação**: CSV e Excel básico

### Prioridade Média:
1. **Gráficos avançados**: Sankey e Treemap
2. **Performance gerentes**: Scoring automático
3. **Auto-refresh**: Atualização periódica

### Prioridade Baixa:
1. **PWA**: App installable
2. **Temas**: Dark/light mode
3. **i18n**: Internacionalização

## 🤝 Como Contribuir

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add: nova feature'`
4. Push: `git push origin feature/nova-feature`  
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](../LICENSE) para detalhes.

---

**Desenvolvido com ❤️ usando React + TypeScript + Tailwind CSS**