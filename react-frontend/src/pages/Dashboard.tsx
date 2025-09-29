import React from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import MetricCard from '@/components/ui/MetricCard'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { fetchProposals, fetchAnalytics } from '@/services/api'
import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ClockIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline'
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import PieChart from '@/components/charts/PieChart'

const Dashboard: React.FC = () => {
  const { data: proposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => fetchProposals(),
  })

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => fetchAnalytics(),
  })

  const isLoading = proposalsLoading || analyticsLoading

  const metrics = [
    {
      title: 'Total de Propostas',
      value: analytics?.metrics.totalProposals || 0,
      icon: <ChartBarIcon className="w-5 h-5" />,
      color: 'blue' as const,
    },
    {
      title: 'Valor Total',
      value: analytics?.metrics.totalValue || 0,
      format: 'currency' as const,
      icon: <CurrencyDollarIcon className="w-5 h-5" />,
      color: 'green' as const,
    },
    {
      title: 'Prazo Médio',
      value: Math.round(analytics?.metrics.averageDays || 0),
      unit: 'dias',
      icon: <ClockIcon className="w-5 h-5" />,
      color: 'orange' as const,
    },
    {
      title: 'Gerentes Ativos',
      value: analytics?.metrics.uniqueManagers || 0,
      icon: <UserGroupIcon className="w-5 h-5" />,
      color: 'purple' as const,
    },
  ]

  const chartData = [
    { name: 'Pessoa Física', value: 456, color: '#3B82F6' },
    { name: 'Pessoa Jurídica', value: 234, color: '#10B981' },
    { name: 'Consignado', value: 123, color: '#F59E0B' },
    { name: 'Empre Préstimo', value: 89, color: '#EF4444' },
  ]

  const portfolioData = analytics?.metrics.portfolioDistribution || []
  const agencyData = analytics?.metrics.agencyDistribution || []

  const timelineData = [
    { date: '2024-01', count: 150, value_sum: 2500000 },
    { date: '2024-02', count: 180, value_sum: 3200000 },
    { date: '2024-03', count: 200, value_sum: 3800000 },
    { date: '2024-04', count: 165, value_sum: 2800000 },
    { date: '2024-05', count: 190, value_sum: 3500000 },
    { date: '2024-06', count: 210, value_sum: 4200000 },
  ]

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
          Dashboard Geral
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visão consolidada de todas as propostas de crédito
        </p>
      </motion.div>

      {/* Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="dashboard-grid"
      >
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            color={metric.color}
            format={metric.format}
            loading={isLoading}
            change={
              index === 0
                ? { value: 12.5, type: 'positive', period: 'vs mês anterior' }
                : index === 1
                ? { value: 8.3, type: 'positive', period: 'vs mês anterior' }
                : undefined
            }
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
        {/* Timeline Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Trend de Propostas</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={timelineData} height={300} />
          </CardContent>
        </Card>

        {/* Portfolio Distribution */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Distribuição por Carteira</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={chartData} height={300} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Top Agencias */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Top Agências por Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={agencyData.slice(0, 8)} 
              height={300}
              orientation="horizontal"
              color="#3B82F6"
            />
          </CardContent>
        </Card>

        {/* Portfolio Performance */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Performance por Carteira</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={portfolioData} 
              height={300}
              color="#10B981"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposals?.slice(0, 5).map((proposal, index) => (
                <div
                  key={proposal.sicad}
                  className={`flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-200 ${
                    index === 0 ? 'border-l-4 border-primary-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {proposal.nomeCliente}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {proposal.nomeAgencia} • {proposal.carteiraNegocio}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(proposal.valor)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {proposal.totalDiasGeral} dias
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard
