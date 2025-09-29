import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import MetricCard from '@/components/ui/MetricCard'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import { fetchAnalytics } from '@/services/api'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  TrendingUpIcon 
} from '@heroicons/react/24/outline'

const PortfolioAnalysis: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => fetchAnalytics(),
  })

  const portfolioMetrics = [
    {
      title: 'Carteiras Únicas',
      value: analytics?.metrics.portfolioDistribution.length || 0,
      icon: <ChartBarIcon className="w-5 h-5" />,
      color: 'blue' as const,
    },
    {
      title: 'Maior Volume',
      value: analytics?.metrics.portfolioDistribution.reduce((max, p) => 
        p.valor_total > max ? p.valor_total : max, 0) || 0,
      format: 'currency' as const,
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      color: 'green' as const,
    },
    {
      title: 'Prazo Médio Geral',
      value: Math.round(
        analytics?.metrics.portfolioDistribution.reduce((acc, p) => 
          acc + (p.prazo_medio * p.qtd), 0) / 
        analytics?.metrics.portfolioDistribution.reduce((acc, p) => 
          acc + p.qtd, 0) || 0
      ),
      unit: 'dias',
      icon: <ClockIcon className="w-5 h-5" />,
      color: 'orange' as const,
    },
    {
      title: 'Performance Geral',
      value: analytics?.metrics.portfolioDistribution.reduce((acc, p) => 
        acc + (p.prazo_medio < 30 ? 1 : 0), 0) || 0,
      format: 'percentage' as const,
      icon: <TrendingUpIcon className="w-5 h-5" />,
      color: 'purple' as const,
    },
  ]

  const portfolioData = analytics?.metrics.portfolioDistribution || []
  
  const pieData = portfolioData.map(p => ({
    name: p.carteira,
    value: p.qtd,
    color: p.prazo_medio < 30 ? '#10B981' : p.prazo_medio < 60 ? '#F59E0B' : '#EF4444'
  }))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Análise por Carteiras
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Performance detalhada por carteira de negócio
        </p>
      </motion.div>

      {/* Portfolio Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="dashboard-grid"
      >
        {portfolioMetrics.map((metric) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            color={metric.color}
            format={metric.format}
            loading={isLoading}
          />
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Portfolio Distribution */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Distribuição por Quantidade</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieData} height={300} />
          </CardContent>
        </Card>

        {/* Portfolio Values */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Valor Total por Carteira</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={portfolioData} 
              height={300}
              color="#10B981"
              dataKey="valor_total"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Detalhes de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Carteira</th>
                    <th>Qtd Propostas</th>
                    <th>Valor Total</th>
                    <th>Valor Médio</th>
                    <th>Prazo Médio</th>
                    <th>Participação</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((portfolio, index) => (
                    <tr key={portfolio.carteira}>
                      <td className="font-medium">{portfolio.carteira}</td>
                      <td>{portfolio.qtd}</td>
                      <td>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(portfolio.valor_total)}
                      </td>
                      <td>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(portfolio.valor_medio)}
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          portfolio.prazo_medio < 30 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : portfolio.prazo_medio < 60
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {Math.round(portfolio.prazo_medio)} dias
                        </span>
                      </td>
                      <td>{portfolio.porcentagem.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default PortfolioAnalysis
