import pandas as pd
import streamlit as st
from datetime import datetime
import locale
import os

def load_and_process_data():
    """Load and process the credit proposals CSV data with enhanced error handling"""
    
    # Try to set locale for currency formatting (fallback to default if not available)
    try:
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
    except:
        try:
            locale.setlocale(locale.LC_ALL, 'Portuguese_Brazil.1252')
        except:
            pass  # Use default locale
    
    # Load the CSV file from attached_assets
    csv_path = "attached_assets/lista_propostas_S670.csv"
    
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Arquivo CSV não encontrado: {csv_path}")
    
    # Read CSV with proper encoding - try multiple encodings
    encodings_to_try = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
    df = None
    
    for encoding in encodings_to_try:
        try:
            df = pd.read_csv(csv_path, encoding=encoding, sep=';')
            break
        except UnicodeDecodeError:
            continue
        except Exception as e:
            if encoding == encodings_to_try[-1]:  # Last encoding to try
                raise e
            continue
    
    if df is None:
        raise ValueError("Não foi possível ler o arquivo CSV com nenhum dos encodings testados")
    
    # Validate that we have data
    if df.empty:
        raise pd.errors.EmptyDataError("O arquivo CSV está vazio")
    
    # Clean column names (remove BOM if present)
    df.columns = df.columns.str.replace('\ufeff', '').str.strip()
    
    # Validate required columns
    required_columns = ['sicad', 'nomeCliente', 'nomeAgencia', 'valor']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Colunas obrigatórias ausentes: {missing_columns}")
    
    # Convert valor to numeric, handling different decimal separators
    if 'valor' in df.columns:
        # Handle various formats: 1.234,56 or 1234.56 or 1234,56
        df['valor'] = df['valor'].astype(str).str.replace('.', '', regex=False)  # Remove thousands separator
        df['valor'] = df['valor'].str.replace(',', '.', regex=False)  # Replace decimal comma with dot
        df['valor'] = pd.to_numeric(df['valor'], errors='coerce')
        
        # Remove invalid values
        df = df.dropna(subset=['valor'])
        df = df[df['valor'] > 0]
    
    # Convert date columns to datetime with multiple format attempts
    date_columns = ['dataCriacao', 'dataProjecao', 'dataSolicitacao', 'dataPriorizacao']
    date_formats = [
        '%d-%m-%Y %H:%M:%S',
        '%d/%m/%Y %H:%M:%S',
        '%Y-%m-%d %H:%M:%S',
        '%d-%m-%Y',
        '%d/%m/%Y',
        '%Y-%m-%d'
    ]
    
    for col in date_columns:
        if col in df.columns:
            df[col] = df[col].astype(str)
            parsed_dates = None
            
            for date_format in date_formats:
                try:
                    parsed_dates = pd.to_datetime(df[col], format=date_format, errors='coerce')
                    if not parsed_dates.isna().all():
                        break
                except:
                    continue
            
            if parsed_dates is None or parsed_dates.isna().all():
                # Try pandas automatic parsing as last resort
                try:
                    parsed_dates = pd.to_datetime(df[col], errors='coerce', dayfirst=True)
                except:
                    parsed_dates = pd.NaT
            
            df[col] = parsed_dates
    
    # Convert numeric columns with better error handling
    numeric_columns = [
        'diasTarefa', 'totalDiasAgencia', 'totalDiasCentral', 
        'totalDiasComite', 'totalDiasGeral', 'codigoSuperEstadual'
    ]
    
    for col in numeric_columns:
        if col in df.columns:
            # Handle various numeric formats
            df[col] = df[col].astype(str).str.replace(',', '.', regex=False)
            df[col] = pd.to_numeric(df[col], errors='coerce')
            # Fill negative or invalid days with 0
            if 'Dias' in col:
                df[col] = df[col].fillna(0).clip(lower=0)
    
    # Clean text columns with better handling
    text_columns = [
        'nomeCliente', 'nomeAgencia', 'tarefa', 'agenciaCentral',
        'programaCredito', 'acompanhamento', 'nomeCentral', 'statusPrioridade',
        'nomeSuperEstadual', 'gerenteResponsavel', 'carteiraNegocio'
    ]
    
    for col in text_columns:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace(['nan', 'None', 'null', ''], pd.NA)
            # Clean extra whitespaces
            df[col] = df[col].str.replace(r'\s+', ' ', regex=True)
    
    # Remove completely invalid rows
    df = df.dropna(subset=['sicad', 'nomeCliente', 'valor'])
    
    # Add derived columns
    if 'dataCriacao' in df.columns and not df['dataCriacao'].isna().all():
        df['mesAno'] = df['dataCriacao'].dt.to_period('M')
        df['ano'] = df['dataCriacao'].dt.year
        df['mes'] = df['dataCriacao'].dt.month
        df['diaSemana'] = df['dataCriacao'].dt.dayofweek
        df['nomeDiaSemana'] = df['dataCriacao'].dt.strftime('%A')
    
    # Clean manager names (extract only the name part before the code)
    if 'gerenteResponsavel' in df.columns:
        df['gerenteNome'] = df['gerenteResponsavel'].str.split(' - ').str[0].str.title()
    
    # Add performance categories
    if 'totalDiasGeral' in df.columns and not df['totalDiasGeral'].isna().all():
        df['categoriaPerformance'] = pd.cut(
            df['totalDiasGeral'],
            bins=[0, 30, 60, 90, float('inf')],
            labels=['Rápido', 'Normal', 'Lento', 'Muito Lento'],
            include_lowest=True
        )
    
    # Add value categories
    if 'valor' in df.columns:
        df['categoriaValor'] = pd.cut(
            df['valor'],
            bins=[0, 100000, 1000000, 10000000, float('inf')],
            labels=['Baixo', 'Médio', 'Alto', 'Muito Alto'],
            include_lowest=True
        )
    
    # Final validation
    if len(df) == 0:
        raise ValueError("Nenhum registro válido encontrado após processamento dos dados")
    
    return df

