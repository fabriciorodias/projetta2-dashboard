#!/usr/bin/env python3
"""
Script para automatizar o deploy do projeto Projetta2 para GitHub
Configura o repositório, adiciona arquivos e faz o primeiro commit
"""

import os
import subprocess
import sys
from pathlib import Path

def print_step(step, message):
    """Print formatted step message"""
    print(f"\n🔄 PASSO {step}: {message}")
    print("=" * 50)

def run_command(command, description=""):
    """Run shell command and handle errors"""
    try:
        print(f"   Executando: {command}")
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"   ✅ {description or 'Comando executado com sucesso'}")
            if result.stdout.strip():
                print(f"   📤 Output: {result.stdout.strip()}")
            return True
        else:
            print(f"   ❌ Erro: {result.stderr.strip()}")
            return False
            
    except Exception as e:
        print(f"   ❌ Erro ao executar comando: {str(e)}")
        return False

def check_git_installed():
    """Check if git is installed"""
    return run_command("git --version", "Git está instalado")

def initialize_git_repo():
    """Initialize git repository"""
    print_step(1, "Inicializando repositório Git")
    
    if os.path.exists(".git"):
        print("   ℹ️  Repositório Git já existe")
        return True
    
    return run_command("git init", "Repositório inicializado")

def configure_git_user():
    """Configure git user if not configured"""
    print_step(2, "Configurando usuário Git")
    
    # Check if user is already configured
    result = subprocess.run("git config user.name", shell=True, capture_output=True)
    
    if result.returncode != 0:
        print("   ⚙️  Configurando usuário Git...")
        name = input("   Digite seu nome: ")
        email = input("   Digite seu email: ")
        
        run_command(f'git config user.name "{name}"', "Nome configurado")
        run_command(f'git config user.email "{email}"', "Email configurado")
    else:
        print("   ✅ Usuário Git já configurado")
    
    return True

def create_gitignore():
    """Update .gitignore with additional rules"""
    print_step(3, "Configurando .gitignore")
    
    additional_rules = """
# Streamlit
.streamlit/secrets.toml

# MacOS
.DS_Store

# IDE
.vscode/
.idea/

# Logs
*.log
logs/

# Temporary files
*.tmp
*.temp

# Data files (uncomment if data is sensitive)
# attached_assets/*.csv

# Environment variables
.env
.env.local

# Build artifacts
build/
dist/
"""
    
    try:
        with open(".gitignore", "a", encoding="utf-8") as f:
            f.write(additional_rules)
        print("   ✅ .gitignore atualizado")
        return True
    except Exception as e:
        print(f"   ❌ Erro ao atualizar .gitignore: {str(e)}")
        return False

def add_files_to_git():
    """Add files to git staging"""
    print_step(4, "Adicionando arquivos ao Git")
    
    files_to_add = [
        ".",  # Add all files
    ]
    
    for file_path in files_to_add:
        run_command(f"git add {file_path}", f"Adicionado: {file_path}")
    
    return True

def create_initial_commit():
    """Create initial commit"""
    print_step(5, "Criando commit inicial")
    
    commit_message = """🚀 Initial commit: Dashboard Projetta2 v2.0 Enhanced

✨ Features:
- Complete Business Intelligence Dashboard for credit proposals
- Advanced visualizations (Sankey, Treemap, Gauges)
- Smart filtering and pagination
- Automated benchmarks and alerts
- Enhanced data exports (Excel multi-sheet, PDF with charts)
- Professional documentation and setup scripts

🎯 Ready for production use!"""

    return run_command(f'git commit -m "{commit_message}"', "Commit inicial criado")

def show_github_instructions():
    """Show instructions for GitHub setup"""
    print_step(6, "Instruções para GitHub")
    
    print("""
🌐 AGORA VAMOS CONECTAR COM O GITHUB:

1️⃣  CRIAR REPOSITÓRIO NO GITHUB:
   • Acesse: https://github.com/new
   • Nome do repositório: projetta2-dashboard
   • Descrição: "Advanced Business Intelligence Dashboard for Credit Proposals Analysis"
   • Marque como "Public" (ou Private se preferir)
   • NÃO marque "Add README" (já temos um)
   • Clique em "Create repository"

2️⃣  CONECTAR REPOSITÓRIO LOCAL COM GITHUB:
   Depois de criar no GitHub, execute os comandos que aparecerão na tela:
   
   git remote add origin https://github.com/SEU_USUARIO/projetta2-dashboard.git
   git branch -M main
   git push -u origin main

3️⃣  DEPLOY AUTOMÁTICO NO STREAMLIT CLOUD:
   • Acesse: https://share.streamlit.io
   • Clique em "New app"
   • Conecte seu GitHub
   • Selecione o repositório: projetta2-dashboard
   • Main file path: app.py
   • Clique em "Deploy!"

📱 RESULTADO:
   Seu dashboard ficará disponível em: https://SEU_USUARIO-projetta2-dashboard.streamlit.app
   """)

def main():
    """Main execution function"""
    print("🚀 DEPLOY AUTOMÁTICO - GITHUB")
    print("📊 Dashboard Projetta2 v2.0 Enhanced")
    print("=" * 60)
    
    # Check if in correct directory
    if not os.path.exists("app.py"):
        print("❌ Erro: Execute este script na pasta do projeto projetta2")
        print("💡 Navegue para: cd ~/dev/projetta2")
        sys.exit(1)
    
    # Check git installation
    if not check_git_installed():
        print("❌ Git não está instalado!")
        print("💡 Instale com: brew install git")
        sys.exit(1)
    
    # Execute deployment steps
    steps = [
        initialize_git_repo,
        configure_git_user,
        create_gitignore,
        add_files_to_git,
        create_initial_commit,
        show_github_instructions
    ]
    
    for step_func in steps:
        if not step_func():
            print(f"❌ Falha na etapa: {step_func.__name__}")
            sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ REPOSITÓRIO LOCAL CONFIGURADO COM SUCESSO!")
    print("🌐 Siga as instruções acima para conectar com GitHub")
    print("🚀 Depois do GitHub, seu dashboard estará online!")
    print("=" * 60)

if __name__ == "__main__":
    main()