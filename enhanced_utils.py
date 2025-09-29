"""
Enhanced utilities for the Credit Proposals Dashboard
Provides advanced visualizations, filtering, and data processing capabilities
"""

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
import streamlit as st
from datetime import datetime, timedelta
import io
import base64
from fpdf import FPDF
import matplotlib.pyplot as plt
import seaborn as sns
import tempfile
import os

def create_sankey_diagram(df):
    """Create a Sankey diagram showing the flow from Portfolio -> Agency -> Status"""
    try:
        # Prepare data for Sankey
        portfolio_agency = df.groupby(['carteiraNegocio', 'nomeAgencia']).size().reset_index(name='count')
        agency_status = df.groupby(['nomeAgencia', 'statusPrioridade']).size().reset_index(name='count')
        
        # Create unique labels
        portfolios = df['carteiraNegocio'].unique()
        agencies = df['nomeAgencia'].unique()
        statuses = df['statusPrioridade'].unique()
        
        all_labels = list(portfolios) + list(agencies) + list(statuses)
        
        # Create mapping
        label_dict = {label: i for i, label in enumerate(all_labels)}
        
        # Prepare sources, targets, and values
        sources = []
        targets = []
        values = []
        
        # Portfolio -> Agency connections
        for _, row in portfolio_agency.iterrows():
            sources.append(label_dict[row['carteiraNegocio']])
            targets.append(label_dict[row['nomeAgencia']])
            values.append(row['count'])
        
        # Agency -> Status connections
        for _, row in agency_status.iterrows():
            sources.append(label_dict[row['nomeAgencia']])
            targets.append(label_dict[row['statusPrioridade']])
            values.append(row['count'])
        
        fig = go.Figure(data=[go.Sankey(
            node=dict(
                pad=15,
                thickness=20,
                line=dict(color="black", width=0.5),
                label=all_labels,
                color="rgba(135, 206, 250, 0.8)"
            ),
            link=dict(
                source=sources,
                target=targets,
                value=values,
                color="rgba(135, 206, 250, 0.3)"
            )
        )])
        
        fig.update_layout(
            title_text="Fluxo: Carteira → Agência → Status",
            font_size=12,
            height=600
        )
        
        return fig
    
    except Exception as e:
        st.error(f"Erro ao criar diagrama Sankey: {str(e)}")
        return None

def create_treemap(df):
    """Create a treemap visualization for portfolios and agencies"""
    try:
        # Prepare hierarchical data
        treemap_data = df.groupby(['carteiraNegocio', 'nomeAgencia']).agg({
            'valor': ['sum', 'count'],
            'totalDiasGeral': 'mean'
        }).reset_index()
        
        treemap_data.columns = ['portfolio', 'agencia', 'valor_total', 'quantidade', 'prazo_medio']
        
        fig = px.treemap(
            treemap_data,
            path=[px.Constant("Propostas"), 'portfolio', 'agencia'],
            values='valor_total',
            color='prazo_medio',
            hover_data=['quantidade'],
            color_continuous_scale='RdYlBu_r',
            title="Distribuição Hierárquica: Carteiras → Agências"
        )
        
        fig.update_traces(textinfo="label+value")
        fig.update_layout(height=600)
        
        return fig
    
    except Exception as e:
        st.error(f"Erro ao criar treemap: {str(e)}")
        return None

def create_gauge_chart(value, title, max_value, thresholds=None):
    """Create a gauge chart for performance metrics"""
    if thresholds is None:
        thresholds = [0.3, 0.7, 1.0]
    
    fig = go.Figure(go.Indicator(
        mode="gauge+number+delta",
        value=value,
        domain={'x': [0, 1], 'y': [0, 1]},
        title={'text': title},
        delta={'reference': max_value * 0.8},
        gauge={
            'axis': {'range': [None, max_value]},
            'bar': {'color': "darkblue"},
            'steps': [
                {'range': [0, max_value * thresholds[0]], 'color': "lightgray"},
                {'range': [max_value * thresholds[0], max_value * thresholds[1]], 'color': "gray"}
            ],
            'threshold': {
                'line': {'color': "red", 'width': 4},
                'thickness': 0.75,
                'value': max_value * thresholds[2]
            }
        }
    ))
    
    fig.update_layout(height=300)
    return fig

