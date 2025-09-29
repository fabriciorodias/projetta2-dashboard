import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatters } from '../../utils/formatters';

interface TimelineChartProps {
  data: Array<{
    date: string;
    value: number;
    category?: string;
  }>;
  title: string;
  valueFormat?: 'currency' | 'number';
  height?: number;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  title,
  valueFormat = 'number',
  height = 400
}) => {
  const formatValue = (value: number) => {
    return valueFormat === 'currency' ? formatters.currency(value) : formatters.number(value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tickFormatter={formatValue} />
          <Tooltip 
            formatter={[formatValue, 'Valor']}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};