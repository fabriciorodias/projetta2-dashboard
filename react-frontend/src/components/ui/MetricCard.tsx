import { Card, CardContent } from './Card'
import { motion } from 'framer-motion'

interface MetricCardProps {
  title: string
  value: number | string
  unit?: string
  change?: {
    value: number
    type: 'positive' | 'negative' | 'neutral'
    period?: string
  }
  icon?: React.ReactNode
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray'
  format?: 'number' | 'currency' | 'percentage'
  loading?: boolean
  className?: string
}

const MetricCard = ({
  title,
  value,
  unit,
  change,
  icon,
  color = 'blue',
  format = 'number',
  loading = false,
  className = '',
}: MetricCardProps) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    gray: 'from-gray-500 to-gray-600',
  }

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'number':
      default:
        return new Intl.NumberFormat('pt-BR').format(val)
    }
  }

  const getChangeIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        )
      case 'negative':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        )
      case 'neutral':
        return (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="h-full group hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              {title}
            </h3>
            {icon && (
              <div className={`p-2 rounded-lg bg-gradient-to-r ${colors[color]} text-white opacity-80 group-hover:opacity-100 transition-opacity duration-200`}>
                {icon}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatValue(value)}
              {unit && <span className="text-sm font-medium text-gray-500 ml-1">{unit}</span>}
            </p>
            
            {change && (
              <div className={`flex items-center space-x-1 text-sm ${
                change.type === 'positive' ? 'text-green-600' : 
                change.type === 'negative' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {getChangeIcon(change.type)}
                <span className="font-medium">
                  {Math.abs(change.value)}
                  {change.type === 'positive' || change.type === 'negative' ? '%' : ''}
                </span>
                {change.period && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {change.period}
                  </span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MetricCard