def advanced_filters_sidebar(df):
    """Create advanced filtering options in sidebar"""
    st.sidebar.markdown("### 🔍 Filtros Avançados")
    
    filters = {}
    
    # Value range filter
    if 'valor' in df.columns and not df['valor'].isna().all():
        min_val = float(df['valor'].min())
        max_val = float(df['valor'].max())
        
        value_range = st.sidebar.slider(
            "Faixa de Valores (R$)",
            min_value=min_val,
            max_value=max_val,
            value=(min_val, max_val),
            step=(max_val - min_val) / 100,
            format="%.0f",
            help="Selecione a faixa de valores das propostas"
        )
        filters['valor_range'] = value_range
    
    # Days range filter
    if 'totalDiasGeral' in df.columns and not df['totalDiasGeral'].isna().all():
        min_days = int(df['totalDiasGeral'].min())
        max_days = int(df['totalDiasGeral'].max())
        
        days_range = st.sidebar.slider(
            "Faixa de Prazo (dias)",
            min_value=min_days,
            max_value=max_days,
            value=(min_days, max_days),
            help="Selecione a faixa de prazos em dias"
        )
        filters['days_range'] = days_range
    
    # Multiple selection filters
    if 'carteiraNegocio' in df.columns:
        portfolios = df['carteiraNegocio'].dropna().unique().tolist()
        selected_portfolios = st.sidebar.multiselect(
            "Múltiplas Carteiras",
            options=portfolios,
            default=portfolios,
            help="Selecione uma ou mais carteiras"
        )
        filters['portfolios'] = selected_portfolios
    
    if 'statusPrioridade' in df.columns:
        statuses = df['statusPrioridade'].dropna().unique().tolist()
        selected_statuses = st.sidebar.multiselect(
            "Múltiplos Status",
            options=statuses,
            default=statuses,
            help="Selecione um ou mais status"
        )
        filters['statuses'] = selected_statuses
    
    # Text search
    search_term = st.sidebar.text_input(
        "🔍 Busca por Cliente",
        placeholder="Digite parte do nome do cliente...",
        help="Busca textual no nome do cliente"
    )
    if search_term:
        filters['search_term'] = search_term
    
    return filters

def apply_advanced_filters(df, filters):
    """Apply advanced filters to dataframe"""
    filtered_df = df.copy()
    
    # Apply value range filter
    if 'valor_range' in filters:
        min_val, max_val = filters['valor_range']
        filtered_df = filtered_df[
            (filtered_df['valor'] >= min_val) & 
            (filtered_df['valor'] <= max_val)
        ]
    
    # Apply days range filter
    if 'days_range' in filters:
        min_days, max_days = filters['days_range']
        filtered_df = filtered_df[
            (filtered_df['totalDiasGeral'] >= min_days) & 
            (filtered_df['totalDiasGeral'] <= max_days)
        ]
    
    # Apply multiple portfolios filter
    if 'portfolios' in filters and filters['portfolios']:
        filtered_df = filtered_df[
            filtered_df['carteiraNegocio'].isin(filters['portfolios'])
        ]
    
    # Apply multiple statuses filter
    if 'statuses' in filters and filters['statuses']:
        filtered_df = filtered_df[
            filtered_df['statusPrioridade'].isin(filters['statuses'])
        ]
    
    # Apply text search
    if 'search_term' in filters:
        search_term = filters['search_term'].lower()
        filtered_df = filtered_df[
            filtered_df['nomeCliente'].str.lower().str.contains(search_term, na=False)
        ]
    
    return filtered_df

