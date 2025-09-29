# 🎨 Projetta2 React Frontend

Dashboard moderno e elegante para análise de propostas de crédito bancário, desenvolvido com React, TypeScript e Tailwind CSS.

## ✨ Características

- **🎨 Design Minimalista**: Interface moderna e clean com UX excepcional
- **🌙 Modo Escuro**: Tema dark/light com transições suaves
- **📱 Responsivo**: Totalmente adaptativo para desktop, tablet e mobile
- **⚡ Performance**: Carregamento otimizado com cache inteligente
- **🔍 Busca Avançada**: Sistema de filtros e busca em tempo real
- **📊 Visualizações Ricas**: Gráficos interativos com Recharts e D3
- **📥 Exportações**: Suporte a CSV, Excel e PDF
- **🎯 Animações**: Micro-interações elegantes com Framer Motion

## 🚀 Tecnologias

### Core
- **React 18** + **TypeScript** - Base moderna e tipada
- **Vite** - Build tool ultra-rápido
- **TanStack Query** - Gerenciamento de estado servidor
- **Zustand** - Gerenciamento de estado local

### UI/UX
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animações fluidas
- **Headless UI** - Componentes acessíveis
- **Heroicons** - Ícones consistentes

### Visualizações
- **Recharts** - Gráficos React nativos
- **D3.js** - Gráficos customizados avançados

### PWA
- **Vite PWA** - Service Worker e manifest
- **Offline Support** - Funciona sem conexão

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base
│   ├── charts/          # Componentes de gráficos
│   └── layout/          # Layout e navegação
├── pages/               # Páginas da aplicação
├── hooks/               # Custom hooks
├── services/            # API e serviços
├── utils/               # Utilitários
├── types/               # Definições TypeScript
└── App.tsx             # Componente principal
```

## 🎨 Sistema de Design

### Paleta de Cores
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Gray Scale**: 50-900

### Componentes
- **Button**: 4 variantes (primary, secondary, ghost, danger)
- **Card**: 4 níveis de elevação
- **Input**: Floating labels e estados de erro
- **MetricCard**: Animações de contagem e mudança
- **Charts**: Graduações uniformes e tooltips customizados

## 📊 Funcionalidades

### Dashboard Geral
- Métricas principais com animações
- Timeline de propostas interativa
- Distribuição por carteiras
- Performance de agências
- Atividade recente

### Análise por Carteiras
- Métricas específicas por carteira
- Gráficos de distribuição
- Tabela detalhada de performance
- Comparações de eficiência

### Performance dos Gerentes
- Ranking completo
- Métricas de produtividade
- Análise de eficiência
- Categorização automática

### Configurações
- Temas dark/light
- Intervalos de atualização
- Preferências de exportação
- Cache e notificações

## 🔧 Configuração

### Variáveis de Ambiente
```bash
# Desenvolvimento
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false

# Produção
VITE_API_BASE_URL=https://api.projetta2.com
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

### Customização de Tema
Edite `tailwind.config.js` para personalizar:
- Cores da aplicação
- Famílias de fontes
- Animações customizadas
- Espaçamentos

## 📱 PWA

O dashboard é uma Progressive Web App que oferece:

- **Instalação**: Pode ser instalado como app nativo
- **Offline**: Funciona sem conexão com dados cached
- **Performance**: Carregamento rápido com Service Worker
- **Notificações**: Alertas push para atualizações

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy pasta dist/
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 Desenvolvimento

### Adicionando Novos Componentes
```typescript
// components/ui/MyComponent.tsx
import React from 'react'
import { clsx } from 'clsx'

interface MyComponentProps {
  // Props aqui
}

const MyComponent: React.FC<MyComponentProps> = ({ ...props }) => {
  return <div className="...">...</div>
}

export default MyComponent
```

### Novos Gráficos
```typescript
// components/charts/MyChart.tsx
import React from 'react'
import { motion } from 'framer-motion'

const MyChart: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Seu gráfico aqui */}
    </motion.div>
  )
}

export default MyChart
```

### Customização de Store
```typescript
// hooks/useStore.ts
export const useStore = create<MyStore>()(
  persist(
    (set, get) => ({
      // Sua lógica de estado
    }),
    { name: 'my-store' }
  )
)
```

## 🐛 Troubleshooting

### Problemas Comuns

**Build falha:**
```bash
# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Verificar tipos
npm run type-check
```

**Tailwind não aplicando:**
```bash
# Verificar se classes estão sendo purged
npx tailwindcss --watch
```

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando React, TypeScript e Tailwind CSS**
