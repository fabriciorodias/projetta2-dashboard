import React from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { motion } from 'framer-motion'

interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

interface PieChartProps {
  data: ChartDataPoint[]
  height?: number
  className?: string
  showLegend?: boolean
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  height = 300, 
  className = '',
  showLegend = true
}) => {
  const COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // green-500
    '#F59E0B', // yellow-500
    '#EF4444', // red-500
    '#8B5CF6', // purple-500
    '#EC4899', // pink-500
    '#6B7280', // gray-500
    '#F97316', // orange-500
  ]

  const processedData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-400 rounded-lg shadow-lg p-3"
        >
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">
              {typeof payload[0].value === 'number' && payload[0].value > 1000
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(payload[0].value)
                : payload[0].value.toLocaleString('pt-BR')}
            </span>
            {' ('}
            <span className="font-medium">
              {payload[0].percent?.toFixed(1)}%
            </span>
            {')'}
          </p>
        </motion.div>
      )
    }
    return null
  }

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    )
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
        <RechartsPieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            strokeWidth={2}
            stroke="#ffffff"
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && <Legend content={<CustomLegend />} />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export default PieChart
