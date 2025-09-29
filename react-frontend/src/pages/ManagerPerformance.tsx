import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import MetricCard from '@/components/ui/MetricCard'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'
import { fetchAnalytics } from '@/services/api'
import { 
  UserGroupIcon, 
  TrophyIcon, 
  ClockIcon, 
  TrendingUpIcon 
} from '@heroicons/react/24/outline'

const ManagerPerformance: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => fetchAnalytics(),
  })

  const managers = analytics?.metrics.managerPerformance || []
  
  const managerMetrics = [
    {
      title: 'Total Gerentes',
      value: managers.length || 0,
      icon: <UserGroupIcon className="w-5 h-5" />,
      color: 'blue' as const,
    },
    {
      title: 'Top Performer',
      value: managers.length > 0 ? Math.max(...managers.map(m => m.score_geral)) : 0,
      format: 'percentage' as const,
      icon: <TrophyIcon className="w-5 h-5" />,
      color: 'green' as const,
    },
    {
      title: 'Prazo Médio',
      value: managers.length > 0 
        ? Math.round(managers.reduce((acc, m) => acc + m.prazo_medio, 0) / managers.length)
        : 0,
      unit: 'dias',
      icon: <ClockIcon className="w-5 h-5" />,
      color: 'orange' as const,
    },
    {
      title: 'Produtividade Média',
      value: managers.length > 0 
        ? Math.round(managers.reduce((acc, m) => acc + m.produtividade, 0) / managers.length)
        : 0,
      format: 'percentage' as const,
      icon: <TrendingUpIcon className="w-5 h-5" />,
      color: 'purple' as const,
    },
  ]

  // Top performers for charts
  const topPerformers = managers.sort((a, b) => b.score_geral - a.score_geral).slice(0, 10)
  const productivityData = topPerformers.map(m => ({
    agencia: m.gerente_nome,
    valor_total: m.score_geral,
    prazo_medio: m.prazo_medio,
    qtd_propostas: m.qtd_propostas
  }))

  // Performance distribution
  const performanceDistribution = {
    excelente: managers.filter(m => m.categoria === 'Excelente').length,
    bom: managers.filter(m => m.categoria === 'Bom').length,
    precisa_melhorar: managers.filter(m => m.categoria === 'Precisa Melhorar').length,
  }

  const pieData = [
    { name: 'Excelente', value: performanceDistribution.excelente, color: '#10B981' },
    { name: 'Bom', value: performanceDistribution.bom, color: '#F59E0B' },
    { name: 'Precisa Melhorar', value: performanceDistribution.precisa_melhorar, color: '#EF4444' },
  ].filter(item => item.value > 0)

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
          Performance dos Gerentes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Análise de produtividade e eficiência individual
        </p>
      </motion.div>

      {/* Manager Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="dashboard-grid"
      >
        {managerMetrics.map((metric) => (
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
        {/* Performance Distribution */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Distribuição de Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieData} height={300} />
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Top 10 Gerentes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={productivityData} 
              height={300}
              orientation="horizontal"
              color="#3B82F6"
              dataKey="valor_total"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Efficiency Scatter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Produtividade vs Eficiência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Produtividade (Quantidade)
                </h4>
                <div className="space-y-3">
                  {topPerformers.slice(0, 5).map((manager, index) => (
                    <div key={manager.gerente} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {manager.gerente_nome}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(manager.qtd_propostas / Math.max(...topPerformers.map(m => m.qtd_propostas))) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8 text-right">
                          {manager.qtd_propostas}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Eficiência (Prazo)
                </h4>
                <div className="space-y-3">
                  {topPerformers.slice(0, 5).map((manager, index) => (
                    <div key={manager.gerente} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                        {manager.gerente_nome}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.max(0, 100 - (manager.prazo_medio / Math.max(...topPerformers.map(m => m.prazo_medio))) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                          {Math.round(manager.prazo_medio)} dias
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Ranking Completo de Gerentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Posição</th>
                    <th>Gerente</th>
                    <th>Score Geral</th>
                    <th>Propostas</th>
                    <th>Valor Total</th>
                    <th>Prazo Médio</th>
                    <th>Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager, index) => (
                    <tr key={manager.gerente}>
                      <td className="text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          index < 3 
                            ? index === 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : index === 1 ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="font-medium">{manager.gerente_nome}</td>
                      <td>
                        <span className="font-medium">{manager.score_geral.toFixed(1)}</span>
                      </td>
                      <td>{manager.qtd_propostas}</td>
                      <td>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(manager.valor_total)}
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          manager.prazo_medio < 30 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : manager.prazo_medio < 60
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {Math.round(manager.prazo_medio)} dias
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          manager.categoria === 'Excelente'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : manager.categoria === 'Bom'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}>
                          {manager.categoria}
                        </span>
                      </td>
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

export default ManagerPerformance
