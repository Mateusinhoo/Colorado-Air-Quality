import React, { useContext } from 'react';
import Header from './components/layout/Header';
import Hero from './components/hero/Hero';
import StatCard from './components/stats/StatCard';
import MapView from './components/map/MapView';
import TrendChart from './components/charts/TrendChart';
import AsthmaEducation from './components/AsthmaEducation';
import AboutMe from './components/AboutMe';
import InSimpleTerms from './components/InSimpleTerms';
import { DataContext } from './context/DataContext';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('home');
  const [homeSubTab, setHomeSubTab] = React.useState('map');
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
    refreshData,
    trendData
  } = useContext(DataContext);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle tab changes with smooth scrolling
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Smooth scroll to content area when switching tabs
    setTimeout(() => {
      const contentElement = document.querySelector('main');
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle navigation to In Simple Terms from other components
  React.useEffect(() => {
    const handleNavigateToInSimpleTerms = () => {
      setActiveTab('in-simple-terms');
    };

    window.addEventListener('navigateToInSimpleTerms', handleNavigateToInSimpleTerms);
    return () => window.removeEventListener('navigateToInSimpleTerms', handleNavigateToInSimpleTerms);
  }, []);

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
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      
      <main>
        {/* Home Tab Content */}
        {activeTab === 'home' && (
          <>
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
            
            {/* Home Sub-Tab Navigation */}
            <section className="container mx-auto px-4 py-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setHomeSubTab('map')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'map'
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
                    onClick={() => setHomeSubTab('trends')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'trends'
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
                    onClick={() => setHomeSubTab('asthma')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'asthma'
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
                    onClick={() => setHomeSubTab('about')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      homeSubTab === 'about'
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
            
            {/* Home Sub-Tab Content */}
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
                  {homeSubTab === 'map' && (
                    <div className="animate-fade-in">
                      <h2 className="text-2xl font-bold mb-6 text-center">Colorado Air Quality Map</h2>
                      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                        Interactive map showing air quality levels across Colorado. Larger circles indicate higher pollution levels. 
                        Color indicates AQI category.
                      </p>
                      
                      <div className="mb-8" style={{ zIndex: 10 }}>
                        <MapView darkMode={darkMode} />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Most Polluted Cities</h3>
                          <div className="space-y-3">
                            {mostPollutedCities.length > 0 ? mostPollutedCities.map((city, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                                    {index + 1}
                                  </span>
                                  <span>{city.city} ({city.zip})</span>
                                </div>
                                <span 
                                  className="px-2 py-1 rounded text-sm font-medium text-white"
                                  style={{ backgroundColor: getAQIColor(city.aqi) }}
                                >
                                  {city.aqi}
                                </span>
                              </div>
                            )) : (
                              <p className="text-gray-500 dark:text-gray-400">Loading city data...</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Cleanest Cities</h3>
                          <div className="space-y-3">
                            {cleanestCities.length > 0 ? cleanestCities.map((city, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-medium mr-3">
                                    {index + 1}
                                  </span>
                                  <span>{city.city} ({city.zip})</span>
                                </div>
                                <span 
                                  className="px-2 py-1 rounded text-sm font-medium text-white"
                                  style={{ backgroundColor: getAQIColor(city.aqi) }}
                                >
                                  {city.aqi}
                                </span>
                              </div>
                            )) : (
                              <p className="text-gray-500 dark:text-gray-400">Loading city data...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {homeSubTab === 'trends' && (
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
                          
                          <div className="card">
                            <TrendChart data={trendData} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {homeSubTab === 'asthma' && (
                    <div className="animate-fade-in">
                      <h2 className="text-2xl font-bold mb-6 text-center">Asthma Statistics</h2>
                      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                        Asthma prevalence and health statistics for Colorado communities.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="card text-center">
                          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                            {asthmaStatistics.averagePrevalence.toFixed(1)}%
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Average Asthma Rate</div>
                        </div>
                        
                        <div className="card text-center">
                          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                            {asthmaStatistics.totalCounties}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Counties Monitored</div>
                        </div>
                        
                        <div className="card text-center">
                          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                            {asthmaStatistics.dataAvailable ? 'Live' : 'Estimated'}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">Data Status</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {homeSubTab === 'about' && (
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
                          <h3 className="text-lg font-semibold mb-4">Data Sources & Resources</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Air Quality Data:</strong> <a href="https://www.airnow.gov/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">EPA AirNow API</a></span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Asthma Statistics:</strong> <a href="https://ephtracking.cdc.gov/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">CDC Environmental Health Tracking Network</a></span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Emergency Visit Data:</strong> <a href="https://ephtracking.cdc.gov/DataExplorer/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">CDC Tracking Data Explorer</a></span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Hospitalization Data:</strong> <a href="https://ephtracking.cdc.gov/DataExplorer/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">CDC Environmental Health Tracking</a></span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Correlation Analysis:</strong> Time-lag analysis between pollution and asthma events</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Seasonal Analysis:</strong> Adjustment factors for seasonal asthma patterns</span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span><strong>Geographic Data:</strong> <a href="https://www.census.gov/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">U.S. Census Bureau</a></span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Additional Resources</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <a href="https://www.epa.gov/pm-pollution/particulate-matter-pm-basics" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">EPA Air Quality Guide for Particle Pollution</a>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <a href="https://www.lung.org/research/sota" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">American Lung Association - State of the Air Report</a>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <a href="https://cdphe.colorado.gov/asthma" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">Colorado Asthma Care Program</a>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <a href="https://www.cdc.gov/asthma/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">CDC Asthma Information</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {/* Asthma Education Tab */}
        {activeTab === 'asthma-education' && (
          <section className="container mx-auto px-4 py-8">
            <AsthmaEducation />
          </section>
        )}

        {/* About Me Tab */}
        {activeTab === 'about-me' && (
          <section className="container mx-auto px-4 py-8">
            <AboutMe 
              darkMode={darkMode} 
              onNavigateToInSimpleTerms={() => setActiveTab('in-simple-terms')}
            />
          </section>
        )}

        {/* In Simple Terms Tab */}
        {activeTab === 'in-simple-terms' && (
          <section className="container mx-auto px-4 py-8">
            <InSimpleTerms darkMode={darkMode} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Colorado Air & Asthma Tracker
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Monitoring air quality and asthma rates across Colorado
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a 
                href="https://github.com/Mateusinhoo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-500"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/in/mateus-di-francesco/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-primary-500"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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