def paginate_dataframe(df, page_size=20):
    """Add pagination to dataframe display"""
    if len(df) == 0:
        return df, 0, 0
    
    # Calculate total pages
    total_pages = (len(df) - 1) // page_size + 1
    
    # Create pagination controls
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        page = st.selectbox(
            "Página",
            range(1, total_pages + 1),
            format_func=lambda x: f"Página {x} de {total_pages}"
        )
    
    # Calculate start and end indices
    start_idx = (page - 1) * page_size
    end_idx = min(start_idx + page_size, len(df))
    
    # Return paginated dataframe
    return df.iloc[start_idx:end_idx], start_idx, end_idx

def export_to_excel_enhanced(df, filters_applied):
    """Enhanced Excel export with multiple sheets"""
    try:
        output = io.BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Main data sheet
            df.to_excel(writer, sheet_name='Dados_Principais', index=False)
            
            # Summary sheet
            summary_stats = {
                'Métrica': [
                    'Total de Propostas',
                    'Valor Total (R$)',
                    'Valor Médio (R$)',
                    'Prazo Médio (dias)',
                    'Número de Clientes',
                    'Número de Agências',
                    'Número de Gerentes'
                ],
                'Valor': [
                    len(df),
                    df['valor'].sum(),
                    df['valor'].mean(),
                    df['totalDiasGeral'].mean(),
                    df['nomeCliente'].nunique(),
                    df['nomeAgencia'].nunique(),
                    df['gerenteResponsavel'].nunique()
                ]
            }
            summary_df = pd.DataFrame(summary_stats)
            summary_df.to_excel(writer, sheet_name='Resumo', index=False)
            
            # Portfolio analysis sheet
            portfolio_analysis = df.groupby('carteiraNegocio').agg({
                'valor': ['count', 'sum', 'mean'],
                'totalDiasGeral': ['mean', 'std'],
                'nomeCliente': 'nunique'
            }).round(2)
            portfolio_analysis.columns = ['Qtd_Propostas', 'Valor_Total', 'Valor_Medio', 
                                        'Prazo_Medio', 'Prazo_Desvio', 'Clientes_Unicos']
            portfolio_analysis.to_excel(writer, sheet_name='Analise_Carteiras')
            
            # Agency analysis sheet
            agency_analysis = df.groupby('nomeAgencia').agg({
                'valor': ['count', 'sum', 'mean'],
                'totalDiasGeral': 'mean'
            }).round(2)
            agency_analysis.columns = ['Qtd_Propostas', 'Valor_Total', 'Valor_Medio', 'Prazo_Medio']
            agency_analysis.to_excel(writer, sheet_name='Analise_Agencias')
            
            # Manager analysis sheet
            if not df['gerenteResponsavel'].isna().all():
                manager_analysis = df.groupby('gerenteResponsavel').agg({
                    'valor': ['count', 'sum', 'mean'],
                    'totalDiasGeral': 'mean'
                }).round(2)
                manager_analysis.columns = ['Qtd_Propostas', 'Valor_Total', 'Valor_Medio', 'Prazo_Medio']
                manager_analysis.to_excel(writer, sheet_name='Analise_Gerentes')
            
            # Filters applied sheet
            if filters_applied:
                filters_df = pd.DataFrame([
                    {'Filtro': k, 'Valor': str(v)} for k, v in filters_applied.items()
                ])
                filters_df.to_excel(writer, sheet_name='Filtros_Aplicados', index=False)
        
        return output.getvalue()
    
    except Exception as e:
        st.error(f"Erro ao gerar Excel: {str(e)}")
        return None

def create_benchmark_metrics(df):
    """Create benchmark metrics and comparisons"""
    benchmarks = {}
    
    if len(df) > 0:
        # Calculate benchmarks
        benchmarks['avg_value'] = df['valor'].mean()
        benchmarks['median_value'] = df['valor'].median()
        benchmarks['avg_days'] = df['totalDiasGeral'].mean()
        benchmarks['median_days'] = df['totalDiasGeral'].median()
        
        # Performance thresholds (these could come from historical data)
        benchmarks['excellent_days'] = benchmarks['avg_days'] * 0.7  # 30% better than average
        benchmarks['good_days'] = benchmarks['avg_days'] * 0.9       # 10% better than average
        benchmarks['poor_days'] = benchmarks['avg_days'] * 1.2       # 20% worse than average
        
        benchmarks['high_value'] = benchmarks['median_value'] * 2     # Double the median
        benchmarks['low_value'] = benchmarks['median_value'] * 0.5    # Half the median
    
    return benchmarks