def format_currency(value):
    """Format number as Brazilian currency"""
    if pd.isna(value) or value == 0:
        return "R$ 0,00"
    
    try:
        return f"R$ {value:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
    except:
        return f"R$ {value:,.0f}"

def format_number(value):
    """Format number with thousands separator"""
    if pd.isna(value):
        return "0"
    
    try:
        return f"{value:,}".replace(',', '.')
    except:
        return str(value)

def get_status_color(status):
    """Get color for status"""
    color_map = {
        'EXPIRADA': '#ff4444',
        'EXPIRADA_NAO_ATENDIDA': '#ff6666',
        'EXPIRADA_EXPURGADA': '#ff8888',
        'CANCELADA': '#ffaa44',
        'default': '#44aa44'
    }
    return color_map.get(status, color_map['default'])

def calculate_summary_stats(df):
    """Calculate summary statistics for the dataset"""
    stats = {
        'total_proposals': len(df),
        'total_value': df['valor'].sum(),
        'avg_value': df['valor'].mean(),
        'median_value': df['valor'].median(),
        'avg_days_total': df['totalDiasGeral'].mean(),
        'avg_days_agency': df['totalDiasAgencia'].mean(),
        'avg_days_central': df['totalDiasCentral'].mean(),
        'avg_days_committee': df['totalDiasComite'].mean(),
        'unique_clients': df['nomeCliente'].nunique(),
        'unique_agencies': df['nomeAgencia'].nunique(),
        'unique_managers': df['gerenteResponsavel'].nunique()
    }
    
    return stats

