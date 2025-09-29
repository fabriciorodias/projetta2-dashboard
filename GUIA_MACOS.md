# 🍎 Guia Específico para macOS - Dashboard Projetta2

## 🔍 **DIAGNÓSTICO RÁPIDO**

Primeiro, vamos ver o que você tem instalado:

```bash
# Verificar versões do Python disponíveis
which python3
python3 --version

# Verificar se pip3 está disponível
which pip3
pip3 --version
```

---

## 🚀 **SOLUÇÃO RÁPIDA (Copie e Cole)**

### **Opção 1: Usar python3 (Mais Comum)**
```bash
cd ~/dev/projetta2
python3 run_dashboard.py
```

### **Opção 2: Se python3 não funcionar**
```bash
cd ~/dev/projetta2
pip3 install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy
python3 -m streamlit run app.py
```

### **Opção 3: Instalação via Homebrew (Recomendado)**
```bash
# Instalar Homebrew se não tiver
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Python via Homebrew
brew install python3

# Criar alias permanente (opcional)
echo 'alias python=python3' >> ~/.zshrc
echo 'alias pip=pip3' >> ~/.zshrc
source ~/.zshrc

# Agora funcionará:
python run_dashboard.py
```

---

## 💡 **COMANDOS ESPECÍFICOS PARA SEU CASO**

Como você está no diretório correto (`~/dev/projetta2`), execute:

```bash
# 1. Instalar dependências
pip3 install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy

# 2. Executar o launcher
python3 run_dashboard.py

# 3. OU executar diretamente o dashboard
python3 -m streamlit run app.py
```

---

## 🔧 **SE AINDA NÃO FUNCIONAR**

### **Verificar o que está instalado:**
```bash
ls /usr/bin/python*
ls /usr/local/bin/python*
which python3
```

### **Instalar Python via site oficial:**
1. Vá para: https://www.python.org/downloads/macos/
2. Baixe e instale a versão mais recente
3. Reinicie o terminal
4. Tente novamente com `python3`

### **Usando conda (se tiver Anaconda/Miniconda):**
```bash
conda create -n projetta2 python=3.11
conda activate projetta2
pip install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy
streamlit run app.py
```

---

## ⚡ **EXECUÇÃO DIRETA (Bypass)**

Se quiser pular todos os checks e ir direto ao ponto:

```bash
cd ~/dev/projetta2
python3 -m pip install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy
python3 -m streamlit run app.py --server.port 8501
```

Depois acesse: **http://localhost:8501**

---

## 🍎 **ALIASES ÚTEIS PARA macOS**

Adicione ao seu `~/.zshrc` para facilitar no futuro:

```bash
echo 'alias python=python3' >> ~/.zshrc
echo 'alias pip=pip3' >> ~/.zshrc
echo 'alias dashboard="cd ~/dev/projetta2 && python3 -m streamlit run app.py"' >> ~/.zshrc
source ~/.zshrc
```

Depois é só digitar `dashboard` de qualquer lugar! 🚀