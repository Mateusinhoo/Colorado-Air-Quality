import React, { useContext } from 'react';
import Header from './components/layout/Header';
import Hero from './components/hero/Hero';
import StatCard from './components/stats/StatCard';
import MapView from './components/map/MapView';
import TrendChart from './components/charts/TrendChart';
import { DataContext } from './context/DataContext';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('map');
  const { 
    selectedZip, 
    selectedPollutant, 
    setSelectedZip, 
    setSelectedPollutant,
    mostPollutedCities,
    cleanestCities,
    zipCodes,
    asthmaStatistics,
    loading,
    error,
    refreshData
  } = useContext(DataContext);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode class to html element
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-text dark:text-gray-100">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Stats Section */}
        <section className="container mx-auto px-4 py-8 -mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              value="471" 
              label="Monitoring Stations" 
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />
            <StatCard 
              value={`${asthmaStatistics.averagePrevalence.toFixed(1)}%`}
              label="Avg. Asthma Rate" 
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
            <StatCard 
              value="24/7" 
              label="Real-time Updates" 
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard 
              value="PM2.5" 
              label="Primary Pollutant" 
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              }
            />
          </div>
        </section>
        
        {/* Tab Navigation */}
        <section className="container mx-auto px-4 py-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab('map')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'map'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('trends')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'trends'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Trends
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('asthma')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'asthma'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Asthma
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'about'
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </div>
              </button>
            </nav>
          </div>
        </section>
        
        {/* Tab Content */}
        <section className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-lg">Loading air quality data...</span>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 dark:text-red-300">{error}</span>
                <button 
                  onClick={refreshData}
                  className="ml-auto px-3 py-1 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          {!loading && (
            <>
              {activeTab === 'map' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-center">Colorado Air Quality Map</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Interactive map showing air quality levels across Colorado. Larger circles indicate higher pollution levels. 
                Color indicates AQI category.
              </p>
              
              <div className="mb-8">
                <MapView darkMode={darkMode} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Most Polluted Cities</h3>
                  <div className="space-y-3">
                    {mostPollutedCities.map((city, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          <span>{city.city} ({city.zip})</span>
                        </div>
                        <span 
                          className="px-2 py-1 rounded text-sm font-medium"
                          style={{ backgroundColor: getAQIColor(city.aqi) }}
                        >
                          {city.aqi}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Cleanest Cities</h3>
                  <div className="space-y-3">
                    {cleanestCities.map((city, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          <span>{city.city} ({city.zip})</span>
                        </div>
                        <span 
                          className="px-2 py-1 rounded text-sm font-medium"
                          style={{ backgroundColor: getAQIColor(city.aqi) }}
                        >
                          {city.aqi}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'trends' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-center">Pollution Trend Analysis</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Recent air quality levels for selected ZIP codes and pollutants. Interactive and zoomable charts.
              </p>
              
              <div className="mb-8">
                <div className="card mb-8">
                  <div className="flex flex-wrap items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Filter Options</h3>
                    <div className="flex flex-wrap gap-4 mt-2 sm:mt-0">
                      <select 
                        className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                        value={selectedZip}
                        onChange={(e) => setSelectedZip(e.target.value)}
                      >
                        <option value="all">All ZIP Codes</option>
                        {zipCodes.map((item, index) => (
                          <option key={index} value={item.zip}>
                            {item.zip} - {item.city}
                          </option>
                        ))}
                      </select>
                      <select 
                        className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                        value={selectedPollutant}
                        onChange={(e) => setSelectedPollutant(e.target.value)}
                      >
                        <option value="PM2.5">PM2.5</option>
                        <option value="O₃">O₃ (Ozone)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Current {selectedPollutant} Level</span>
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">43 μg/m³</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill bg-primary-500" style={{ width: '43%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">24-hour Average</span>
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">38 μg/m³</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill bg-primary-500" style={{ width: '38%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Weekly Average</span>
                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">41 μg/m³</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill bg-primary-500" style={{ width: '41%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <TrendChart />
              </div>
            </div>
          )}
          
          {activeTab === 'asthma' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-center">Asthma & Air Quality Correlation</h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                Explore the relationship between air pollution levels and asthma rates across Colorado ZIP codes.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <TrendChart />
                </div>
                
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Colorado Asthma Statistics</h3>
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Asthma Prevalence</span>
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          {asthmaStatistics.averagePrevalence.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    {asthmaStatistics.adultPrevalence && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Adult Prevalence (18+)</span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {asthmaStatistics.adultPrevalence.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                    {asthmaStatistics.childPrevalence && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Child Prevalence (0-17)</span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {asthmaStatistics.childPrevalence.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Counties with Data</span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {asthmaStatistics.totalCounties}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-md font-semibold mb-3">Key Insights</h4>
                  <ul className="space-y-3">
                    <li className="flex">
                      <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">
                        {asthmaStatistics.dataAvailable 
                          ? `Real-time data from ${asthmaStatistics.totalCounties} Colorado counties shows asthma prevalence of ${asthmaStatistics.averagePrevalence.toFixed(1)}%.`
                          : 'Using national averages as baseline for Colorado asthma prevalence estimates.'
                        }
                      </span>
                    </li>
                    <li className="flex">
                      <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">ZIP codes with PM2.5 levels above 35 μg/m³ show higher asthma rates on average.</span>
                    </li>
                    <li className="flex">
                      <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Seasonal variations show stronger correlations during summer months when ozone levels peak.</span>
                    </li>
                    <li className="flex">
                      <svg className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Urban areas show higher correlation between air quality and asthma rates compared to rural areas.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold mb-6 text-center">About This Project</h2>
              <div className="max-w-3xl mx-auto">
                <div className="card mb-8">
                  <h3 className="text-lg font-semibold mb-4">Project Purpose</h3>
                  <p className="mb-4">
                    The Colorado Air & Asthma Tracker is designed to visualize the relationship between air quality and asthma rates 
                    across Colorado. By providing real-time air pollution data alongside health statistics, we aim to help residents 
                    make informed decisions about their respiratory health.
                  </p>
                  <p>
                    This interactive dashboard focuses on tracking PM2.5 and O₃ (ozone) levels, which are key pollutants 
                    associated with respiratory issues and asthma exacerbation.
                  </p>
                </div>
                
                <div className="card mb-8">
                  <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span><strong>Air Quality Data:</strong> EPA Air Quality System and AirNow API</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span><strong>Asthma Statistics:</strong> Colorado Department of Public Health and Environment</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span><strong>Geographic Data:</strong> U.S. Census Bureau</span>
                    </li>
                  </ul>
                </div>
                
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <a href="#" className="text-primary-600 hover:underline dark:text-primary-400">EPA Air Quality Guide for Particle Pollution</a>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <a href="#" className="text-primary-600 hover:underline dark:text-primary-400">American Lung Association - State of the Air Report</a>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <a href="#" className="text-primary-600 hover:underline dark:text-primary-400">Colorado Asthma Care Program</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </section>
      </main>
      
      <footer className="bg-gray-50 dark:bg-gray-800 mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-8 h-8 text-primary-500"
                >
                  <path d="M12 2a1 1 0 0 1 1 1c0 .24-.103.446-.271.623A4.126 4.126 0 0 0 11 7.5V9h1c3.866 0 7 3.134 7 7v5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-5c0-3.866 3.134-7 7-7h1V7.5a4.126 4.126 0 0 0-1.729-3.377A1.003 1.003 0 0 1 7 3a1 1 0 0 1 1-1h4z"/>
                </svg>
                <span className="ml-2 text-xl font-bold text-primary-500">Colorado Air & Asthma Tracker</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Monitoring air quality and asthma rates across Colorado
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-500">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Colorado Air & Asthma Tracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper function to get color based on AQI value
const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#a8e05f';
  if (aqi <= 100) return '#fdd74b';
  if (aqi <= 150) return '#fe9b57';
  if (aqi <= 200) return '#fe6a69';
  if (aqi <= 300) return '#a97abc';
  return '#a87383';
};

export default App;
