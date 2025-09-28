import pandas as pd
import streamlit as st
from datetime import datetime
import locale
import os

def load_and_process_data():
    """Load and process the credit proposals CSV data"""
    
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
        raise FileNotFoundError("Arquivo CSV não encontrado. Verifique se 'attached_assets/lista_propostas_S670.csv' existe.")
    
    # Read CSV with proper encoding
    try:
        df = pd.read_csv(csv_path, encoding='utf-8', sep=';')
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(csv_path, encoding='latin-1', sep=';')
        except:
            df = pd.read_csv(csv_path, encoding='cp1252', sep=';')
    
    # Clean column names (remove BOM if present)
    df.columns = df.columns.str.replace('\ufeff', '')
    
    # Convert valor to numeric, handling different decimal separators
    if 'valor' in df.columns:
        df['valor'] = df['valor'].astype(str).str.replace(',', '.')
        df['valor'] = pd.to_numeric(df['valor'], errors='coerce')
    
    # Convert date columns to datetime
    date_columns = ['dataCriacao', 'dataProjecao', 'dataSolicitacao', 'dataPriorizacao']
    for col in date_columns:
        if col in df.columns:
            # Handle different date formats
            df[col] = pd.to_datetime(df[col], format='%d-%m-%Y %H:%M:%S', errors='coerce')
            if df[col].isna().all():
                df[col] = pd.to_datetime(df[col], errors='coerce')
    
    # Convert numeric columns
    numeric_columns = [
        'diasTarefa', 'totalDiasAgencia', 'totalDiasCentral', 
        'totalDiasComite', 'totalDiasGeral', 'codigoSuperEstadual'
    ]
    
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Clean text columns
    text_columns = [
        'nomeCliente', 'nomeAgencia', 'tarefa', 'agenciaCentral',
        'programaCredito', 'acompanhamento', 'nomeCentral', 'statusPrioridade',
        'nomeSuperEstadual', 'gerenteResponsavel', 'carteiraNegocio'
    ]
    
    for col in text_columns:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            df[col] = df[col].replace('nan', pd.NA)
    
    # Remove rows with invalid or zero values
    df = df[df['valor'] > 0]
    
    # Add derived columns
    if 'dataCriacao' in df.columns and not df['dataCriacao'].isna().all():
        df['mesAno'] = df['dataCriacao'].dt.to_period('M')
        df['ano'] = df['dataCriacao'].dt.year
        df['mes'] = df['dataCriacao'].dt.month
    
    # Clean manager names (extract only the name part before the code)
    if 'gerenteResponsavel' in df.columns:
        df['gerenteNome'] = df['gerenteResponsavel'].str.split(' - ').str[0]
    
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