def generate_pdf_report(df, filters_applied, filename="relatorio_propostas.pdf"):
    """Generate a PDF report with summary statistics and charts"""
    from fpdf import FPDF
    import matplotlib.pyplot as plt
    import seaborn as sns
    from datetime import datetime
    import tempfile
    import os
    
    # Set matplotlib backend for headless environment
    plt.switch_backend('Agg')
    
    class PDFReport(FPDF):
        def header(self):
            self.set_font('Arial', 'B', 15)
            self.cell(0, 10, 'Relatório de Propostas de Crédito', 0, 1, 'C')
            self.set_font('Arial', '', 10)
            self.cell(0, 10, f'Gerado em: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}', 0, 1, 'C')
            self.ln(10)
        
        def footer(self):
            self.set_y(-15)
            self.set_font('Arial', 'I', 8)
            self.cell(0, 10, f'Página {self.page_no()}', 0, 0, 'C')
    
    pdf = PDFReport()
    pdf.add_page()
    
    # Summary statistics
    stats = calculate_summary_stats(df)
    
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Resumo Executivo', 0, 1)
    pdf.set_font('Arial', '', 10)
    
    summary_text = f"""
    • Total de Propostas: {format_number(stats['total_proposals'])}
    • Valor Total: {format_currency(stats['total_value'])}
    • Valor Médio: {format_currency(stats['avg_value'])}
    • Prazo Médio Total: {stats['avg_days_total']:.0f} dias
    • Número de Clientes Únicos: {stats['unique_clients']}
    • Número de Agências: {stats['unique_agencies']}
    • Número de Gerentes: {stats['unique_managers']}
    """
    
    for line in summary_text.strip().split('\n'):
        if line.strip():
            pdf.cell(0, 6, line.strip(), 0, 1)
    
    pdf.ln(10)
    
    # Filters applied
    if filters_applied:
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Filtros Aplicados', 0, 1)
        pdf.set_font('Arial', '', 10)
        
        for filter_name, filter_value in filters_applied.items():
            if filter_value != 'Todos' and filter_value:
                pdf.cell(0, 6, f"• {filter_name}: {filter_value}", 0, 1)
        pdf.ln(10)
    
    # Top agencies table
    if len(df) > 0:
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Top 10 Agências por Valor', 0, 1)
        pdf.set_font('Arial', '', 9)
        
        top_agencies = df.groupby('nomeAgencia')['valor'].sum().sort_values(ascending=False).head(10)
        
        # Table header
        pdf.cell(100, 8, 'Agência', 1, 0, 'C')
        pdf.cell(50, 8, 'Valor Total', 1, 1, 'C')
        
        for agency, value in top_agencies.items():
            agency_name = agency[:45] + "..." if len(agency) > 45 else agency
            pdf.cell(100, 8, agency_name, 1)
            pdf.cell(50, 8, format_currency(value), 1, 1, 'R')
        
        pdf.ln(10)
        
        # Portfolio distribution table
        pdf.set_font('Arial', 'B', 12)
        pdf.cell(0, 10, 'Distribuição por Carteira de Negócio', 0, 1)
        pdf.set_font('Arial', '', 9)
        
        portfolio_dist = df.groupby('carteiraNegocio').agg({
            'valor': ['count', 'sum', 'mean']
        }).reset_index()
        portfolio_dist.columns = ['carteira', 'qtd', 'valor_total', 'valor_medio']
        portfolio_dist = portfolio_dist.sort_values('valor_total', ascending=False)
        
        # Table header
        pdf.cell(60, 8, 'Carteira', 1, 0, 'C')
        pdf.cell(30, 8, 'Qtd', 1, 0, 'C')
        pdf.cell(50, 8, 'Valor Total', 1, 0, 'C')
        pdf.cell(50, 8, 'Valor Médio', 1, 1, 'C')
        
        for _, row in portfolio_dist.iterrows():
            carteira_name = row['carteira'][:25] + "..." if len(row['carteira']) > 25 else row['carteira']
            pdf.cell(60, 8, carteira_name, 1)
            pdf.cell(30, 8, str(int(row['qtd'])), 1, 0, 'C')
            pdf.cell(50, 8, format_currency(row['valor_total']), 1, 0, 'R')
            pdf.cell(50, 8, format_currency(row['valor_medio']), 1, 1, 'R')
    
    # Generate charts and save to PDF
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            # Chart 1: Values by Portfolio
            plt.figure(figsize=(10, 6))
            portfolio_values = df.groupby('carteiraNegocio')['valor'].sum().sort_values(ascending=True)
            
            plt.barh(range(len(portfolio_values)), portfolio_values.values/1e6)
            plt.yticks(range(len(portfolio_values)), [name[:20] for name in portfolio_values.index])
            plt.xlabel('Valor Total (Milhões R$)')
            plt.title('Valor Total por Carteira de Negócio')
            plt.tight_layout()
            
            chart1_path = os.path.join(temp_dir, 'chart1.png')
            plt.savefig(chart1_path, dpi=150, bbox_inches='tight')
            plt.close()
            
            # Add chart to PDF
            pdf.add_page()
            pdf.set_font('Arial', 'B', 12)
            pdf.cell(0, 10, 'Gráficos de Análise', 0, 1)
            pdf.image(chart1_path, x=10, y=30, w=190)
            
            # Chart 2: Timeline if dates available
            if not df['dataCriacao'].isna().all():
                plt.figure(figsize=(10, 6))
                timeline_data = df.groupby(df['dataCriacao'].dt.date).size()
                
                plt.plot(timeline_data.index, timeline_data.values, marker='o')
                plt.xlabel('Data de Criação')
                plt.ylabel('Número de Propostas')
                plt.title('Timeline de Criação de Propostas')
                plt.xticks(rotation=45)
                plt.tight_layout()
                
                chart2_path = os.path.join(temp_dir, 'chart2.png')
                plt.savefig(chart2_path, dpi=150, bbox_inches='tight')
                plt.close()
                
                # Add second chart
                pdf.add_page()
                pdf.image(chart2_path, x=10, y=30, w=190)
    
    except Exception as e:
        # If chart generation fails, continue with text-only report
        pdf.ln(10)
        pdf.set_font('Arial', 'I', 10)
        pdf.cell(0, 10, f'Gráficos não puderam ser gerados: {str(e)}', 0, 1)
    
    # Save PDF
    pdf_path = filename
    pdf.output(pdf_path, 'F')
    
    return pdf_path
