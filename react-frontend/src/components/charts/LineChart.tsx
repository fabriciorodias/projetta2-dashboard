import React from 'react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface ChartDataPoint {
  date: string
  count: number
  value_sum: number
}

interface LineChartProps {
  data: ChartDataPoint[]
  height?: number
  color?: string
  className?: string
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 300, 
  color = '#3B82F6',
  className = ''
}) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Propostas: </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {payload[0].value.toLocaleString('pt-BR')}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Valor: </span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(payload[1].value)}
              </span>
            </p>
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
        <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="date" 
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
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Count Line */}
          <Line
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
          
          {/* Value Line */}
          <Line
            type="monotone"
            dataKey="value_sum"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
            yAxisId="value"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default LineChart