def show_alerts_and_insights(df, benchmarks):
    """Display automated alerts and insights"""
    alerts = []
    insights = []
    
    if len(df) > 0:
        # Performance alerts
        slow_proposals = df[df['totalDiasGeral'] > benchmarks.get('poor_days', float('inf'))]
        if len(slow_proposals) > 0:
            alerts.append(f"🚨 {len(slow_proposals)} proposta(s) com prazo acima do aceitável")
        
        high_value_proposals = df[df['valor'] > benchmarks.get('high_value', float('inf'))]
        if len(high_value_proposals) > 0:
            insights.append(f"💰 {len(high_value_proposals)} proposta(s) de alto valor requerem atenção especial")
        
        # Portfolio insights
        portfolio_performance = df.groupby('carteiraNegocio')['totalDiasGeral'].mean()
        fastest_portfolio = portfolio_performance.idxmin()
        slowest_portfolio = portfolio_performance.idxmax()
        
        insights.append(f"⚡ Carteira mais eficiente: {fastest_portfolio}")
        insights.append(f"🐌 Carteira que precisa melhorar: {slowest_portfolio}")
        
        # Manager insights
        if not df['gerenteResponsavel'].isna().all():
            manager_performance = df.groupby('gerenteResponsavel').agg({
                'totalDiasGeral': 'mean',
                'valor': 'count'
            })
            
            top_manager = manager_performance['valor'].idxmax()
            insights.append(f"🏆 Gerente mais produtivo: {top_manager.split(' - ')[0]}")
    
    # Display alerts
    if alerts:
        st.subheader("🚨 Alertas Importantes")
        for alert in alerts:
            st.warning(alert)
    
    # Display insights
    if insights:
        st.subheader("💡 Insights Automáticos")
        for insight in insights:
            st.info(insight)

def auto_refresh_data():
    """Add auto-refresh functionality"""
    col1, col2 = st.columns([3, 1])
    
    with col1:
        refresh_interval = st.selectbox(
            "Auto-refresh",
            options=[0, 30, 60, 300],
            format_func=lambda x: "Desabilitado" if x == 0 else f"A cada {x}s",
            help="Atualização automática dos dados"
        )
    
    with col2:
        manual_refresh = st.button("🔄 Atualizar Agora", help="Atualizar dados manualmente")
    
    if refresh_interval > 0:
        # Use Streamlit's built-in rerun capability
        if manual_refresh:
            st.rerun()
        
        # This would need additional implementation for true auto-refresh
        # For now, we'll show the option but manual refresh only
        st.info(f"Auto-refresh configurado para {refresh_interval}s (requer refresh manual)")
    
    return manual_refresh

