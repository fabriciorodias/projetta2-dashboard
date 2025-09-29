import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import MetricCard from '@/components/ui/MetricCard'
import { WalletIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const TrendingUpIcon = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const PortfolioAnalysis = () => {
  const portfolios = [
    { name: 'Premium', proposals: 45, value: 1250000, avgValue: 27777, growth: 12.5 },
    { name: 'Standard', proposals: 89, value: 1850000, avgValue: 20786, growth: 8.3 },
    { name: 'Básica', proposals: 23, value: 340000, avgValue: 14782, growth: -2.1 }
  ]

  const totalProposals = portfolios.reduce((sum, p) => sum + p.proposals, 0)
  const totalValue = portfolios.reduce((sum, p) => sum + p.value, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Análise de Carteiras
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Performance detalhada por categoria de negócio
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Propostas"
            value={totalProposals}
            icon={<ChartBarIcon className="w-5 h-5" />}
            color="blue"
          />
          <MetricCard
            title="Valor Total"
            value={totalValue}
            format="currency"
            icon={<WalletIcon className="w-5 h-5" />}
            color="green"
          />
          <MetricCard
            title="Valor Médio"
            value={totalValue / totalProposals}
            format="currency"
            icon={<TrendingUpIcon className="w-5 h-5" />}
            color="purple"
          />
        </div>

        {/* Portfolio Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio, index) => (
            <motion.div
              key={portfolio.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Carteira {portfolio.name}
                    <div className="flex items-center space-x-1">
                      {portfolio.growth > 0 ? (
                        <TrendingUpIcon className="w-4 h-4 text-green-500" />
                        ) : (
                        <TrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />
                      )}
                      <span className={`text-sm font-medium ${
                        portfolio.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {portfolio.growth > 0 ? '+' : ''}{portfolio.growth}%
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Propostas</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {portfolio.proposals}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Valor Total</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(portfolio.value)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Valor Médio</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(portfolio.avgValue)}
                        </span>
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

export default PortfolioAnalysis