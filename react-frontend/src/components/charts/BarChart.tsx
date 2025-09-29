import React from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface ChartDataPoint {
  [key: string]: string | number
}

interface BarChartProps {
  data: ChartDataPoint[]
  height?: number
  color?: string
  orientation?: 'horizontal' | 'vertical'
  dataKey?: string
  className?: string
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 300, 
  color = '#3B82F6',
  orientation = 'vertical',
  dataKey = 'valor_total',
  className = ''
}) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 rounded-lg shadow-lg p-3"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">{entry.name}: </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {typeof entry.value === 'number' && entry.value > 1000
                    ? new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(entry.value)
                    : entry.value.toLocaleString('pt-BR')}
                </span>
              </p>
            ))}
          </div>
        </motion.div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${className}`}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart 
          data={data} 
          layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          
          {orientation === 'vertical' ? (
            <>
              <XAxis 
                dataKey="carteira" 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => 
                  value > 1000000 
                    ? `R$ ${(value / 1000000).toFixed(1)}M`
                    : `R$ ${(value / 1000).toFixed(0)}k`
                }
              />
            </>
          ) : (
            <>
              <XAxis 
                type="number"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => 
                  value > 1000000 
                    ? `R$ ${(value / 1000000).toFixed(1)}M`
                    : `R$ ${(value / 1000).toFixed(0)}k`
                }
              />
              <YAxis 
                type="category"
                dataKey="agencia"
                stroke="#6B7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
              />
            </>
          )}
          
          <Tooltip content={<CustomTooltip />} />
          
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[2, 2, 0, 0]}
            maxBarSize={orientation === 'vertical' ? 60 : 40}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default BarChart
