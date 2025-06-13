import React, { useContext, useState } from 'react';
import { DataContext } from '../../context/DataContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, ReferenceLine, ReferenceArea, Brush
} from 'recharts';

interface TrendChartProps {
  data?: any[];
  pollutant?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data: propData, pollutant: propPollutant }) => {
  const { 
    trendData, 
    selectedPollutant, 
    highAlertDays, 
    correlationData, 
    optimalTimelag 
  } = useContext(DataContext);
  
  // Use props data if provided, otherwise use context data
  const chartData = propData || trendData;
  const pollutant = propPollutant || selectedPollutant;
  
  // State for chart display options
  const [showEmergencyVisits, setShowEmergencyVisits] = useState<boolean>(true);
  const [showLaggedData, setShowLaggedData] = useState<boolean>(true);
  const [showAsthmaRate, setShowAsthmaRate] = useState<boolean>(true);

  // Get optimal correlation coefficient if available
  const optimalCorrelation = correlationData?.find(c => c.timelag === optimalTimelag);
  const correlationCoefficient = optimalCorrelation?.correlationCoefficient || 0;
  const correlationSignificance = optimalCorrelation?.significance || 1;
  
  // Format correlation for display
  const formattedCorrelation = correlationCoefficient.toFixed(2);
  const correlationStrength = 
    Math.abs(correlationCoefficient) > 0.7 ? 'Strong' :
    Math.abs(correlationCoefficient) > 0.5 ? 'Moderate' :
    Math.abs(correlationCoefficient) > 0.3 ? 'Weak' : 'Very Weak';
  
  const correlationDirection = correlationCoefficient > 0 ? 'Positive' : 'Negative';
  const isSignificant = correlationSignificance < 0.05;

  // Custom tooltip to show all data including emergency visits and alerts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Find alert level for this date
      const alertDay = highAlertDays?.find(day => day.date === label);
      const alertLevel = alertDay?.alertLevel || 'low';
      
      // Alert level styling
      const alertColors = {
        high: 'bg-red-100 text-red-800 border-red-300',
        moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        low: 'bg-green-100 text-green-800 border-green-300'
      };
      
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${alertColors[alertLevel]} dark:bg-opacity-90`}>
          <p className="font-semibold">{`Date: ${label}`}</p>
          <p style={{ color: '#1E90FF' }}>
            {`${pollutant} Level: ${payload.find((p: any) => p.dataKey === 'value')?.value || 'N/A'} AQI`}
          </p>
          
          {showAsthmaRate && (
            <p style={{ color: '#4CAF50' }}>
              {`Asthma Rate: ${payload.find((p: any) => p.dataKey === 'asthmaRate')?.value || 'N/A'}%`}
            </p>
          )}
          
          {showEmergencyVisits && data.emergencyVisitRate !== null && (
            <p style={{ color: '#FF4500' }}>
              {`Emergency Visits: ${data.emergencyVisitRate?.toFixed(1) || 'N/A'} per 10,000`}
            </p>
          )}
          
          {showLaggedData && data.laggedEmergencyVisitRate !== null && (
            <p style={{ color: '#9932CC' }}>
              {`Next-Day Emergencies: ${data.laggedEmergencyVisitRate?.toFixed(1) || 'N/A'} per 10,000`}
            </p>
          )}
          
          <div className="mt-2 pt-1 border-t border-gray-300">
            <p className="text-sm font-medium">
              Alert Level: <span className="font-bold capitalize">{alertLevel}</span>
            </p>
            
            {data.seasonalFactor && (
              <p className="text-sm">
                {`Seasonal Factor: ${data.seasonalFactor.toFixed(1)}x`}
              </p>
            )}
            
            {data.population && (
              <>
                <p className="text-sm mt-1">
                  {`Population: ${data.population.toLocaleString()}`}
                </p>
                <p className="text-sm">
                  {`People with Asthma: ${data.peopleWithAsthma?.toLocaleString() || 'N/A'}`}
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Render high alert areas as background highlights
  const renderAlertAreas = () => {
    if (!highAlertDays || highAlertDays.length === 0) return null;
    
    return highAlertDays
      .filter(day => day.alertLevel === 'high')
      .map((day, index) => (
        <ReferenceArea
          key={`alert-${index}`}
          x1={day.date}
          x2={day.date}
          strokeOpacity={0.3}
          fill="#FF000033"
        />
      ));
  };

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg font-semibold">{pollutant} Trend Analysis with Asthma Events</h3>
        
        <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showEmergencyVisits}
              onChange={() => setShowEmergencyVisits(!showEmergencyVisits)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm">Emergency Visits</span>
          </label>
          
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showLaggedData}
              onChange={() => setShowLaggedData(!showLaggedData)}
              className="form-checkbox h-4 w-4 text-purple-600"
            />
            <span className="ml-2 text-sm">Lagged Effect</span>
          </label>
          
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showAsthmaRate}
              onChange={() => setShowAsthmaRate(!showAsthmaRate)}
              className="form-checkbox h-4 w-4 text-green-600"
            />
            <span className="ml-2 text-sm">Asthma Rate</span>
          </label>
        </div>
      </div>
      
      {/* Correlation statistics panel */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h4 className="font-medium text-sm">Pollution-Asthma Correlation</h4>
            <p className="text-2xl font-bold">
              {formattedCorrelation}
              <span className="text-sm ml-2 font-normal text-gray-500">
                ({correlationStrength} {correlationDirection})
              </span>
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm">Optimal Time Lag</h4>
            <p className="text-2xl font-bold">
              {optimalTimelag}
              <span className="text-sm ml-2 font-normal text-gray-500">
                {optimalTimelag === 1 ? 'day' : 'days'}
              </span>
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm">Statistical Significance</h4>
            <p className="text-2xl font-bold">
              <span className={isSignificant ? 'text-green-600' : 'text-gray-500'}>
                {isSignificant ? 'Significant' : 'Not Significant'}
              </span>
              <span className="text-sm ml-2 font-normal text-gray-500">
                (p = {correlationSignificance.toFixed(3)})
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
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
                value: 'Rate per 10,000', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#6b7280' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Render alert areas in background */}
            {renderAlertAreas()}
            
            {/* Pollution level line */}
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
            
            {/* Asthma rate line (optional) */}
            {showAsthmaRate && (
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
            )}
            
            {/* Emergency visits line (optional) */}
            {showEmergencyVisits && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="emergencyVisitRate" 
                name="Emergency Visits"
                stroke="#FF4500" 
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1, fill: '#FF4500' }}
              />
            )}
            
            {/* Lagged emergency visits line (optional) */}
            {showLaggedData && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="laggedEmergencyVisitRate" 
                name={`Next-Day Emergencies (${optimalTimelag}-Day Lag)`}
                stroke="#9932CC" 
                strokeWidth={2.5}
                strokeDasharray="3 3"
                dot={{ r: 4, strokeWidth: 1, fill: '#9932CC' }}
              />
            )}
            
            {/* Reference line for unhealthy AQI level */}
            <ReferenceLine 
              yAxisId="left" 
              y={50} 
              label={{ value: 'Moderate AQI', position: 'insideBottomRight' }} 
              stroke="#FFA500" 
              strokeDasharray="3 3" 
            />
            
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <h4 className="font-medium mb-1">Analysis Notes:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Emergency Visits</strong> shows actual asthma-related emergency department visits per 10,000 population
          </li>
          <li>
            <strong>Next-Day Emergencies</strong> shows the delayed effect of pollution on asthma events ({optimalTimelag}-day lag)
          </li>
          <li>
            <strong>Red highlighted areas</strong> indicate high-alert days when both pollution and asthma emergencies were elevated
          </li>
          <li>
            The correlation coefficient ({formattedCorrelation}) indicates a {correlationStrength.toLowerCase()} {correlationDirection.toLowerCase()} relationship between {pollutant} levels and asthma emergencies
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TrendChart;
