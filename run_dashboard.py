#!/usr/bin/env python3
"""
Script auxiliar para executar o Dashboard Projetta2
Facilita a execução e resolve problemas comuns automaticamente
"""

import os
import sys
import subprocess
import importlib.util
from pathlib import Path

def print_banner():
    """Print welcome banner"""
    print("=" * 60)
    print("🚀 DASHBOARD PROJETTA2 - LAUNCHER")
    print("📊 Sistema de Business Intelligence para Propostas de Crédito")
    print("=" * 60)

def check_python_version():
    """Check if Python version is compatible"""
    print("🐍 Verificando versão do Python...")
    
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ é necessário!")
        print(f"   Versão atual: {version.major}.{version.minor}")
        print("   Baixe uma versão mais recente em: https://www.python.org/downloads/")
        return False
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
    return True

def check_required_files():
    """Check if all required files exist"""
    print("\n📁 Verificando arquivos do projeto...")
    
    required_files = [
        "app.py",
        "utils.py", 
        "enhanced_utils.py",
        "config.py",
        "attached_assets/lista_propostas_S670.csv"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
        else:
            print(f"✅ {file_path}")
    
    if missing_files:
        print(f"\n❌ Arquivos ausentes: {missing_files}")
        print("   Certifique-se de estar na pasta correta do projeto!")
        return False
    
    print("✅ Todos os arquivos necessários encontrados")
    return True

def check_dependencies():
    """Check and install required dependencies"""
    print("\n📦 Verificando dependências...")
    
    required_packages = [
        "streamlit",
        "pandas", 
        "plotly",
        "numpy",
        "openpyxl",
        "fpdf2",
        "matplotlib",
        "seaborn"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == "fpdf2":
                # fpdf2 is imported as fpdf
                spec = importlib.util.find_spec("fpdf")
            else:
                spec = importlib.util.find_spec(package)
            
            if spec is None:
                missing_packages.append(package)
            else:
                print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n⚠️  Pacotes ausentes: {missing_packages}")
        print("🔧 Tentando instalar automaticamente...")
        
        try:
            # Try to install missing packages
            for package in missing_packages:
                print(f"   Instalando {package}...")
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
                print(f"✅ {package} instalado")
            
            print("✅ Todas as dependências instaladas com sucesso!")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao instalar dependências: {e}")
            print("\n💡 Tente instalar manualmente:")
            print(f"   pip install {' '.join(missing_packages)}")
            return False
    
    print("✅ Todas as dependências estão instaladas")
    return True

def find_available_port():
    """Find an available port starting from 8501"""
    import socket
    
    for port in range(8501, 8511):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    
    return 8501  # Default fallback

def run_streamlit():
    """Run the Streamlit dashboard"""
    print("\n🚀 Iniciando Dashboard...")
    
    port = find_available_port()
    
    try:
        # Try different ways to run streamlit
        commands = [
            [sys.executable, "-m", "streamlit", "run", "app.py", "--server.port", str(port)],
            ["streamlit", "run", "app.py", "--server.port", str(port)],
            ["python", "-m", "streamlit", "run", "app.py", "--server.port", str(port)]
        ]
        
        for cmd in commands:
            try:
                print(f"   Tentando: {' '.join(cmd)}")
                subprocess.run(cmd, check=True)
                return True
            except (subprocess.CalledProcessError, FileNotFoundError):
                continue
        
        print("❌ Não foi possível executar o Streamlit")
        print("\n💡 Tente executar manualmente:")
        print("   streamlit run app.py")
        print("   ou")
        print("   python -m streamlit run app.py")
        return False
        
    except KeyboardInterrupt:
        print("\n👋 Dashboard interrompido pelo usuário")
        return True
    except Exception as e:
        print(f"❌ Erro ao executar dashboard: {e}")
        return False

def show_access_info(port=8501):
    """Show how to access the dashboard"""
    print(f"\n🌐 Dashboard disponível em:")
    print(f"   Local: http://localhost:{port}")
    print(f"   Rede:  http://0.0.0.0:{port}")
    print("\n💡 Dicas:")
    print("   • Use Chrome ou Firefox para melhor experiência")
    print("   • Mantenha este terminal aberto enquanto usa o dashboard")
    print("   • Pressione Ctrl+C para parar o servidor")

def main():
    """Main execution function"""
    print_banner()
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check if we're in the right directory
    if not check_required_files():
        print("\n💡 Certifique-se de executar este script na pasta do projeto:")
        print("   cd /caminho/para/projetta2")
        print("   python run_dashboard.py")
        sys.exit(1)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Show access information
    show_access_info()
    
    # Run the dashboard
    success = run_streamlit()
    
    if success:
        print("\n✅ Dashboard executado com sucesso!")
    else:
        print("\n❌ Falha ao executar dashboard")
        print("\n🆘 Suporte:")
        print("   1. Verifique se está na pasta correta do projeto")
        print("   2. Execute: pip install -r requirements.txt")
        print("   3. Execute: python validate_improvements.py")
        print("   4. Tente: streamlit run app.py")
        sys.exit(1)

if __name__ == "__main__":
    main()