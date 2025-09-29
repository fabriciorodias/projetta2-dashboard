import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface ChartDataPoint {
  name: string
  value: number
  color?: string
}

interface PieChartProps {
  data: ChartDataPoint[]
  title?: string
  colors?: string[]
  height?: number
  showLegend?: boolean
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']

const PieChartComponent = ({ 
  data, 
  title, 
  colors = COLORS, 
  height = 300,
  showLegend = true 
}: PieChartProps) => {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: colors[index % colors.length]
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Valor: <span className="font-medium">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentual: <span className="font-medium">{((data.value / data.payload.total) * 100).toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Hide labels for slices < 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={dataWithColors.map(item => ({ ...item, total }))}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithColors.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value: string) => (
                <span className="text-gray-600 dark:text-gray-400 text-sm">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Data summary */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-gray-600 dark:text-gray-400">Total de Registros</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{total}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="text-gray-600 dark:text-gray-400">Categorias</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{data.length}</div>
        </div>
      </div>
    </div>
  )
}

export default PieChartComponent