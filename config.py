"""
Configuration file for the Credit Proposals Dashboard
Contains settings, constants, and configuration parameters
"""

import os
from datetime import timedelta

# Application Configuration
APP_CONFIG = {
    'title': 'Dashboard de Propostas de Crédito',
    'icon': '📊',
    'layout': 'wide',
    'version': '2.0 Enhanced',
    'author': 'Business Intelligence Team',
    'description': 'Sistema avançado para análise de propostas bancárias'
}

# File Paths
PATHS = {
    'data_folder': 'attached_assets',
    'exports_folder': 'exports',
    'csv_filename': 'lista_propostas_S670.csv'
}

# Data Processing Configuration
DATA_CONFIG = {
    'encodings_to_try': ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1'],
    'csv_separator': ';',
    'date_formats': [
        '%d-%m-%Y %H:%M:%S',
        '%d/%m/%Y %H:%M:%S', 
        '%Y-%m-%d %H:%M:%S',
        '%d-%m-%Y',
        '%d/%m/%Y',
        '%Y-%m-%d'
    ],
    'required_columns': ['sicad', 'nomeCliente', 'nomeAgencia', 'valor'],
    'numeric_columns': [
        'diasTarefa', 'totalDiasAgencia', 'totalDiasCentral',
        'totalDiasComite', 'totalDiasGeral', 'codigoSuperEstadual'
    ],
    'date_columns': ['dataCriacao', 'dataProjecao', 'dataSolicitacao', 'dataPriorizacao'],
    'text_columns': [
        'nomeCliente', 'nomeAgencia', 'tarefa', 'agenciaCentral',
        'programaCredito', 'acompanhamento', 'nomeCentral', 'statusPrioridade',
        'nomeSuperEstadual', 'gerenteResponsavel', 'carteiraNegocio'
    ]
}

# Performance Thresholds
PERFORMANCE_THRESHOLDS = {
    'excellent_days_factor': 0.7,  # 30% better than average
    'good_days_factor': 0.9,       # 10% better than average  
    'poor_days_factor': 1.2,       # 20% worse than average
    'high_value_factor': 2.0,      # Double the median
    'low_value_factor': 0.5,       # Half the median
}

# Categories Configuration
CATEGORIES = {
    'performance_days': {
        'bins': [0, 30, 60, 90, float('inf')],
        'labels': ['Rápido', 'Normal', 'Lento', 'Muito Lento']
    },
    'value_ranges': {
        'bins': [0, 100000, 1000000, 10000000, float('inf')],
        'labels': ['Baixo', 'Médio', 'Alto', 'Muito Alto']
    }
}

# Visualization Configuration
VIZ_CONFIG = {
    'color_palette': [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ],
    'status_colors': {
        'EXPIRADA': '#ff4444',
        'EXPIRADA_NAO_ATENDIDA': '#ff6666',
        'EXPIRADA_EXPURGADA': '#ff8888',
        'CANCELADA': '#ffaa44',
        'default': '#44aa44'
    },
    'performance_colors': {
        'excellent': '#44aa44',
        'good': '#ffaa44', 
        'poor': '#ff4444'
    }
}

# Cache Configuration
CACHE_CONFIG = {
    'data_ttl': 300,  # 5 minutes
    'chart_ttl': 180,  # 3 minutes
    'export_ttl': 60   # 1 minute
}

# Export Configuration
EXPORT_CONFIG = {
    'max_records_csv': 100000,
    'max_records_excel': 50000,
    'pagination_sizes': [10, 20, 50, 100],
    'excel_sheets': {
        'main': 'Dados_Principais',
        'summary': 'Resumo',
        'portfolios': 'Analise_Carteiras', 
        'agencies': 'Analise_Agencias',
        'managers': 'Analise_Gerentes',
        'filters': 'Filtros_Aplicados'
    }
}

# UI Configuration  
UI_CONFIG = {
    'sidebar_width': 300,
    'chart_height': 400,
    'table_height': 400,
    'gauge_height': 300,
    'max_items_display': 10,
    'refresh_intervals': [0, 30, 60, 300],  # seconds
    'date_format_display': '%d/%m/%Y %H:%M'
}

# Alert Thresholds
ALERT_CONFIG = {
    'slow_proposals_threshold': 'poor_days',  # Reference to PERFORMANCE_THRESHOLDS
    'high_value_threshold': 'high_value',     # Reference to PERFORMANCE_THRESHOLDS  
    'efficiency_low_threshold': 40,           # Percentage
    'efficiency_good_threshold': 70,          # Percentage
    'diversity_low_threshold': 0.3,           # Factor
    'concentration_high_threshold': 0.5       # Factor
}

# Localization
LOCALE_CONFIG = {
    'currency_symbol': 'R$',
    'thousands_separator': '.',
    'decimal_separator': ',',
    'date_format': '%d/%m/%Y',
    'datetime_format': '%d/%m/%Y %H:%M:%S'
}

# Environment-specific settings
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

if ENVIRONMENT == 'production':
    # Production overrides
    CACHE_CONFIG['data_ttl'] = 600  # 10 minutes in production
    UI_CONFIG['refresh_intervals'] = [0, 60, 300, 900]  # Longer intervals
    
elif ENVIRONMENT == 'development':
    # Development overrides  
    CACHE_CONFIG['data_ttl'] = 60   # 1 minute in development
    
# Helper function to get full file path
def get_data_file_path():
    """Get the full path to the data CSV file"""
    return os.path.join(PATHS['data_folder'], PATHS['csv_filename'])

def get_export_file_path(filename):
    """Get the full path for export files"""
    return os.path.join(PATHS['exports_folder'], filename)

# Validate configuration
def validate_config():
    """Validate configuration settings"""
    errors = []
    
    # Check if required paths exist
    if not os.path.exists(PATHS['data_folder']):
        errors.append(f"Data folder not found: {PATHS['data_folder']}")
    
    # Create exports folder if it doesn't exist
    if not os.path.exists(PATHS['exports_folder']):
        try:
            os.makedirs(PATHS['exports_folder'])
        except Exception as e:
            errors.append(f"Cannot create exports folder: {str(e)}")
    
    # Validate thresholds are reasonable
    if PERFORMANCE_THRESHOLDS['excellent_days_factor'] >= PERFORMANCE_THRESHOLDS['good_days_factor']:
        errors.append("Excellent days factor should be less than good days factor")
    
    return errors

# Initialize configuration validation on import
_config_errors = validate_config()
if _config_errors:
    import warnings
    for error in _config_errors:
        warnings.warn(f"Configuration warning: {error}")