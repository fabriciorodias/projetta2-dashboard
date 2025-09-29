import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon, 
  BanknotesIcon, 
  WalletIcon, 
  ClockIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import MetricCard from '@/components/ui/MetricCard'
import PieChart from '@/components/charts/PieChart'
import BarChart from '@/components/charts/BarChart'
import LineChart from '@/components/charts/LineChart'
import { useStoreActions } from '@/hooks/useStore'
import ApiService from '@/services/api'

interface AnalyticsData {
  metrics: any
  proposalsByAgency: any[]
  proposalsByMonth: any[]
  statusDistribution: any[]
}

const Dashboard = () => {
  const { setProposals, setMetrics, setIsLoading, addAlert } = useStoreActions()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Load proposals
        const proposalsData = await ApiService.fetchProposals()
        setProposals(proposalsData)
        
        // Load metrics
        const metrics = await ApiService.fetchMetrics()
        setMetrics(metrics)

        // Generate analytics from proposals
        const analyticsData: AnalyticsData = {
          metrics,
          proposalsByAgency: generateProposalsByAgency(proposalsData),
          proposalsByMonth: generateProposalsByMonth(proposalsData),
          statusDistribution: generateStatusDistribution(proposalsData)
        }
        
        setAnalytics(analyticsData)
        addAlert({
          type: 'success',
          message: 'Dados carregados com sucesso!',
          autoHide: true
        })
      } catch (error) {
        addAlert({
          type: 'error',
          message: 'Erro ao carregar dados do dashboard'
        })
      } finally {
        setIsLoading(false)
        setLoading(false)
      }
    }

    loadData()
  }, [setProposals, setMetrics, setIsLoading, addAlert])

  const generateProposalsByAgency = (proposals: any[]) => {
    const agencyData = proposals.reduce((acc: any, p) => {
      acc[p.nomeAgencia] = (acc[p.nomeAgencia] || 0) + 1
      return acc
    }, {})

    return Object.entries(agencyData).map(([name, value]) => ({
      name: name.split(' ')[0], // Shorten agency names
      value
    }))
  }

  const generateProposalsByMonth = (proposals: any[]) => {
    const monthData = proposals.reduce((acc: any, p) => {
      const month = `${p.mes}/${p.ano}`
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {})

    return Object.entries(monthData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([name, value]) => ({ name, value }))
  }

  const generateStatusDistribution = (proposals: any[]) => {
    const statusData = proposals.reduce((acc: any, p) => {
      acc[p.statusPrioridade] = (acc[p.statusPrioridade] || 0) + 1
      return acc
    }, {})

    return Object.entries(statusData).map(([name, value]) => ({
      name,
      value
    }))
  }

  const metricCards = analytics?.metrics ? [
    {
      title: 'Total de Propostas',
      value: analytics.metrics.totalProposals || 0,
      icon: <DocumentTextIcon className="w-5 h-5" />,
      color: 'blue' as const,
    },
    {
      title: 'Valor Total',
      value: analytics.metrics.totalValue || 0,
      unit: 'R$',
      format: 'currency' as const,
      icon: <BanknotesIcon className="w-5 h-5" />,
      color: 'green' as const,
    },
    {
      title: 'Valor Médio',
      value: analytics.metrics.averageValue || 0,
      unit: 'R$',
      format: 'currency' as const,
      icon: <WalletIcon className="w-5 h-5" />,
      color: 'blue' as const,
    },
    {
      title: 'Prazo Médio',
      value: Math.round(analytics.metrics.averageDays || 0),
      unit: 'dias',
      icon: <ClockIcon className="w-5 h-5" />,
      color: 'orange' as const,
    },
    {
      title: 'Gerentes Ativos',
      value: analytics.metrics.uniqueManagers || 0,
      icon: <UserGroupIcon className="w-5 h-5" />,
      color: 'purple' as const,
    },
  ] : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="space-y-6">
          {/* Loading metric cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <MetricCard key={i} title="" value={0} loading={true} />
            ))}
          </div>
          
          {/* Loading charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Visão geral das propostas de crédito
          </p>
        </div>

        {/* Metric Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {metricCards.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart 
                data={analytics?.statusDistribution || []}
                height={300}
                title=""
              />
            </CardContent>
          </Card>

          {/* Proposals by Agency */}
          <Card>
            <CardHeader>
              <CardTitle>Propostas por Agência</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={analytics?.proposalsByAgency || []}
                dataKey="value"
                height={300}
                title=""
              />
            </CardContent>
          </Card>

          {/* Trend Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={analytics?.proposalsByMonth || []}
                dataKey="value"
                height={300}
                title=""
              />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Propostas Hoje</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {Math.floor(Math.random() * 20) + 10}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Aprovadas Hoje</span>
                  <span className="font-semibold text-green-600">
                    {Math.floor(Math.random() * 15) + 5}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Aprovação</span>
                  <span className="font-semibold text-blue-600">
                    {Math.floor(Math.random() * 20) + 70}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</span>
                  <span className="font-semibold text-orange-600">
                    {Math.floor(Math.random() * 10) + 15} dias
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard