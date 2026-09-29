import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../../shared/utils/formatters';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="h-[300px] flex items-center justify-center text-[var(--text-muted)] text-xs italic">
      No chart data available
    </div>
  );

  // Format data for Recharts
  const formattedData = data.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    fullDate: new Date(timestamp).toLocaleString(),
    price: price
  }));

  const minPrice = Math.min(...formattedData.map(d => d.price));
  const maxPrice = Math.max(...formattedData.map(d => d.price));
  const domain = [minPrice * 0.99, maxPrice * 1.01];

  return (
    <div className="w-full h-[350px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-primary)" stopOpacity={0.24}/>
              <stop offset="95%" stopColor="var(--chart-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            minTickGap={30}
          />
          <YAxis 
            hide={true} 
            domain={domain}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--chart-tooltip)',
              borderColor: 'var(--border-base)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--shadow-raised)'
            }}
            formatter={(value) => [formatCurrency(value), 'Price']}
            labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="var(--chart-primary)"
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
