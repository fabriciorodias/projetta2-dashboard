#!/bin/bash

# 🚀 Script de inicialização para macOS - Dashboard Projetta2
# Detecta automaticamente a versão do Python e executa o dashboard

echo "🍎 Iniciando Dashboard Projetta2 no macOS..."
echo "================================================"

# Verificar se estamos na pasta correta
if [[ ! -f "app.py" ]]; then
    echo "❌ Erro: Execute este script na pasta do projeto projetta2"
    echo "💡 Tente: cd ~/dev/projetta2 && ./start_dashboard.sh"
    exit 1
fi

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detectar Python disponível
PYTHON_CMD=""
if command_exists python3; then
    PYTHON_CMD="python3"
    echo "✅ Usando: python3"
elif command_exists python; then
    PYTHON_CMD="python"
    echo "✅ Usando: python"
else
    echo "❌ Python não encontrado!"
    echo "💡 Instale Python:"
    echo "   brew install python3"
    echo "   ou baixe de: https://www.python.org/downloads/"
    exit 1
fi

# Verificar versão do Python
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1-2)
echo "📍 Versão do Python: $PYTHON_VERSION"

# Detectar pip
PIP_CMD=""
if command_exists pip3; then
    PIP_CMD="pip3"
elif command_exists pip; then
    PIP_CMD="pip"
else
    PIP_CMD="$PYTHON_CMD -m pip"
fi

echo "📦 Instalando dependências..."
$PIP_CMD install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy

if [[ $? -ne 0 ]]; then
    echo "⚠️  Erro na instalação. Tentando com --user..."
    $PIP_CMD install --user streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy
fi

echo ""
echo "🚀 Iniciando Dashboard..."
echo "🌐 Abra seu navegador em: http://localhost:8501"
echo "⏹️  Para parar: Pressione Ctrl+C"
echo ""

# Executar Streamlit
if command_exists streamlit; then
    streamlit run app.py
else
    $PYTHON_CMD -m streamlit run app.py
fi