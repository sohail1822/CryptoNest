import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="h-[300px] flex items-center justify-center text-gray-400 text-xs italic">
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
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            minTickGap={30}
          />
          <YAxis 
            hide={true} 
            domain={domain}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e2235', 
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#fff'
            }}
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Price']}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#6366f1" 
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
