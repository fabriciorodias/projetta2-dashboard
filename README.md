# 📊 Dashboard de Propostas de Crédito - Projetta2

![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)

[![Deploy to Streamlit Cloud](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/fabriciodias/projetta2-dashboard?style=social)](https://github.com/fabriciodias/projetta2-dashboard/stargazers)

## 🎯 Visão Geral

Dashboard interativo desenvolvido em Python com Streamlit para análise e visualização de propostas de crédito bancário. Oferece análises avançadas, métricas de performance e insights para tomada de decisões estratégicas no setor financeiro.

## ✨ Funcionalidades Principais

### 📈 Análises Disponíveis
- **Dashboard Geral**: Visão consolidada de todas as propostas
- **Dashboard por Carteira**: Análise específica por linha de negócio
- **Análise Temporal**: Trends, sazonalidade e padrões temporais
- **Performance de Gerentes**: Scoring automático e ranking
- **Correlações**: Análise estatística entre valores e prazos
- **Benchmarking**: Comparação com métricas de referência

### 🎨 Visualizações Interativas
- Gráficos de barras horizontais e verticais
- Gráficos de pizza e donut
- Scatter plots com correlações
- Heatmaps de correlação
- Timeline e análise sazonal
- Histogramas de distribuição
- Gráficos Sankey (fluxo de processos)
- Treemaps (distribuição hierárquica)
- Gauges de performance

### 🔍 Filtros e Funcionalidades
- **Filtros Dinâmicos**: Por agência, carteira, status, gerente e período
- **Filtros Avançados**: Ranges de valores, múltipla seleção, busca textual
- **Tabela Interativa**: Com paginação e seleção de colunas
- **Exportações**: CSV, Excel (múltiplas abas) e PDF com gráficos
- **Refresh Automático**: Atualização opcional dos dados
- **Alertas Inteligentes**: Notificações de performance e anomalias

## 🚀 Como Executar

### 🍎 macOS (Método Mais Rápido)
```bash
cd ~/dev/projetta2
python3 run_dashboard.py
# ou
./start_dashboard.sh
```

### 🪟 Windows
```cmd
cd C:\caminho\para\projetta2
python run_dashboard.py
```

### 🐧 Linux
```bash
cd ~/projetta2
python3 run_dashboard.py
```

### 📦 Instalação Manual
```bash
# 1. Instalar dependências
pip install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy

# 2. Executar dashboard
streamlit run app.py
```

### 🌐 Acesso
Depois de executar, acesse: **http://localhost:8501**

## 🐳 Deploy Online

### Streamlit Cloud (Recomendado)
1. Fork este repositório
2. Acesse [Streamlit Cloud](https://share.streamlit.io/)
3. Conecte seu GitHub e selecione o repositório
4. Deploy automático em poucos cliques!

### Heroku
```bash
# Adicione Procfile
echo "web: streamlit run app.py --server.port=$PORT --server.address=0.0.0.0" > Procfile
git add . && git commit -m "Add Procfile"
heroku create seu-app-name
git push heroku main
```

### Railway
```bash
railway login
railway init
railway up
```

## 📂 Estrutura do Projeto

```
projetta2/
├── 📊 app.py                 # Dashboard principal Streamlit
├── 🔧 utils.py               # Funções auxiliares e processamento
├── ✨ enhanced_utils.py      # Funcionalidades avançadas
├── ⚙️  config.py              # Configuração centralizada
├── 📋 requirements.txt       # Dependências Python
├── 📖 README.md              # Esta documentação
├── 📝 CHANGELOG.md           # Histórico de versões
├── 🚀 run_dashboard.py       # Script de execução automática
├── 🍎 start_dashboard.sh     # Script para macOS
├── 🔍 validate_improvements.py # Testes automáticos
├── 📄 LICENSE                # Licença MIT
├── .streamlit/
│   └── config.toml          # Configuração Streamlit
├── attached_assets/
│   └── *.csv                # Arquivos de dados
├── exports/                 # Arquivos exportados
└── .github/
    └── workflows/
        └── deploy.yml       # CI/CD automático
```

## 📊 Dados e Schema

### Estrutura dos Dados
O dashboard trabalha com arquivos CSV contendo as seguintes informações:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| sicad | int | ID único da proposta |
| nomeCliente | string | Nome do cliente |
| nomeAgencia | string | Agência responsável |
| valor | float | Valor da proposta (R$) |
| tarefa | string | Tarefa atual no processo |
| totalDiasGeral | int | Prazo total de processamento |
| carteiraNegocio | string | Linha de negócio |
| gerenteResponsavel | string | Gerente responsável |
| statusPrioridade | string | Status atual da proposta |
| dataCriacao | datetime | Data de criação da proposta |

### Formatos Suportados
- CSV com separador `;` (ponto e vírgula)
- Encoding UTF-8 ou Latin-1
- Formato de datas: DD-MM-YYYY HH:MM:SS

## 🎯 KPIs e Métricas

### Métricas Principais
- **Volume**: Total de propostas e valor financeiro
- **Eficiência**: Prazos médios por etapa do processo
- **Performance**: Scoring de gerentes e agências
- **Qualidade**: Taxa de aprovação e rejeição
- **Produtividade**: Propostas processadas por período

### Benchmarks Automáticos
- Comparação com médias históricas
- Identificação de outliers
- Alertas de performance
- Recomendações automatizadas

## 🔧 Configurações Avançadas

### Personalização de Filtros
No sidebar, você pode:
- Aplicar múltiplos filtros simultaneamente
- Usar ranges de datas e valores
- Busca textual em campos específicos
- Salvar configurações de filtro

### Configuração de Alertas
- Definir thresholds de performance
- Configurar notificações automáticas
- Personalizar métricas de benchmark

### Exportações Customizadas
- Escolher quais dados incluir
- Selecionar formato de saída
- Aplicar filtros na exportação
- Agendar exportações automáticas

## 🤝 Como Contribuir

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código
- Seguir PEP 8 para Python
- Documentar funções complexas
- Adicionar testes para novas funcionalidades
- Manter compatibilidade com versões anteriores

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Integração com APIs bancárias
- [ ] Machine Learning para predição de prazos
- [ ] Dashboard mobile responsivo
- [ ] Autenticação e controle de acesso
- [ ] Versionamento de dados
- [ ] API REST para integração

### Melhorias Planejadas
- [ ] Cache mais inteligente
- [ ] Mais tipos de visualizações
- [ ] Relatórios automatizados
- [ ] Integração com bancos de dados

## 🐛 Problemas Conhecidos

- Encoding de arquivos CSV pode variar
- Performance com datasets muito grandes (>10k registros)
- Alguns navegadores podem ter limitações com gráficos complexos

## 📞 Suporte

Para questões, bugs ou sugestões:
1. Abra uma [Issue](https://github.com/fabriciodias/projetta2-dashboard/issues) no GitHub
2. Consulte a [documentação](https://github.com/fabriciodias/projetta2-dashboard/wiki) do projeto
3. Entre em contato via [LinkedIn](https://linkedin.com/in/fabricio-dias)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🏆 Reconhecimentos

- [Streamlit](https://streamlit.io/) - Framework web
- [Plotly](https://plotly.com/python/) - Visualizações interativas
- [Pandas](https://pandas.pydata.org/) - Manipulação de dados
- [FPDF](https://pyfpdf.readthedocs.io/) - Geração de PDFs

## 🌟 Show Your Support

Se este projeto te ajudou, considere dar uma ⭐ no GitHub!

---

**Desenvolvido com ❤️ para análise de dados bancários**

[![GitHub](https://img.shields.io/badge/GitHub-fabriciodias-181717?style=for-the-badge&logo=github)](https://github.com/fabriciodias)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fabricio_Dias-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/fabricio-dias)