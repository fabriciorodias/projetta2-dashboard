import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { AppLayout } from '../components/layout/AppLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { Card } from '../components/ui/Card';
import { HorizontalBarChart } from '../components/charts/HorizontalBarChart';
import { PieChart } from '../components/charts/PieChart';
import { TimelineChart } from '../components/charts/TimelineChart';
import { groupBy } from '../utils/formatters';
import { Alert } from '../types';

// Dados de exemplo - em produção viriam de uma API
const sampleData = [
  {
    sicad: 17476127,
    nomeCliente: "PROLOG EMPREENDIMENTOS LTDA",
    nomeAgencia: "Salvador Costa Azul",
    valor: 223300000,
    tarefa: "Resolver Ocorrências de Instrumento",
    agenciaCentral: "Agência",
    diasTarefa: 7,
    dataProjecao: new Date("2025-10-22"),
    programaCredito: "FONTE GENERICA/CONCESSAO LIM CRED ALI FID IMV (653)",
    acompanhamento: "Continua aguardando o atendimento de pré-contratuais.",
    nomeCentral: "EMPRESARIAL II",
    dataCriacao: new Date("2025-06-06"),
    statusPrioridade: "",
    nomeSuperEstadual: "SUPERINTENDENCIA ESTADUAL DA BAHIA",
    codigoSuperEstadual: 770,
    dataSolicitacao: new Date("2025-06-06"),
    dataPriorizacao: new Date("2025-06-06"),
    totalDiasAgencia: 24,
    totalDiasCentral: 35,
    totalDiasComite: 0,
    totalDiasGeral: 59,
    gerenteResponsavel: "ROSEMARY SILVA SANTOS DE BRAGA - F80667",
    carteiraNegocio: "CORPORATE",
    gerenteNome: "ROSEMARY SILVA SANTOS DE BRAGA",
    categoriaPerformance: "Normal" as const,
    categoriaValor: "Muito Alto" as const,
    diaSemana: 5,
    nomeDiaSemana: "Sexta",
    mesAno: "2025-06",
    ano: 2025,
    mes: 6
  },
  {
    sicad: 2682541,
    nomeCliente: "JOAO ANTONIO FRANCIOSI",
    nomeAgencia: "Luis Eduardo Magalhaes",
    valor: 200150000,
    tarefa: "Registrar Resultado de Resolução das Ocorrências de Instrução",
    agenciaCentral: "Central",
    diasTarefa: 21,
    dataProjecao: new Date("2025-10-16"),
    programaCredito: "",
    acompanhamento: "",
    nomeCentral: "AGRONEGOCIO II",
    dataCriacao: new Date("2025-08-25"),
    statusPrioridade: "",
    nomeSuperEstadual: "SUPERINTENDENCIA ESTADUAL DA BAHIA",
    codigoSuperEstadual: 770,
    dataSolicitacao: new Date("2025-08-25"),
    dataPriorizacao: new Date("2025-08-25"),
    totalDiasAgencia: 0,
    totalDiasCentral: 31,
    totalDiasComite: 0,
    totalDiasGeral: 31,
    gerenteResponsavel: "ALINE GABRIELLA NOVAIS BRANDAO - F156728",
    carteiraNegocio: "AGRONEGÓCIO",
    gerenteNome: "ALINE GABRIELLA NOVAIS BRANDAO",
    categoriaPerformance: "Rápido" as const,
    categoriaValor: "Muito Alto" as const,
    diaSemana: 0,
    nomeDiaSemana: "Domingo",
    mesAno: "2025-08",
    ano: 2025,
    mes: 8
  },
  {
    sicad: 3570695,
    nomeCliente: "LUIZ ANTONIO PRADELLA",
    nomeAgencia: "Luis Eduardo Magalhaes",
    valor: 125500000,
    tarefa: "Registrar Ocorrências de Instrução",
    agenciaCentral: "Central",
    diasTarefa: 32,
    dataProjecao: new Date("2025-11-04"),
    programaCredito: "FONTE GENERICA/CONCESSAO LIM CRED ALI FID IMV (653)",
    acompanhamento: "",
    nomeCentral: "AGRONEGOCIO I",
    dataCriacao: new Date("2025-08-25"),
    statusPrioridade: "EXPIRADA",
    nomeSuperEstadual: "SUPERINTENDENCIA ESTADUAL DA BAHIA",
    codigoSuperEstadual: 770,
    dataSolicitacao: new Date("2025-09-15"),
    dataPriorizacao: new Date("2025-09-15"),
    totalDiasAgencia: 0,
    totalDiasCentral: 32,
    totalDiasComite: 0,
    totalDiasGeral: 32,
    gerenteResponsavel: "AMINE SANTOS MATA PIRES - F163910",
    carteiraNegocio: "AGRONEGÓCIO",
    gerenteNome: "AMINE SANTOS MATA PIRES",
    categoriaPerformance: "Rápido" as const,
    categoriaValor: "Alto" as const,
    diaSemana: 0,
    nomeDiaSemana: "Domingo",
    mesAno: "2025-08",
    ano: 2025,
    mes: 8
  }
];

export const Dashboard: React.FC = () => {
  const { 
    propostasFiltered, 
    benchmarks, 
    alertas, 
    setPropostas,
    dismissAlert,
    loading 
  } = useStore();

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setPropostas(sampleData);
    }, 1000);
  }, [setPropostas]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Preparar dados para gráficos
  const agencyData = Object.entries(groupBy(propostasFiltered, 'nomeAgencia'))
    .map(([name, propostas]) => ({
      name: name.length > 20 ? `${name.substring(0, 20)}...` : name,
      value: propostas.reduce((sum, p) => sum + p.valor, 0)
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const portfolioData = Object.entries(groupBy(propostasFiltered, 'carteiraNegocio'))
    .map(([name, propostas]) => ({
      name,
      value: propostas.length
    }));

  const timelineData = Object.entries(groupBy(propostasFiltered, 'mesAno'))
    .map(([date, propostas]) => ({
      date,
      value: propostas.length
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Alertas */}
        {alertas.filter(alert => !alert.dismissed).length > 0 && (
          <div className="space-y-2">
            {alertas.filter(alert => !alert.dismissed).map((alert: Alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                  alert.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                  'bg-green-50 border-green-200 text-green-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Propostas"
            value={propostasFiltered.length}
            format="number"
            icon="📊"
            color="blue"
          />
          
          <MetricCard
            title="Valor Total"
            value={propostasFiltered.reduce((sum, p) => sum + p.valor, 0)}
            format="currency"
            icon="💰"
            color="green"
          />
          
          <MetricCard
            title="Valor Médio"
            value={benchmarks.avgValue}
            format="currency"
            icon="📈"
            color="purple"
          />
          
          <MetricCard
            title="Prazo Médio"
            value={benchmarks.avgDays}
            format="days"
            icon="⏱️"
            color="yellow"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <HorizontalBarChart
              data={agencyData}
              title="💰 Top 10 Agências por Valor"
              valueFormat="currency"
            />
          </Card>
          
          <Card>
            <PieChart
              data={portfolioData}
              title="🥧 Distribuição por Carteira"
              showPercentage={true}
            />
          </Card>
        </div>

        {/* Timeline */}
        <Card>
          <TimelineChart
            data={timelineData}
            title="📅 Propostas Criadas por Período"
            valueFormat="number"
          />
        </Card>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="📊 Estatísticas">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Clientes Únicos:</span>
                <span className="font-semibold">
                  {new Set(propostasFiltered.map(p => p.nomeCliente)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Agências Ativas:</span>
                <span className="font-semibold">
                  {new Set(propostasFiltered.map(p => p.nomeAgencia)).size}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gerentes:</span>
                <span className="font-semibold">
                  {new Set(propostasFiltered.map(p => p.gerenteResponsavel)).size}
                </span>
              </div>
            </div>
          </Card>
          
          <Card title="⏰ Performance">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Prazo Excelente:</span>
                <span className="font-semibold text-green-600">
                  {propostasFiltered.filter(p => p.totalDiasGeral <= benchmarks.excellentDays).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prazo Normal:</span>
                <span className="font-semibold text-yellow-600">
                  {propostasFiltered.filter(p => p.totalDiasGeral > benchmarks.excellentDays && p.totalDiasGeral <= benchmarks.goodDays).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Prazo Ruim:</span>
                <span className="font-semibold text-red-600">
                  {propostasFiltered.filter(p => p.totalDiasGeral > benchmarks.poorDays).length}
                </span>
              </div>
            </div>
          </Card>
          
          <Card title="💎 Valores">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Maior Valor:</span>
                <span className="font-semibold text-green-600">
                  R$ {Math.max(...propostasFiltered.map(p => p.valor)).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Menor Valor:</span>
                <span className="font-semibold">
                  R$ {Math.min(...propostasFiltered.map(p => p.valor)).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mediana:</span>
                <span className="font-semibold">
                  R$ {benchmarks.medianValue.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};