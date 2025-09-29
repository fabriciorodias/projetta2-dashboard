# 🚀 Guia de Instalação e Execução - Dashboard Projetta2

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### 🐍 Python 3.11+
```bash
# Verificar se Python está instalado
python --version
# ou
python3 --version

# Deve retornar algo como: Python 3.11.x ou superior
```

**Se não tiver Python instalado:**
- **Windows**: [Baixar do site oficial](https://www.python.org/downloads/)
- **macOS**: `brew install python3` ou baixar do site oficial
- **Linux**: `sudo apt install python3 python3-pip` (Ubuntu/Debian)

### 📦 pip (Gerenciador de Pacotes)
```bash
# Verificar se pip está instalado
pip --version
# ou
pip3 --version
```

---

## 🛠️ Instalação Passo a Passo

### 1️⃣ **Navegue até a pasta do projeto**
```bash
# Substitua pelo caminho correto no seu computador
cd /caminho/para/projetta2

# Exemplo no Windows:
# cd C:\Users\SeuUsuario\Documents\projetta2

# Exemplo no macOS/Linux:
# cd ~/Documents/projetta2
```

### 2️⃣ **Instale as dependências**

#### Opção A: Com pip (Recomendado)
```bash
# Instalar todas as dependências de uma vez
pip install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy

# OU usando o arquivo requirements.txt
pip install -r requirements.txt
```

#### Opção B: Com pip3 (se pip não funcionar)
```bash
pip3 install streamlit pandas plotly numpy openpyxl fpdf2 matplotlib seaborn scipy
```

### 3️⃣ **Verificar se os dados estão no lugar correto**
```bash
# Verificar se o arquivo CSV existe
ls attached_assets/lista_propostas_S670.csv

# No Windows:
# dir attached_assets\lista_propostas_S670.csv
```

### 4️⃣ **Executar o Dashboard**
```bash
# Comando principal para executar
streamlit run app.py

# Se não funcionar, tente:
python -m streamlit run app.py

# Ou no Python3:
python3 -m streamlit run app.py
```

---

## 🎯 Execução Rápida (Comandos Diretos)

### Windows (PowerShell/CMD)
```cmd
cd C:\caminho\para\projetta2
pip install -r requirements.txt
streamlit run app.py
```

### macOS/Linux (Terminal)
```bash
cd /caminho/para/projetta2
pip3 install -r requirements.txt
streamlit run app.py
```

---

## 🌐 Acessar o Dashboard

Depois de executar o comando, você verá algo como:

```
You can now view your Streamlit app in your browser.

Local URL: http://localhost:8501
Network URL: http://192.168.x.x:8501
```

1. **Abra seu navegador** (Chrome, Firefox, Safari, Edge)
2. **Digite o endereço**: `http://localhost:8501`
3. **Pronto!** O dashboard será carregado

---

## 🔧 Resolução de Problemas Comuns

### ❌ Erro: "streamlit: comando não encontrado"
**Solução:**
```bash
# Instalar Streamlit especificamente
pip install streamlit

# Ou tentar com caminho completo do Python
python -m pip install streamlit
python -m streamlit run app.py
```

### ❌ Erro: "No module named 'pandas'" (ou outro módulo)
**Solução:**
```bash
# Instalar o módulo específico que está faltando
pip install pandas plotly numpy openpyxl

# Ou instalar tudo de uma vez
pip install -r requirements.txt
```

### ❌ Erro: "FileNotFoundError: attached_assets/lista_propostas_S670.csv"
**Solução:**
1. Verificar se você está na pasta correta do projeto
2. Verificar se a pasta `attached_assets` existe
3. Verificar se o arquivo CSV está dentro da pasta

```bash
# Verificar estrutura
ls -la
ls attached_assets/

# No Windows:
# dir
# dir attached_assets\
```

### ❌ Erro: "Permission denied" ou "Access denied"
**Solução:**
```bash
# No Linux/macOS, dar permissão de execução
chmod +x app.py

# Ou executar como administrador no Windows
# Executar PowerShell "Como Administrador"
```

### ❌ Erro: "Port 8501 is already in use"
**Solução:**
```bash
# Usar uma porta diferente
streamlit run app.py --server.port 8502

# Ou matar processos que estão usando a porta 8501
# No Windows: netstat -ano | findstr 8501
# No Linux/macOS: lsof -ti:8501 | xargs kill -9
```

---

## 🚀 Execução com Diferentes Opções

### 🎛️ Porta Personalizada
```bash
streamlit run app.py --server.port 8502
# Depois acesse: http://localhost:8502
```

### 🌐 Acesso de Outros Computadores na Rede
```bash
streamlit run app.py --server.address 0.0.0.0
# Depois outros computadores podem acessar via seu IP local
```

### 🔧 Modo de Desenvolvimento (com auto-reload)
```bash
streamlit run app.py --server.runOnSave true
# Recarrega automaticamente quando você salva mudanças no código
```

---

## 🧪 Validar Instalação

Execute o script de validação para ter certeza de que tudo está funcionando:

```bash
python validate_improvements.py
```

Se tudo estiver OK, você verá:
```
🎉 ALL VALIDATIONS PASSED (6/6)
✅ Dashboard is ready for use!
```

---

## 📱 Acesso via Dispositivos Móveis

1. **Execute o dashboard** com acesso de rede:
```bash
streamlit run app.py --server.address 0.0.0.0
```

2. **Descubra seu IP local**:
```bash
# Windows:
ipconfig

# macOS/Linux:
ifconfig | grep inet
```

3. **Acesse do celular/tablet**: `http://SEU_IP_LOCAL:8501`

---

## 🔄 Atualizar o Projeto

Se você fez mudanças no código e quer ver as alterações:

```bash
# O Streamlit detecta mudanças automaticamente
# Apenas salve o arquivo e ele recarregará sozinho

# Ou force um refresh apertando 'R' no navegador
# Ou use Ctrl+F5 (Windows) / Cmd+Shift+R (macOS)
```

---

## 🐳 Execução com Docker (Opcional Avançado)

Se preferir usar Docker:

```dockerfile
# Criar arquivo Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.port", "8501", "--server.address", "0.0.0.0"]
```

```bash
# Construir e executar
docker build -t projetta2 .
docker run -p 8501:8501 projetta2
```

---

## 📞 Suporte e Dicas

### 💡 Dicas de Performance
- **Feche outras abas** do navegador para melhor performance
- **Use Chrome ou Firefox** para melhor compatibilidade
- **Deixe o terminal aberto** enquanto usa o dashboard

### 🆘 Se nada funcionar
1. **Reinicie o computador**
2. **Reinstale o Python** (versão mais recente)
3. **Use um ambiente virtual**:
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate     # Windows

pip install -r requirements.txt
streamlit run app.py
```

### 📧 Logs de Erro
Se encontrar erros, os logs aparecem no terminal onde você executou o comando. Copie e cole esses logs para conseguir ajuda específica.

---

## ✅ Checklist Final

- [ ] Python 3.11+ instalado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Arquivo CSV na pasta `attached_assets/`
- [ ] Executando `streamlit run app.py`
- [ ] Acessando `http://localhost:8501`
- [ ] Dashboard carregando sem erros

**🎉 Pronto! Seu Dashboard Projetta2 está funcionando!**

---

*Precisa de mais ajuda? Verifique os logs de erro no terminal ou execute o script de validação para diagnóstico automático.*