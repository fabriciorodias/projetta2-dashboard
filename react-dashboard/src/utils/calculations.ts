import { PropostaProposta, BenchmarkMetrics, Alert, Insight, ManagerPerformance, TemporalAnalysis } from '../types';
import { groupBy, median, calculateStdDev } from './formatters';

export function calculateBenchmarks(propostas: PropostaProposta[]): BenchmarkMetrics {
  if (propostas.length === 0) {
    return {
      avgValue: 0,
      medianValue: 0,
      avgDays: 0,
      medianDays: 0,
      excellentDays: 0,
      goodDays: 0,
      poorDays: 0,
      highValue: 0,
      lowValue: 0
    };
  }

  const valores = propostas.map(p => p.valor);
  const dias = propostas.map(p => p.totalDiasGeral);
  
  const avgValue = valores.reduce((a, b) => a + b, 0) / valores.length;
  const medianValue = median(valores);
  const avgDays = dias.reduce((a, b) => a + b, 0) / dias.length;
  const medianDays = median(dias);
  
  return {
    avgValue,
    medianValue,
    avgDays,
    medianDays,
    excellentDays: avgDays * 0.7, // 30% melhor que a média
    goodDays: avgDays * 0.9,      // 10% melhor que a média
    poorDays: avgDays * 1.2,      // 20% pior que a média
    highValue: medianValue * 2,    // Dobro da mediana
    lowValue: medianValue * 0.5    // Metade da mediana
  };
}

export function generateAlerts(
  propostas: PropostaProposta[], 
  benchmarks: BenchmarkMetrics
): Alert[] {
  const alerts: Alert[] = [];
  
  // Propostas lentas
  const slowProposals = propostas.filter(p => p.totalDiasGeral > benchmarks.poorDays);
  if (slowProposals.length > 0) {
    alerts.push({
      id: 'slow-proposals',
      type: 'warning',
      title: 'Propostas com Prazo Elevado',
      message: `${slowProposals.length} proposta(s) com prazo acima do aceitável`,
      timestamp: new Date(),
      dismissed: false
    });
  }
  
  // Valores altos
  const highValueProposals = propostas.filter(p => p.valor > benchmarks.highValue);
  if (highValueProposals.length > 0) {
    alerts.push({
      id: 'high-value',
      type: 'info',
      title: 'Propostas de Alto Valor',
      message: `${highValueProposals.length} proposta(s) de alto valor requerem atenção`,
      timestamp: new Date(),
      dismissed: false
    });
  }
  
  return alerts;
}

export function generateInsights(propostas: PropostaProposta[]): Insight[] {
  const insights: Insight[] = [];
  
  if (propostas.length === 0) return insights;
  
  // Melhor carteira por eficiência
  const portfolioPerformance = groupBy(propostas, 'carteiraNegocio');
  const portfolioAvgDays = Object.entries(portfolioPerformance)
    .map(([carteira, props]) => ({
      carteira,
      avgDays: props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length
    }))
    .sort((a, b) => a.avgDays - b.avgDays);
  
  if (portfolioAvgDays.length > 0) {
    insights.push({
      id: 'best-portfolio',
      category: 'performance',
      title: 'Carteira Mais Eficiente',
      description: `${portfolioAvgDays[0]?.carteira} tem o menor prazo médio`,
      impact: 'medium',
      recommendation: 'Analisar práticas desta carteira para replicar'
    });
  }
  
  return insights;
}

export function calculateManagerPerformance(propostas: PropostaProposta[]): ManagerPerformance[] {
  if (propostas.length === 0) return [];

  const managerGroups = groupBy(propostas, 'gerenteResponsavel');
  const maxPropostas = Math.max(...Object.values(managerGroups).map(g => g.length));
  const avgDays = propostas.reduce((sum, p) => sum + p.totalDiasGeral, 0) / propostas.length;
  
  return Object.entries(managerGroups).map(([gerente, props]) => {
    const qtdPropostas = props.length;
    const valorTotal = props.reduce((sum, p) => sum + p.valor, 0);
    const prazoMedio = props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length;
    
    const produtividade = (qtdPropostas / maxPropostas) * 100;
    const eficienciaPrazo = Math.max(0, ((avgDays - prazoMedio) / avgDays) * 100);
    const scoreGeral = produtividade * 0.6 + eficienciaPrazo * 0.4;
    
    return {
      gerente,
      gerenteNome: gerente.split(' - ')[0],
      qtdPropostas,
      valorTotal,
      valorMedio: valorTotal / qtdPropostas,
      prazoMedio,
      prazoDesvio: calculateStdDev(props.map(p => p.totalDiasGeral)),
      produtividade,
      eficienciaPrazo,
      scoreGeral,
      categoria: scoreGeral >= 70 ? 'Excelente' : 
                scoreGeral >= 40 ? 'Bom' : 'Precisa Melhorar'
    };
  });
}

export function analyzeTemporalPatterns(propostas: PropostaProposta[]): TemporalAnalysis {
  // Análise mensal
  const monthlyGroups = groupBy(propostas, p => 
    p.dataCriacao.toISOString().slice(0, 7) // YYYY-MM
  );
  
  const monthly = Object.entries(monthlyGroups).map(([mes, props]) => ({
    mes,
    qtdPropostas: props.length,
    valorTotal: props.reduce((sum, p) => sum + p.valor, 0),
    valorMedio: props.reduce((sum, p) => sum + p.valor, 0) / props.length,
    prazoMedio: props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length
  }));
  
  // Análise sazonal (por mês do ano)
  const seasonalGroups = groupBy(propostas, p => p.dataCriacao.getMonth());
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const seasonal = Object.entries(seasonalGroups).map(([month, props]) => ({
    mes: monthNames[parseInt(month)],
    qtd: props.length,
    prazoMedio: props.reduce((sum, p) => sum + p.totalDiasGeral, 0) / props.length
  }));
  
  // Análise por dia da semana
  const dayGroups = groupBy(propostas, p => p.diaSemana);
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  
  const dayOfWeek = Object.entries(dayGroups).map(([day, props]) => ({
    dia: dayNames[parseInt(day)],
    qtd: props.length,
    mediaValor: props.reduce((sum, p) => sum + p.valor, 0) / props.length
  }));
  
  return { monthly, seasonal, dayOfWeek };
}