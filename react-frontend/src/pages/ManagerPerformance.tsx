import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import MetricCard from '@/components/ui/MetricCard'
import { UserGroupIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const StarIcon = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const ManagerPerformance = () => {
  const managers = [
    { 
      name: 'João Silva', 
      proposals: 42, 
      avgDuration: 12, 
      score: 89, 
      category: 'Excelente',
      efficiency: 95
    },
    { 
      name: 'Maria Santos', 
      proposals: 38, 
      avgDuration: 15, 
      score: 76, 
      category: 'Bom',
      efficiency: 87
    },
    { 
      name: 'Pedro Costa', 
      proposals: 35, 
      avgDuration: 18, 
      score: 68, 
      category: 'Bom',
      efficiency: 79
    },
    { 
      name: 'Ana Oliveira', 
      proposals: 28, 
      avgDuration: 22, 
      score: 52, 
      category: 'Precisa Melhorar',
      efficiency: 64
    }
  ]

  const totalProposals = managers.reduce((sum, m) => sum + m.proposals, 0)
  const avgScore = managers.reduce((sum, m) => sum + m.score, 0) / managers.length

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Performance dos Gerentes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Análise detalhada da performance individual
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Propostas"
            value={totalProposals}
            icon={<ChartBarIcon className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="Gerentes Ativos"
            value={managers.length}
            icon={<UserGroupIcon className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            title="Score Médio"
            value={Math.round(avgScore)}
            unit="/100"
            icon={<StarIcon className="w-5 h-5" />}
            color="purple"
          />
          <MetricCard
            title="Tempo Médio"
            value={Math.round(managers.reduce((sum, m) => sum + m.avgDuration, 0) / managers.length)}
            unit="dias"
            icon={<ClockIcon className="w-5 h-5" />}
            color="orange"
          />
        </div>

        {/* Manager Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {managers.map((manager, index) => (
            <motion.div
              key={manager.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {manager.name}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(manager.score)}`}>
                      {manager.score}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {manager.proposals}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Propostas
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {manager.avgDuration}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Dias Média
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {manager.efficiency}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Eficiência
                        </div>
                      </div>
                    </div>

                    {/* Performance Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Performance</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {manager.category}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            manager.score >= 80 ? 'bg-green-500' :
                            manager.score >= 60 ? 'bg-blue-500' :
                            manager.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${manager.score}%` }}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          +{Math.floor(Math.random() * 5) + 2}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Última Semana
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {Math.floor(Math.random() * 20) + 70}%
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          Taxa Sucesso
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default ManagerPerformance