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

  // Custom tooltip to show all data including population info
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-semibold">{`Date: ${label}`}</p>
          <p style={{ color: '#1E90FF' }}>
            {`${pollutant} Level: ${payload.find((p: any) => p.dataKey === 'value')?.value || 'N/A'} AQI`}
          </p>
          <p style={{ color: '#4CAF50' }}>
            {`Asthma Rate: ${payload.find((p: any) => p.dataKey === 'asthmaRate')?.value || 'N/A'}%`}
          </p>
          <p style={{ color: '#FF6B35' }}>
            {`Asthma Percentage: ${payload.find((p: any) => p.dataKey === 'asthmaPercentage')?.value || 'N/A'}%`}
          </p>
          {data.population && (
            <>
              <p className="text-sm text-gray-600 mt-2">
                {`Population: ${data.population.toLocaleString()}`}
              </p>
              <p className="text-sm text-gray-600">
                {`People with Asthma: ${data.peopleWithAsthma?.toLocaleString() || 'N/A'}`}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card h-[400px]">
      <h3 className="text-lg font-semibold mb-4">{pollutant} Trend Analysis with Asthma Data</h3>
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
            yAxisId="left"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            label={{ 
              value: `${pollutant} AQI`, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
            }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Asthma Rate (%)', 
              angle: 90, 
              position: 'insideRight',
              style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="value" 
            name={`${pollutant} Level (AQI)`}
            stroke="#1E90FF" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
            activeDot={{ r: 6, stroke: '#1E90FF', strokeWidth: 2, fill: 'white' }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="asthmaRate" 
            name="Asthma Rate (%)"
            stroke="#4CAF50" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, strokeWidth: 1, fill: '#4CAF50' }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="asthmaPercentage" 
            name="Asthma Percentage (%)"
            stroke="#FF6B35" 
            strokeWidth={2}
            strokeDasharray="10 5"
            dot={{ r: 3, strokeWidth: 1, fill: '#FF6B35' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 text-sm text-gray-600">
        <p><strong>Note:</strong> Asthma Rate is constant per location. Asthma Percentage shows the proportion of people with asthma relative to total population.</p>
      </div>
    </div>
  );
};

export default TrendChart;
