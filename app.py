import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import numpy as np
from datetime import datetime, timedelta
from utils import load_and_process_data, format_currency, format_number

# Configure page
st.set_page_config(
    page_title="Dashboard de Propostas de Crédito",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Title
st.title("📊 Dashboard de Propostas de Crédito")
st.markdown("---")

# Load data
@st.cache_data
def load_data():
    return load_and_process_data()

try:
    df = load_data()
    
    # Sidebar filters
    st.sidebar.header("🔍 Filtros")
    
    # Agency filter
    agencies = ['Todos'] + sorted(df['nomeAgencia'].dropna().unique().tolist())
    selected_agency = st.sidebar.selectbox("Agência", agencies)
    
    # Business portfolio filter
    portfolios = ['Todos'] + sorted(df['carteiraNegocio'].dropna().unique().tolist())
    selected_portfolio = st.sidebar.selectbox("Carteira de Negócio", portfolios)
    
    # Status filter
    status_list = ['Todos'] + sorted(df['statusPrioridade'].dropna().unique().tolist())
    selected_status = st.sidebar.selectbox("Status", status_list)
    
    # Manager filter
    managers = ['Todos'] + sorted(df['gerenteResponsavel'].dropna().unique().tolist())
    selected_manager = st.sidebar.selectbox("Gerente", managers)
    
    # Date range filter
    if not df['dataCriacao'].isna().all():
        min_date = df['dataCriacao'].min().date()
        max_date = df['dataCriacao'].max().date()
        
        date_range = st.sidebar.date_input(
            "Período de Criação",
            value=(min_date, max_date),
            min_value=min_date,
            max_value=max_date
        )
    
    # Apply filters
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
    
    # Charts section
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
        
        # Row 3: Process Time Analysis
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
        
        # Row 4: Value Analysis
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
        
        # Interactive table
        st.markdown("---")
        st.subheader("📋 Tabela Interativa")
        
        # Column selection for table
        available_columns = [
            'sicad', 'nomeCliente', 'nomeAgencia', 'valor', 'tarefa', 
            'agenciaCentral', 'diasTarefa', 'dataProjecao', 'programaCredito',
            'nomeCentral', 'dataCriacao', 'statusPrioridade', 'carteiraNegocio',
            'gerenteResponsavel', 'totalDiasGeral'
        ]
        
        selected_columns = st.multiselect(
            "Selecione as colunas para exibir:",
            available_columns,
            default=['sicad', 'nomeCliente', 'nomeAgencia', 'valor', 'carteiraNegocio', 'statusPrioridade']
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
            
            st.dataframe(
                display_df,
                use_container_width=True,
                height=400
            )
            
            # Download button
            csv = filtered_df.to_csv(index=False)
            st.download_button(
                label="📥 Baixar dados filtrados (CSV)",
                data=csv,
                file_name=f"propostas_credito_filtradas_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )
    
    else:
        st.warning("⚠️ Nenhuma proposta encontrada com os filtros aplicados.")
        st.info("Tente ajustar os filtros para ver os dados.")

except Exception as e:
    st.error(f"❌ Erro ao carregar os dados: {str(e)}")
    st.info("Verifique se o arquivo CSV está no formato correto e tente novamente.")

# Footer
st.markdown("---")
st.markdown(
    """
    <div style='text-align: center; color: #666;'>
        Dashboard de Propostas de Crédito | Desenvolvido com Streamlit
    </div>
    """,
    unsafe_allow_html=True
)
