import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
import os
from datetime import datetime, timedelta
import time
from utils import load_and_process_data, format_currency, format_number, generate_pdf_report
from enhanced_utils import (
    create_sankey_diagram, create_treemap, create_gauge_chart,
    advanced_filters_sidebar, apply_advanced_filters, paginate_dataframe,
    export_to_excel_enhanced, create_benchmark_metrics, show_alerts_and_insights,
    auto_refresh_data, create_advanced_pdf_report, validate_data_quality
)

# Configure page
st.set_page_config(
    page_title="Dashboard de Propostas de Crédito",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main > div {
        padding-top: 1rem;
    }
    .stMetric > div > div > div > div {
        font-size: 1rem;
    }
    .reportview-container .main .block-container {
        padding-top: 1rem;
    }
    .stAlert > div {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .sidebar .sidebar-content {
        width: 300px;
    }
</style>
""", unsafe_allow_html=True)

# Title with enhanced styling
st.markdown("""
# 📊 Dashboard de Propostas de Crédito
### *Análise Avançada e Business Intelligence*
""")

# Auto-refresh functionality
refresh_triggered = auto_refresh_data()

st.markdown("---")

# Load data with enhanced caching
@st.cache_data(ttl=300, show_spinner=True)  # Cache for 5 minutes
def load_data():
    """Load data with enhanced error handling and validation"""
    try:
        df = load_and_process_data()
        
        # Validate data quality
        with st.expander("📋 Relatório de Qualidade dos Dados", expanded=False):
            quality_report = validate_data_quality(df)
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Total de Registros", quality_report['total_records'])
                st.metric("Duplicatas", quality_report['duplicates'])
            
            with col2:
                missing_cols = len(quality_report['missing_values'])
                st.metric("Colunas com Dados Faltantes", missing_cols)
                outlier_cols = len(quality_report['outliers'])
                st.metric("Colunas com Outliers", outlier_cols)
            
            with col3:
                if quality_report['recommendations']:
                    st.warning("⚠️ Recomendações:")
                    for rec in quality_report['recommendations']:
                        st.write(f"• {rec}")
        
        return df
        
    except Exception as e:
        st.error(f"❌ Erro ao carregar dados: {str(e)}")
        st.info("💡 Dicas para resolver:")
        st.write("• Verifique se o arquivo CSV existe na pasta 'attached_assets'")
        st.write("• Confirme se o formato do arquivo está correto")
        st.write("• Tente recarregar a página")
        return pd.DataFrame()

try:
    df = load_data()
    
    if df.empty:
        st.stop()
    
    # Sidebar filters with enhanced options
    st.sidebar.header("🔍 Filtros Básicos")
    
    # Basic filters
    agencies = ['Todos'] + sorted(df['nomeAgencia'].dropna().unique().tolist())
    selected_agency = st.sidebar.selectbox(
        "Agência", 
        agencies,
        help="Selecione uma agência específica ou 'Todos' para ver todas"
    )
    
    portfolios = ['Todos'] + sorted(df['carteiraNegocio'].dropna().unique().tolist())
    selected_portfolio = st.sidebar.selectbox(
        "Carteira de Negócio", 
        portfolios,
        help="Filtre por carteira de negócio específica"
    )
    
    status_list = ['Todos'] + sorted(df['statusPrioridade'].dropna().unique().tolist())
    selected_status = st.sidebar.selectbox(
        "Status", 
        status_list,
        help="Filtre por status da proposta"
    )
    
    managers = ['Todos'] + sorted(df['gerenteResponsavel'].dropna().unique().tolist())
    selected_manager = st.sidebar.selectbox(
        "Gerente", 
        managers,
        help="Selecione um gerente específico"
    )
    
    # Date range filter with better handling
    if not df['dataCriacao'].isna().all():
        min_date = df['dataCriacao'].min().date()
        max_date = df['dataCriacao'].max().date()
        
        date_range = st.sidebar.date_input(
            "Período de Criação",
            value=(min_date, max_date),
            min_value=min_date,
            max_value=max_date,
            help="Selecione o período de análise"
        )
    
    # Advanced filters
    st.sidebar.markdown("---")
    advanced_filters = advanced_filters_sidebar(df)
    
    # Apply basic filters
    filtered_df = df.copy()
    
    if selected_agency != 'Todos':
        filtered_df = filtered_df[filtered_df['nomeAgencia'] == selected_agency]
    
    if selected_portfolio != 'Todos':
        filtered_df = filtered_df[filtered_df['carteiraNegocio'] == selected_portfolio]
    
    if selected_status != 'Todos':
        filtered_df = filtered_df[filtered_df['statusPrioridade'] == selected_status]
    
    if selected_manager != 'Todos':
        filtered_df = filtered_df[filtered_df['gerenteResponsavel'] == selected_manager]
    
    if 'date_range' in locals() and len(date_range) == 2:
        start_date, end_date = date_range
        filtered_df = filtered_df[
            (filtered_df['dataCriacao'].dt.date >= start_date) & 
            (filtered_df['dataCriacao'].dt.date <= end_date)
        ]
    
    # Apply advanced filters
    filtered_df = apply_advanced_filters(filtered_df, advanced_filters)
    
    # Calculate benchmarks and show alerts
    benchmarks = create_benchmark_metrics(filtered_df)
    show_alerts_and_insights(filtered_df, benchmarks)
    
    # Portfolio-specific dashboard option
    portfolio_view = st.sidebar.checkbox("🎯 Dashboard por Carteira", help="Exibir análises específicas por carteira de negócio")
    
    if portfolio_view and selected_portfolio != 'Todos':
        # Portfolio-specific KPIs and analysis
        st.header(f"📋 Dashboard: {selected_portfolio}")
        
        # Portfolio-specific metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            total_proposals = len(filtered_df)
            st.metric("Propostas da Carteira", format_number(total_proposals))
        
        with col2:
            total_value = filtered_df['valor'].sum()
            st.metric("Valor Total", format_currency(total_value))
        
        with col3:
            avg_value = filtered_df['valor'].mean() if len(filtered_df) > 0 else 0
            st.metric("Ticket Médio", format_currency(avg_value))
        
        with col4:
            avg_days = filtered_df['totalDiasGeral'].mean() if len(filtered_df) > 0 else 0
            st.metric("Prazo Médio", f"{avg_days:.0f} dias")
        
        st.markdown("---")
        
        # Portfolio-specific analysis
        if len(filtered_df) > 0:
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader(f"🏢 Agências - {selected_portfolio}")
                
                portfolio_agencies = filtered_df.groupby('nomeAgencia').agg({
                    'valor': ['count', 'sum', 'mean'],
                    'totalDiasGeral': 'mean'
                }).reset_index()
                portfolio_agencies.columns = ['agencia', 'qtd', 'valor_total', 'valor_medio', 'prazo_medio']
                portfolio_agencies = portfolio_agencies.sort_values('valor_total', ascending=False)
                
                fig_portfolio_agencies = px.bar(
                    portfolio_agencies.head(10),
                    x='valor_total',
                    y='agencia',
                    orientation='h',
                    title=f"Top 10 Agências - {selected_portfolio}",
                    labels={'valor_total': 'Valor Total', 'agencia': 'Agência'}
                )
                st.plotly_chart(fig_portfolio_agencies, use_container_width=True)
            
            with col2:
                st.subheader(f"👥 Gerentes - {selected_portfolio}")
                
                portfolio_managers = filtered_df.groupby('gerenteResponsavel').agg({
                    'valor': ['count', 'sum', 'mean'],
                    'totalDiasGeral': 'mean'
                }).reset_index()
                portfolio_managers.columns = ['gerente', 'qtd', 'valor_total', 'valor_medio', 'prazo_medio']
                portfolio_managers = portfolio_managers.sort_values('qtd', ascending=False)
                
                # Clean manager names
                portfolio_managers['gerente_nome'] = portfolio_managers['gerente'].str.split(' - ').str[0]
                
                fig_portfolio_managers = px.bar(
                    portfolio_managers.head(10),
                    x='qtd',
                    y='gerente_nome',
                    orientation='h',
                    title=f"Gerentes Mais Ativos - {selected_portfolio}",
                    labels={'qtd': 'Número de Propostas', 'gerente_nome': 'Gerente'}
                )
                st.plotly_chart(fig_portfolio_managers, use_container_width=True)
            
            # Portfolio performance indicators
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.subheader("⚡ Performance de Prazos")
                prazo_stats = {
                    'Menor prazo': f"{filtered_df['totalDiasGeral'].min():.0f} dias",
                    'Maior prazo': f"{filtered_df['totalDiasGeral'].max():.0f} dias",
                    'Mediana': f"{filtered_df['totalDiasGeral'].median():.0f} dias"
                }
                for label, value in prazo_stats.items():
                    st.write(f"**{label}:** {value}")
            
            with col2:
                st.subheader("💰 Performance de Valores")
                valor_stats = {
                    'Menor valor': format_currency(filtered_df['valor'].min()),
                    'Maior valor': format_currency(filtered_df['valor'].max()),
                    'Mediana': format_currency(filtered_df['valor'].median())
                }
                for label, value in valor_stats.items():
                    st.write(f"**{label}:** {value}")
            
            with col3:
                st.subheader("📊 Distribuição de Status")
                status_dist = filtered_df['statusPrioridade'].value_counts()
                fig_status = px.pie(
                    values=status_dist.values,
                    names=status_dist.index,
                    title=f"Status - {selected_portfolio}"
                )
                fig_status.update_layout(height=300)
                st.plotly_chart(fig_status, use_container_width=True)
        
        st.markdown("---")
        
    else:
        # General dashboard
        # Main metrics
        col1, col2, col3, col4 = st.columns(4)
    
        with col1:
            total_proposals = len(filtered_df)
            st.metric("Total de Propostas", format_number(total_proposals))
    
        with col2:
            total_value = filtered_df['valor'].sum()
            st.metric("Valor Total", format_currency(total_value))
        
        with col3:
            avg_value = filtered_df['valor'].mean() if len(filtered_df) > 0 else 0
            st.metric("Valor Médio", format_currency(avg_value))
        
        with col4:
            avg_days = filtered_df['totalDiasGeral'].mean() if len(filtered_df) > 0 else 0
            st.metric("Prazo Médio (dias)", f"{avg_days:.0f}")
        
        st.markdown("---")
        
        # Charts section with enhanced visualizations
        if len(filtered_df) > 0:
            # Row 1: Value by Agency and Portfolio Distribution
            col1, col2 = st.columns(2)
        
            with col1:
                st.subheader("💰 Valores por Agência")
                agency_values = filtered_df.groupby('nomeAgencia')['valor'].sum().sort_values(ascending=False).head(10)
                
                fig_agency = px.bar(
                    x=agency_values.values,
                    y=agency_values.index,
                    orientation='h',
                    labels={'x': 'Valor (R$)', 'y': 'Agência'},
                    title="Top 10 Agências por Valor"
                )
                fig_agency.update_layout(height=400)
                st.plotly_chart(fig_agency, use_container_width=True)
            
            with col2:
                st.subheader("🥧 Distribuição por Carteira")
                portfolio_dist = filtered_df['carteiraNegocio'].value_counts()
                
                fig_portfolio = px.pie(
                    values=portfolio_dist.values,
                    names=portfolio_dist.index,
                    title="Distribuição por Carteira de Negócio"
                )
                fig_portfolio.update_layout(height=400)
                st.plotly_chart(fig_portfolio, use_container_width=True)
            
            # Row 1.5: Advanced Visualizations
            st.markdown("---")
            st.subheader("📊 Visualizações Avançadas")
            
            col1, col2 = st.columns(2)
            
            with col1:
                # Sankey Diagram
                sankey_fig = create_sankey_diagram(filtered_df)
                if sankey_fig:
                    st.plotly_chart(sankey_fig, use_container_width=True)
            
            with col2:
                # Treemap
                treemap_fig = create_treemap(filtered_df)
                if treemap_fig:
                    st.plotly_chart(treemap_fig, use_container_width=True)
            
            # Row 2: Performance Gauges
            st.markdown("---")
            st.subheader("🎯 Indicadores de Performance")
            
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                avg_days = filtered_df['totalDiasGeral'].mean()
                max_days = filtered_df['totalDiasGeral'].max()
                gauge_days = create_gauge_chart(
                    avg_days, 
                    "Prazo Médio (dias)", 
                    max_days,
                    thresholds=[0.3, 0.6, 0.8]
                )
                st.plotly_chart(gauge_days, use_container_width=True)
            
            with col2:
                efficiency_score = (len(filtered_df[filtered_df['totalDiasGeral'] < benchmarks.get('good_days', float('inf'))]) / len(filtered_df)) * 100
                gauge_efficiency = create_gauge_chart(
                    efficiency_score,
                    "Eficiência (%)",
                    100,
                    thresholds=[0.4, 0.7, 0.9]
                )
                st.plotly_chart(gauge_efficiency, use_container_width=True)
            
            with col3:
                portfolio_diversity = filtered_df['carteiraNegocio'].nunique()
                max_diversity = df['carteiraNegocio'].nunique()
                gauge_diversity = create_gauge_chart(
                    portfolio_diversity,
                    "Diversidade de Carteiras",
                    max_diversity,
                    thresholds=[0.3, 0.6, 0.9]
                )
                st.plotly_chart(gauge_diversity, use_container_width=True)
            
            with col4:
                value_concentration = (filtered_df['valor'].max() / filtered_df['valor'].sum()) * 100
                gauge_concentration = create_gauge_chart(
                    100 - value_concentration,  # Inverted to show distribution
                    "Distribuição de Valores (%)",
                    100,
                    thresholds=[0.3, 0.6, 0.8]
                )
                st.plotly_chart(gauge_concentration, use_container_width=True)
        
        # Row 2: Managers and Timeline
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("👥 Gerentes com Mais Propostas")
            manager_counts = filtered_df['gerenteResponsavel'].value_counts().head(10)
            
            fig_managers = px.bar(
                x=manager_counts.values,
                y=[name.split(' - ')[0] for name in manager_counts.index],
                orientation='h',
                labels={'x': 'Número de Propostas', 'y': 'Gerente'},
                title="Top 10 Gerentes por Número de Propostas"
            )
            fig_managers.update_layout(height=400)
            st.plotly_chart(fig_managers, use_container_width=True)
        
        with col2:
            st.subheader("📈 Timeline de Propostas")
            if not filtered_df['dataCriacao'].isna().all():
                timeline_data = filtered_df.groupby(filtered_df['dataCriacao'].dt.date).size()
                
                fig_timeline = px.line(
                    x=timeline_data.index,
                    y=timeline_data.values,
                    labels={'x': 'Data', 'y': 'Número de Propostas'},
                    title="Propostas Criadas por Data"
                )
                fig_timeline.update_layout(height=400)
                st.plotly_chart(fig_timeline, use_container_width=True)
        
        # Row 3: Temporal Analysis and Seasonality
        st.markdown("---")
        st.subheader("📅 Análise Temporal e Sazonalidade")
        
        if not filtered_df['dataCriacao'].isna().all():
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("📊 Tendências Mensais")
                
                # Monthly aggregation
                monthly_data = filtered_df.groupby(filtered_df['dataCriacao'].dt.to_period('M')).agg({
                    'valor': ['count', 'sum', 'mean'],
                    'totalDiasGeral': 'mean'
                }).reset_index()
                
                monthly_data.columns = ['mes', 'qtd_propostas', 'valor_total', 'valor_medio', 'prazo_medio']
                monthly_data['mes'] = monthly_data['mes'].dt.to_timestamp()
                
                fig_monthly = make_subplots(
                    rows=2, cols=1,
                    subplot_titles=('Quantidade e Valor Total', 'Valor Médio e Prazo Médio'),
                    specs=[[{"secondary_y": True}], [{"secondary_y": True}]]
                )
                
                # Top subplot - Quantidade e Valor Total
                fig_monthly.add_trace(
                    go.Scatter(x=monthly_data['mes'], y=monthly_data['qtd_propostas'],
                             name='Qtd Propostas', line=dict(color='blue')),
                    row=1, col=1
                )
                fig_monthly.add_trace(
                    go.Scatter(x=monthly_data['mes'], y=monthly_data['valor_total']/1e6,
                             name='Valor Total (Mi)', yaxis='y2', line=dict(color='green')),
                    row=1, col=1, secondary_y=True
                )
                
                # Bottom subplot - Valor Médio e Prazo Médio
                fig_monthly.add_trace(
                    go.Scatter(x=monthly_data['mes'], y=monthly_data['valor_medio']/1e6,
                             name='Valor Médio (Mi)', line=dict(color='orange')),
                    row=2, col=1
                )
                fig_monthly.add_trace(
                    go.Scatter(x=monthly_data['mes'], y=monthly_data['prazo_medio'],
                             name='Prazo Médio (dias)', yaxis='y4', line=dict(color='red')),
                    row=2, col=1, secondary_y=True
                )
                
                fig_monthly.update_layout(height=500, title_text="Análise Temporal Mensal")
                st.plotly_chart(fig_monthly, use_container_width=True)
            
            with col2:
                st.subheader("🗓️ Padrões Sazonais")
                
                # Seasonal patterns - by month and day of week
                seasonal_month = filtered_df.groupby(filtered_df['dataCriacao'].dt.month).agg({
                    'valor': ['count', 'mean'],
                    'totalDiasGeral': 'mean'
                }).reset_index()
                seasonal_month.columns = ['mes', 'qtd', 'valor_medio', 'prazo_medio']
                
                month_names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                             'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
                seasonal_month['mes_nome'] = seasonal_month['mes'].apply(lambda x: month_names[x-1])
                
                fig_seasonal = make_subplots(
                    rows=2, cols=1,
                    subplot_titles=('Quantidade por Mês', 'Prazo Médio por Mês')
                )
                
                fig_seasonal.add_trace(
                    go.Bar(x=seasonal_month['mes_nome'], y=seasonal_month['qtd'],
                          name='Qtd Propostas', marker_color='lightblue'),
                    row=1, col=1
                )
                
                fig_seasonal.add_trace(
                    go.Bar(x=seasonal_month['mes_nome'], y=seasonal_month['prazo_medio'],
                          name='Prazo Médio', marker_color='lightcoral'),
                    row=2, col=1
                )
                
                fig_seasonal.update_layout(height=500, title_text="Padrões Sazonais")
                st.plotly_chart(fig_seasonal, use_container_width=True)
                
                # Day of week analysis
                dow_data = filtered_df.groupby(filtered_df['dataCriacao'].dt.dayofweek).agg({
                    'valor': 'count',
                    'totalDiasGeral': 'mean'
                }).reset_index()
                dow_names = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
                dow_data['dia_semana'] = dow_data['dataCriacao'].apply(lambda x: dow_names[x])
                
                st.metric("Dia com mais propostas", f"{dow_names[dow_data.loc[dow_data['valor'].idxmax(), 'dataCriacao']]}")
        else:
            st.info("Dados de datas não disponíveis para análise temporal")
        
        # Row 4: Process Time Analysis
        st.subheader("⏱️ Análise de Prazos")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Dias Médios na Agência", f"{filtered_df['totalDiasAgencia'].mean():.0f}")
            fig_agency_days = px.histogram(
                filtered_df,
                x='totalDiasAgencia',
                title="Distribuição - Dias na Agência",
                nbins=20
            )
            fig_agency_days.update_layout(height=300)
            st.plotly_chart(fig_agency_days, use_container_width=True)
        
        with col2:
            st.metric("Dias Médios na Central", f"{filtered_df['totalDiasCentral'].mean():.0f}")
            fig_central_days = px.histogram(
                filtered_df,
                x='totalDiasCentral',
                title="Distribuição - Dias na Central",
                nbins=20
            )
            fig_central_days.update_layout(height=300)
            st.plotly_chart(fig_central_days, use_container_width=True)
        
        with col3:
            st.metric("Dias Médios no Comitê", f"{filtered_df['totalDiasComite'].mean():.0f}")
            fig_committee_days = px.histogram(
                filtered_df,
                x='totalDiasComite',
                title="Distribuição - Dias no Comitê",
                nbins=20
            )
            fig_committee_days.update_layout(height=300)
            st.plotly_chart(fig_committee_days, use_container_width=True)
        
        # Row 5: Correlation Analysis
        st.subheader("📊 Análise de Correlação")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("🔥 Correlação: Valores vs Prazos")
            
            # Create correlation matrix for numeric columns
            numeric_cols = ['valor', 'totalDiasAgencia', 'totalDiasCentral', 'totalDiasComite', 'totalDiasGeral', 'diasTarefa']
            available_cols = [col for col in numeric_cols if col in filtered_df.columns and not filtered_df[col].isna().all()]
            
            if len(available_cols) >= 2:
                corr_matrix = filtered_df[available_cols].corr()
                
                # Create heatmap
                fig_corr = px.imshow(
                    corr_matrix,
                    text_auto=True,
                    aspect="auto",
                    title="Matriz de Correlação - Valores e Prazos",
                    color_continuous_scale='RdBu_r'
                )
                fig_corr.update_layout(height=400)
                st.plotly_chart(fig_corr, use_container_width=True)
            else:
                st.info("Dados insuficientes para análise de correlação")
        
        with col2:
            st.subheader("💰 Valor vs Prazo Total")
            
            if 'valor' in filtered_df.columns and 'totalDiasGeral' in filtered_df.columns:
                # Create scatter plot
                fig_scatter = px.scatter(
                    filtered_df,
                    x='totalDiasGeral',
                    y='valor',
                    color='carteiraNegocio',
                    size='valor',
                    hover_data=['nomeCliente', 'nomeAgencia'],
                    title="Valor da Proposta vs Prazo Total de Aprovação",
                    labels={'totalDiasGeral': 'Prazo Total (dias)', 'valor': 'Valor (R$)'}
                )
                fig_scatter.update_layout(height=400)
                st.plotly_chart(fig_scatter, use_container_width=True)
                
                # Calculate correlation coefficient
                correlation = filtered_df['valor'].corr(filtered_df['totalDiasGeral'])
                if not pd.isna(correlation):
                    st.metric("Correlação Valor-Prazo", f"{correlation:.3f}")
            else:
                st.info("Dados de valor ou prazo não disponíveis")

        # Row 6: Value Analysis
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("💼 Valores por Carteira")
            portfolio_values = filtered_df.groupby('carteiraNegocio')['valor'].sum().sort_values(ascending=False)
            
            fig_portfolio_values = px.bar(
                x=portfolio_values.values,
                y=portfolio_values.index,
                orientation='h',
                labels={'x': 'Valor Total (R$)', 'y': 'Carteira'},
                title="Valor Total por Carteira de Negócio"
            )
            fig_portfolio_values.update_layout(height=400)
            st.plotly_chart(fig_portfolio_values, use_container_width=True)
        
        with col2:
            st.subheader("🏢 Valores por Central")
            central_values = filtered_df.groupby('nomeCentral')['valor'].sum().sort_values(ascending=False)
            
            fig_central_values = px.bar(
                x=central_values.values,
                y=central_values.index,
                orientation='h',
                labels={'x': 'Valor Total (R$)', 'y': 'Central'},
                title="Valor Total por Central"
            )
            fig_central_values.update_layout(height=400)
            st.plotly_chart(fig_central_values, use_container_width=True)
        
        # Row 7: Performance Indicators and Manager Alerts
        st.markdown("---")
        st.subheader("⚡ Indicadores de Performance por Gerente")
        
        if len(filtered_df) > 0 and not filtered_df['gerenteResponsavel'].isna().all():
            # Calculate manager performance metrics
            manager_performance = filtered_df.groupby('gerenteResponsavel').agg({
                'valor': ['count', 'sum', 'mean'],
                'totalDiasGeral': ['mean', 'std'],
                'totalDiasAgencia': 'mean',
                'totalDiasCentral': 'mean'
            }).reset_index()
            
            manager_performance.columns = [
                'gerente', 'qtd_propostas', 'valor_total', 'valor_medio',
                'prazo_medio', 'prazo_desvio', 'prazo_agencia', 'prazo_central'
            ]
            
            # Clean manager names
            manager_performance['gerente_nome'] = manager_performance['gerente'].str.split(' - ').str[0]
            
            # Calculate performance scores
            manager_performance['produtividade'] = (
                manager_performance['qtd_propostas'] / manager_performance['qtd_propostas'].max() * 100
            )
            
            manager_performance['eficiencia_prazo'] = (
                (manager_performance['prazo_medio'].max() - manager_performance['prazo_medio']) /
                manager_performance['prazo_medio'].max() * 100
            ).fillna(0)
            
            manager_performance['score_geral'] = (
                manager_performance['produtividade'] * 0.6 + manager_performance['eficiencia_prazo'] * 0.4
            )
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.subheader("🏆 Top Performers")
                
                top_performers = manager_performance.nlargest(10, 'score_geral')
                
                fig_top_performers = px.bar(
                    top_performers,
                    x='score_geral',
                    y='gerente_nome',
                    orientation='h',
                    title="Top 10 Gerentes - Score Geral",
                    labels={'score_geral': 'Score de Performance', 'gerente_nome': 'Gerente'},
                    color='score_geral',
                    color_continuous_scale='Viridis'
                )
                fig_top_performers.update_layout(height=400)
                st.plotly_chart(fig_top_performers, use_container_width=True)
            
            with col2:
                st.subheader("⏱️ Eficiência de Prazo")
                
                fig_efficiency = px.scatter(
                    manager_performance,
                    x='qtd_propostas',
                    y='prazo_medio',
                    size='valor_total',
                    color='eficiencia_prazo',
                    hover_data=['gerente_nome'],
                    title="Quantidade vs Prazo Médio por Gerente",
                    labels={
                        'qtd_propostas': 'Quantidade de Propostas',
                        'prazo_medio': 'Prazo Médio (dias)',
                        'eficiencia_prazo': 'Eficiência (%)'
                    },
                    color_continuous_scale='RdYlGn'
                )
                fig_efficiency.update_layout(height=400)
                st.plotly_chart(fig_efficiency, use_container_width=True)
            
            with col3:
                st.subheader("📊 Distribuição de Performance")
                
                # Performance categories
                manager_performance['categoria'] = pd.cut(
                    manager_performance['score_geral'],
                    bins=[0, 30, 60, 100],
                    labels=['Precisa Melhorar', 'Bom', 'Excelente']
                )
                
                perf_dist = manager_performance['categoria'].value_counts()
                
                fig_dist = px.pie(
                    values=perf_dist.values,
                    names=perf_dist.index,
                    title="Distribuição de Performance dos Gerentes",
                    color_discrete_map={
                        'Precisa Melhorar': '#ff4444',
                        'Bom': '#ffaa44',
                        'Excelente': '#44aa44'
                    }
                )
                fig_dist.update_layout(height=400)
                st.plotly_chart(fig_dist, use_container_width=True)
            
            # Performance alerts and recommendations
            st.markdown("---")
            st.subheader("🚨 Alertas e Recomendações")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("⚠️ Alertas de Performance")
                
                # Low performance alerts
                low_performers = manager_performance[manager_performance['score_geral'] < 30]
                high_delay = manager_performance[manager_performance['prazo_medio'] > manager_performance['prazo_medio'].quantile(0.8)]
                low_productivity = manager_performance[manager_performance['qtd_propostas'] < 3]
                
                if len(low_performers) > 0:
                    st.warning(f"🔴 **{len(low_performers)} gerente(s)** com performance baixa (score < 30):")
                    for _, manager in low_performers.iterrows():
                        st.write(f"• {manager['gerente_nome']}: {manager['score_geral']:.1f} pontos")
                
                if len(high_delay) > 0:
                    st.warning(f"🟡 **{len(high_delay)} gerente(s)** com prazos acima da média:")
                    for _, manager in high_delay.iterrows():
                        st.write(f"• {manager['gerente_nome']}: {manager['prazo_medio']:.1f} dias")
                
                if len(low_productivity) > 0:
                    st.info(f"📘 **{len(low_productivity)} gerente(s)** com baixa quantidade de propostas:")
                    for _, manager in low_productivity.iterrows():
                        st.write(f"• {manager['gerente_nome']}: {int(manager['qtd_propostas'])} propostas")
            
            with col2:
                st.subheader("💡 Insights e Recomendações")
                
                # Performance insights
                best_performer = manager_performance.loc[manager_performance['score_geral'].idxmax()]
                fastest_processor = manager_performance.loc[manager_performance['prazo_medio'].idxmin()]
                most_productive = manager_performance.loc[manager_performance['qtd_propostas'].idxmax()]
                
                st.success(f"🏆 **Melhor Performance Geral:** {best_performer['gerente_nome']} ({best_performer['score_geral']:.1f} pontos)")
                st.success(f"⚡ **Mais Rápido:** {fastest_processor['gerente_nome']} ({fastest_processor['prazo_medio']:.1f} dias)")
                st.success(f"📈 **Mais Produtivo:** {most_productive['gerente_nome']} ({int(most_productive['qtd_propostas'])} propostas)")
                
                # Recommendations
                st.write("**Recomendações:**")
                st.write("• Organizar treinamento para gerentes com performance baixa")
                st.write("• Compartilhar melhores práticas dos top performers")
                st.write("• Revisar processos com gerentes que têm prazos elevados")
                st.write("• Estabelecer metas baseadas nos benchmarks dos melhores")
            
            # Detailed performance table
            st.markdown("---")
            st.subheader("📊 Tabela Detalhada de Performance")
            
            display_performance = manager_performance[[
                'gerente_nome', 'qtd_propostas', 'valor_total', 'valor_medio',
                'prazo_medio', 'produtividade', 'eficiencia_prazo', 'score_geral', 'categoria'
            ]].copy()
            
            display_performance['valor_total'] = display_performance['valor_total'].apply(format_currency)
            display_performance['valor_medio'] = display_performance['valor_medio'].apply(format_currency)
            display_performance['prazo_medio'] = display_performance['prazo_medio'].round(1)
            display_performance['produtividade'] = display_performance['produtividade'].round(1)
            display_performance['eficiencia_prazo'] = display_performance['eficiencia_prazo'].round(1)
            display_performance['score_geral'] = display_performance['score_geral'].round(1)
            
            display_performance.columns = [
                'Gerente', 'Qtd Propostas', 'Valor Total', 'Valor Médio',
                'Prazo Médio (dias)', 'Produtividade (%)', 'Eficiência (%)', 'Score Geral', 'Categoria'
            ]
            
            st.dataframe(
                display_performance.sort_values('Score Geral', ascending=False),
                use_container_width=True,
                height=300
            )
        
        else:
            st.info("Dados de gerentes não disponíveis para análise de performance.")
        
        # Interactive table with pagination
        st.markdown("---")
        st.subheader("📋 Tabela Interativa com Paginação")
        
        # Column selection for table
        available_columns = [
            'sicad', 'nomeCliente', 'nomeAgencia', 'valor', 'tarefa', 
            'agenciaCentral', 'diasTarefa', 'dataProjecao', 'programaCredito',
            'nomeCentral', 'dataCriacao', 'statusPrioridade', 'carteiraNegocio',
            'gerenteResponsavel', 'totalDiasGeral'
        ]
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            selected_columns = st.multiselect(
                "Selecione as colunas para exibir:",
                available_columns,
                default=['sicad', 'nomeCliente', 'nomeAgencia', 'valor', 'carteiraNegocio', 'statusPrioridade'],
                help="Escolha quais colunas deseja visualizar na tabela"
            )
        
        with col2:
            page_size = st.selectbox(
                "Registros por página:",
                [10, 20, 50, 100],
                index=1,
                help="Número de registros a exibir por página"
            )
        
        if selected_columns:
            display_df = filtered_df[selected_columns].copy()
            
            # Format currency columns
            if 'valor' in selected_columns:
                display_df['valor'] = display_df['valor'].apply(lambda x: format_currency(x))
            
            # Format date columns
            date_columns = ['dataCriacao', 'dataProjecao', 'dataSolicitacao', 'dataPriorizacao']
            for col in date_columns:
                if col in selected_columns and col in display_df.columns:
                    display_df[col] = display_df[col].dt.strftime('%d/%m/%Y %H:%M')
            
            # Add search functionality
            search_term = st.text_input(
                "🔍 Buscar na tabela:",
                placeholder="Digite qualquer termo para buscar...",
                help="Busca em todas as colunas visíveis"
            )
            
            if search_term:
                # Search across all visible columns
                mask = display_df.astype(str).apply(
                    lambda x: x.str.lower().str.contains(search_term.lower(), na=False)
                ).any(axis=1)
                display_df = display_df[mask]
            
            # Show total results
            st.info(f"📊 Exibindo {len(display_df)} de {len(filtered_df)} registros")
            
            # Pagination
            paginated_df, start_idx, end_idx = paginate_dataframe(display_df, page_size)
            
            if len(paginated_df) > 0:
                st.dataframe(
                    paginated_df,
                    use_container_width=True,
                    height=400
                )
                
                # Pagination info
                st.caption(f"Mostrando registros {start_idx + 1} a {end_idx} de {len(display_df)}")
            else:
                st.warning("🔍 Nenhum registro encontrado com os critérios de busca.")
            
            # Enhanced export options
            st.markdown("---")
            st.subheader("📥 Opções de Exportação")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                # CSV Export
                csv = filtered_df.to_csv(index=False)
                st.download_button(
                    label="📄 Baixar CSV",
                    data=csv,
                    file_name=f"propostas_credito_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv",
                    help="Download dos dados filtrados em formato CSV"
                )
            
            with col2:
                # Enhanced Excel Export
                if st.button("📊 Gerar Excel Avançado", help="Excel com múltiplas abas e análises"):
                    with st.spinner("Gerando Excel avançado..."):
                        try:
                            filters_applied = {
                                'Agência': selected_agency,
                                'Carteira': selected_portfolio,
                                'Status': selected_status,
                                'Gerente': selected_manager
                            }
                            
                            excel_data = export_to_excel_enhanced(filtered_df, filters_applied)
                            
                            if excel_data:
                                st.download_button(
                                    label="📥 Download Excel",
                                    data=excel_data,
                                    file_name=f"relatorio_completo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx",
                                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                )
                                st.success("✅ Excel avançado gerado!")
                        except Exception as e:
                            st.error(f"❌ Erro ao gerar Excel: {str(e)}")
            
            with col3:
                # Enhanced PDF Report
                if st.button("📄 Relatório PDF Avançado", help="Relatório PDF com gráficos e análises"):
                    with st.spinner("Gerando relatório PDF avançado..."):
                        try:
                            filters_applied = {
                                'Agência': selected_agency,
                                'Carteira': selected_portfolio,
                                'Status': selected_status,
                                'Gerente': selected_manager
                            }
                            
                            pdf_filename = f"relatorio_avancado_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
                            pdf_path = create_advanced_pdf_report(filtered_df, filters_applied, pdf_filename)
                            
                            # Read the PDF file
                            with open(pdf_path, "rb") as pdf_file:
                                pdf_bytes = pdf_file.read()
                            
                            st.download_button(
                                label="📥 Download PDF",
                                data=pdf_bytes,
                                file_name=pdf_filename,
                                mime="application/pdf"
                            )
                            
                            st.success("✅ Relatório PDF avançado gerado!")
                            
                            # Clean up
                            try:
                                os.remove(pdf_path)
                            except:
                                pass
                                
                        except Exception as e:
                            st.error(f"❌ Erro ao gerar PDF: {str(e)}")
                            st.info("💡 Verifique se há dados suficientes e tente novamente.")
        
        else:
            st.warning("⚠️ Nenhuma proposta encontrada com os filtros aplicados.")
            st.info("💡 **Sugestões:**")
            st.write("• Tente ajustar os filtros para ampliar a busca")
            st.write("• Verifique se as datas selecionadas estão corretas")
            st.write("• Experimente remover alguns filtros avançados")
            
            # Show summary of available data
            st.subheader("📊 Resumo dos Dados Disponíveis")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Total de Registros", len(df))
                st.metric("Agências Disponíveis", df['nomeAgencia'].nunique())
            
            with col2:
                st.metric("Carteiras Disponíveis", df['carteiraNegocio'].nunique())
                st.metric("Gerentes Ativos", df['gerenteResponsavel'].nunique())
            
            with col3:
                if not df['dataCriacao'].isna().all():
                    date_range_available = f"{df['dataCriacao'].min().strftime('%d/%m/%Y')} - {df['dataCriacao'].max().strftime('%d/%m/%Y')}"
                    st.metric("Período Disponível", date_range_available)

except FileNotFoundError:
    st.error("❌ **Arquivo de dados não encontrado!**")
    st.info("💡 **Instruções para resolver:**")
    st.write("1. Verifique se o arquivo `lista_propostas_S670.csv` existe na pasta `attached_assets/`")
    st.write("2. Confirme se o nome do arquivo está correto")
    st.write("3. Se necessário, faça upload do arquivo na pasta correta")
    
except pd.errors.EmptyDataError:
    st.error("❌ **Arquivo de dados está vazio!**")
    st.info("💡 Verifique se o arquivo CSV contém dados válidos")
    
except pd.errors.ParserError as e:
    st.error("❌ **Erro ao processar o arquivo CSV!**")
    st.info(f"💡 Detalhes do erro: {str(e)}")
    st.write("**Possíveis soluções:**")
    st.write("• Verifique se o separador usado é ';' (ponto e vírgula)")
    st.write("• Confirme se o encoding do arquivo está correto (UTF-8 ou Latin-1)")
    st.write("• Verifique se há caracteres especiais mal formatados")
    
except Exception as e:
    st.error(f"❌ **Erro inesperado:** {str(e)}")
    st.info("💡 **Suporte técnico:**")
    st.write("• Tente recarregar a página")
    st.write("• Verifique sua conexão com a internet")
    st.write("• Se o problema persistir, contate o administrador do sistema")
    
    # Debug information for developers
    with st.expander("🔧 Informações de Debug (Desenvolvedores)", expanded=False):
        st.code(f"""
        Erro: {type(e).__name__}
        Mensagem: {str(e)}
        Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        """)

# Footer with enhanced information
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: #666; padding: 20px;'>
        <h4>📊 Dashboard de Propostas de Crédito</h4>
        <p>Sistema avançado de Business Intelligence para análise de propostas bancárias</p>
        <p><strong>Versão:</strong> 2.0 Enhanced | <strong>Última atualização:</strong> {}</p>
        <p>Desenvolvido com ❤️ usando <a href="https://streamlit.io" target="_blank">Streamlit</a>, 
        <a href="https://plotly.com" target="_blank">Plotly</a> e 
        <a href="https://pandas.pydata.org" target="_blank">Pandas</a></p>
        <hr style="width: 50%; margin: 20px auto;">
        <p><small>💡 Para suporte técnico ou sugestões, consulte a documentação no README.md</small></p>
    </div>
    """.format(datetime.now().strftime('%d/%m/%Y')),
    unsafe_allow_html=True
)