def create_advanced_pdf_report(df, filters_applied, filename="relatorio_avancado.pdf"):
    """Create an enhanced PDF report with more charts and analysis"""
    from fpdf import FPDF
    import matplotlib.pyplot as plt
    import seaborn as sns
    from datetime import datetime
    import tempfile
    import os
    
    # Set matplotlib backend for headless environment
    plt.switch_backend('Agg')
    
    class AdvancedPDFReport(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 16)
            self.cell(0, 10, 'Relatório Avançado - Propostas de Crédito', 0, 1, 'C')
            self.set_font('Arial', '', 10)
            self.cell(0, 10, f'Gerado em: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}', 0, 1, 'C')
            self.ln(10)
        
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')
        
        def chapter_title(self, title):
            self.set_font('Arial', 'B', 14)
            self.cell(0, 10, title, 0, 1)
            self.ln(5)
        
        def chapter_body(self, body):
            self.set_font('Arial', '', 11)
            for line in body.split('\n'):
                if line.strip():
                    self.cell(0, 6, line.strip(), 0, 1)
            self.ln()
    
    pdf = AdvancedPDFReport()
    pdf.add_page()
    
    try:
        # Executive summary with enhanced metrics
        benchmarks = create_benchmark_metrics(df)
        
        pdf.chapter_title('1. RESUMO EXECUTIVO')
        
        summary_text = f"""
        • Total de Propostas Analisadas: {len(df):,}
        • Valor Total das Propostas: R$ {df['valor'].sum():,.2f}
        • Valor Médio por Proposta: R$ {df['valor'].mean():,.2f}
        • Valor Mediano: R$ {df['valor'].median():,.2f}
        • Prazo Médio de Processamento: {df['totalDiasGeral'].mean():.1f} dias
        • Prazo Mediano: {df['totalDiasGeral'].median():.0f} dias
        • Número de Clientes Únicos: {df['nomeCliente'].nunique():,}
        • Número de Agências Envolvidas: {df['nomeAgencia'].nunique():,}
        • Número de Gerentes Ativos: {df['gerenteResponsavel'].nunique():,}
        • Período de Análise: {df['dataCriacao'].min().strftime('%d/%m/%Y') if not df['dataCriacao'].isna().all() else 'N/A'} a {df['dataCriacao'].max().strftime('%d/%m/%Y') if not df['dataCriacao'].isna().all() else 'N/A'}
        """
        
        pdf.chapter_body(summary_text)
        
        # Performance indicators
        pdf.chapter_title('2. INDICADORES DE PERFORMANCE')
        
        performance_text = f"""
        • Propostas com Prazo Excelente (< {benchmarks.get('excellent_days', 0):.0f} dias): {len(df[df['totalDiasGeral'] < benchmarks.get('excellent_days', 0)]):,}
        • Propostas com Prazo Bom (< {benchmarks.get('good_days', 0):.0f} dias): {len(df[df['totalDiasGeral'] < benchmarks.get('good_days', 0)]):,}
        • Propostas com Prazo Ruim (> {benchmarks.get('poor_days', float('inf')):.0f} dias): {len(df[df['totalDiasGeral'] > benchmarks.get('poor_days', float('inf'))]):,}
        • Propostas de Alto Valor (> R$ {benchmarks.get('high_value', 0):,.0f}): {len(df[df['valor'] > benchmarks.get('high_value', float('inf'))]):,}
        • Taxa de Eficiência Geral: {(len(df[df['totalDiasGeral'] < benchmarks.get('good_days', float('inf'))]) / len(df) * 100):.1f}%
        """
        
        pdf.chapter_body(performance_text)
        
        # Generate enhanced charts
        with tempfile.TemporaryDirectory() as temp_dir:
            # Chart 1: Enhanced portfolio distribution
            plt.figure(figsize=(12, 8))
            
            # Create subplots for multiple views
            fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
            
            # Portfolio by value
            portfolio_values = df.groupby('carteiraNegocio')['valor'].sum().sort_values(ascending=True)
            ax1.barh(range(len(portfolio_values)), portfolio_values.values/1e6)
            ax1.set_yticks(range(len(portfolio_values)))
            ax1.set_yticklabels([name[:15] + '...' if len(name) > 15 else name for name in portfolio_values.index])
            ax1.set_xlabel('Valor Total (Milhões R$)')
            ax1.set_title('Valor Total por Carteira')
            
            # Portfolio by quantity
            portfolio_counts = df['carteiraNegocio'].value_counts()
            ax2.pie(portfolio_counts.values, labels=[name[:10] + '...' if len(name) > 10 else name for name in portfolio_counts.index], autopct='%1.1f%%')
            ax2.set_title('Distribuição por Quantidade')
            
            # Days distribution
            ax3.hist(df['totalDiasGeral'], bins=20, alpha=0.7, color='skyblue', edgecolor='black')
            ax3.axvline(df['totalDiasGeral'].mean(), color='red', linestyle='--', label=f'Média: {df["totalDiasGeral"].mean():.0f} dias')
            ax3.set_xlabel('Dias de Processamento')
            ax3.set_ylabel('Frequência')
            ax3.set_title('Distribuição de Prazos')
            ax3.legend()
            
            # Value vs Days scatter
            ax4.scatter(df['totalDiasGeral'], df['valor']/1e6, alpha=0.6, c=df['carteiraNegocio'].astype('category').cat.codes)
            ax4.set_xlabel('Dias de Processamento')
            ax4.set_ylabel('Valor (Milhões R$)')
            ax4.set_title('Valor vs Prazo')
            
            plt.tight_layout()
            
            chart1_path = os.path.join(temp_dir, 'enhanced_chart1.png')
            plt.savefig(chart1_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            # Add charts to PDF
            pdf.add_page()
            pdf.chapter_title('3. ANÁLISES VISUAIS')
            pdf.image(chart1_path, x=10, y=40, w=190)
            
            # Chart 2: Agency performance heatmap
            if len(df) > 5:  # Only create if we have enough data
                plt.figure(figsize=(12, 8))
                
                # Create agency performance matrix
                agency_metrics = df.groupby('nomeAgencia').agg({
                    'valor': ['count', 'sum', 'mean'],
                    'totalDiasGeral': ['mean', 'std']
                }).round(2)
                
                # Normalize for heatmap
                agency_metrics_norm = agency_metrics.select_dtypes(include=[np.number]).apply(
                    lambda x: (x - x.min()) / (x.max() - x.min()) if x.max() != x.min() else x
                )
                
                plt.figure(figsize=(10, 8))
                sns.heatmap(agency_metrics_norm.T, annot=True, cmap='RdYlBu_r', cbar_kws={'label': 'Performance Normalizada'})
                plt.title('Mapa de Performance por Agência')
                plt.xlabel('Agências')
                plt.ylabel('Métricas')
                plt.xticks(rotation=45, ha='right')
                plt.tight_layout()
                
                chart2_path = os.path.join(temp_dir, 'enhanced_chart2.png')
                plt.savefig(chart2_path, dpi=150, bbox_inches='tight')
                plt.close()
                
                pdf.add_page()
                pdf.image(chart2_path, x=10, y=30, w=190)
    
    except Exception as e:
        # If enhanced charts fail, continue with basic report
        pdf.ln(10)
        pdf.set_font('Arial', 'I', 10)
        pdf.cell(0, 10, f'Gráficos avançados não puderam ser gerados: {str(e)}', 0, 1)
    
    # Save PDF
    pdf_path = filename
    pdf.output(pdf_path, 'F')
    
    return pdf_path

def validate_data_quality(df):
    """Validate and report data quality issues"""
    quality_report = {
        'total_records': len(df),
        'missing_values': {},
        'duplicates': 0,
        'outliers': {},
        'data_types': {},
        'recommendations': []
    }
    
    # Check missing values
    for col in df.columns:
        missing_count = df[col].isnull().sum()
        if missing_count > 0:
            quality_report['missing_values'][col] = {
                'count': missing_count,
                'percentage': (missing_count / len(df)) * 100
            }
    
    # Check duplicates
    if 'sicad' in df.columns:
        quality_report['duplicates'] = df['sicad'].duplicated().sum()
    
    # Check outliers for numeric columns
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if col in df.columns and not df[col].isnull().all():
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
            if len(outliers) > 0:
                quality_report['outliers'][col] = {
                    'count': len(outliers),
                    'percentage': (len(outliers) / len(df)) * 100
                }
    
    # Data type recommendations
    for col in df.columns:
        quality_report['data_types'][col] = str(df[col].dtype)
    
    # Generate recommendations
    if quality_report['missing_values']:
        quality_report['recommendations'].append("Considere tratar valores ausentes nas colunas identificadas")
    
    if quality_report['duplicates'] > 0:
        quality_report['recommendations'].append("Foram encontradas propostas duplicadas - verificar integridade")
    
    if quality_report['outliers']:
        quality_report['recommendations'].append("Outliers identificados - podem indicar erros de dados ou casos especiais")
    
    return quality_report