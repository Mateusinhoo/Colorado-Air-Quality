import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data?: any[];
  pollutant?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data: propData, pollutant: propPollutant }) => {
  const { trendData, selectedPollutant } = useContext(DataContext);
  
  // Use props data if provided, otherwise use context data
  const chartData = propData || trendData;
  const pollutant = propPollutant || selectedPollutant;

  return (
    <div className="card h-[400px]">
      <h3 className="text-lg font-semibold mb-4">{pollutant} Trend Analysis</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            label={{ 
              value: `${pollutant} (μg/m³)`, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: 'none'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            name={`${pollutant} Level`}
            stroke="#1E90FF" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#1E90FF', strokeWidth: 2, fill: 'white' }}
          />
          <Line 
            type="monotone" 
            dataKey="asthmaRate" 
            name="Asthma Rate (%)"
            stroke="#4CAF50" 
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
