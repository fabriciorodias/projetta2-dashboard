import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatters } from '../../utils/formatters';

interface HorizontalBarChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title: string;
  valueFormat?: 'currency' | 'number';
  height?: number;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
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
        <BarChart
          data={data}
          layout="versa"
          margin={{
            top: 20,
            right: 30,
            left: 80,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={formatValue} />
          <YAxis 
            type="category" 
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={120}
          />
          <Tooltip 
            formatter={[formatValue, 'Valor']}
            labelFormatter={(label) => `${label}`}
          />
          <Bar 
            dataKey="value" 
            fill="#3B82F6"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};