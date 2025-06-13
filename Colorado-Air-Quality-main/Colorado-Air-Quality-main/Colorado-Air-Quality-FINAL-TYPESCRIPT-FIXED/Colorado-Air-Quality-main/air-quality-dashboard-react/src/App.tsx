import React, { useContext, useEffect } from 'react';
import Header from './components/layout/Header';
import Hero from './components/hero/Hero';
import StatCard from './components/stats/StatCard';
import MapView from './components/map/MapView';
import TrendChart from './components/charts/TrendChart';
import AboutPage from './components/AboutPage';
import { DataContext } from './context/DataContext';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('home');
  const [contentTab, setContentTab] = React.useState('map');
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

  // Function to get AQI color
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'rgba(0, 228, 0, 0.2)';
    if (aqi <= 100) return 'rgba(255, 255, 0, 0.2)';
    if (aqi <= 150) return 'rgba(255, 126, 0, 0.2)';
    if (aqi <= 200) return 'rgba(255, 0, 0, 0.2)';
    if (aqi <= 300) return 'rgba(143, 63, 151, 0.2)';
    return 'rgba(126, 0, 35, 0.2)';
  };

  // Function to scroll to map section
  const scrollToMap = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setContentTab('map');
      // Allow time for the home tab to render
      setTimeout(() => {
        const mapSection = document.getElementById('map-section');
        if (mapSection) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 0;
          const yOffset = -headerHeight - 20; // Additional 20px buffer
          const y = mapSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setContentTab('map');
      const mapSection = document.getElementById('map-section');
      if (mapSection) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const yOffset = -headerHeight - 20; // Additional 20px buffer
        const y = mapSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Function to handle tab navigation with smooth scrolling
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Scroll to center the content with header offset
    setTimeout(() => {
      const contentElement = document.getElementById(`${tab}-content`);
      if (contentElement) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const yOffset = -headerHeight - 20; // Additional 20px buffer
        const y = contentElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  // Filter out duplicate ZIP codes
  const filteredZipCodes = zipCodes.filter((item, index, self) => 
    index === self.findIndex((t) => t.value === item.value)
  );

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-text dark:text-gray-100">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      
      <main>
        {/* Hero Section */}
        <Hero scrollToMap={scrollToMap} />
        
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
        
        {/* Loading State */}
        {loading && (
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-lg">Loading air quality data...</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="container mx-auto px-4 py-8">
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
          </div>
        )}
        
        {!loading && (
          <>
            {/* Home Tab */}
            {activeTab === 'home' && (
              <div id="home-content" className="animate-fade-in">
                {/* Content Tabs */}
                <div className="container mx-auto px-4 mb-4">
                  <div className="flex justify-center space-x-2 border-b border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => setContentTab('map')}
                      className={`px-4 py-2 border-b-2 font-medium text-sm ${
                        contentTab === 'map'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Map
                    </button>
                    <button
                      onClick={() => setContentTab('trends')}
                      className={`px-4 py-2 border-b-2 font-medium text-sm ${
                        contentTab === 'trends'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Trends
                    </button>
                    <button
                      onClick={() => setContentTab('asthma')}
                      className={`px-4 py-2 border-b-2 font-medium text-sm ${
                        contentTab === 'asthma'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Asthma
                    </button>
                    <button
                      onClick={() => setContentTab('about')}
                      className={`px-4 py-2 border-b-2 font-medium text-sm ${
                        contentTab === 'about'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      About
                    </button>
                  </div>
                </div>

                {contentTab === 'map' && (
                  <section id="map-section" className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Colorado Air Quality Map</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                      Interactive map showing air quality levels across Colorado. Larger circles indicate higher pollution levels. 
                      Color indicates AQI category.
                    </p>
                    
                    <div className="mb-8 relative">
                      <MapView darkMode={darkMode} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                      <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Most Polluted Cities</h3>
                        <div className="space-y-3">
                          {mostPollutedCities && mostPollutedCities.length > 0 ? (
                            mostPollutedCities.map((city, index) => (
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
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No pollution data available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Cleanest Cities</h3>
                        <div className="space-y-3">
                          {cleanestCities && cleanestCities.length > 0 ? (
                            cleanestCities.map((city, index) => (
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
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No pollution data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {contentTab === 'trends' && (
                  <section className="container mx-auto px-4 py-8">
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
                              {filteredZipCodes.map((item, index) => (
                                <option key={index} value={item.value}>
                                  {item.value === 'all' ? 'All ZIP Codes' : `${item.zip} - ${item.city}`}
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
                        
                        <TrendChart />
                      </div>
                    </div>
                  </section>
                )}

                {contentTab === 'asthma' && (
                  <section className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Asthma Statistics</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                      Asthma prevalence and emergency visit data across Colorado counties and ZIP codes.
                    </p>
                    
                    <div className="card mb-8">
                      <h3 className="text-lg font-semibold mb-4">Asthma Prevalence by County</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Adult Asthma Prevalence</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>Denver County</span>
                              <span className="font-medium">8.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Boulder County</span>
                              <span className="font-medium">7.5%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>El Paso County</span>
                              <span className="font-medium">9.1%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Larimer County</span>
                              <span className="font-medium">7.8%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Jefferson County</span>
                              <span className="font-medium">8.0%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Child Asthma Prevalence</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span>Denver County</span>
                              <span className="font-medium">9.7%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Boulder County</span>
                              <span className="font-medium">8.3%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>El Paso County</span>
                              <span className="font-medium">10.2%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Larimer County</span>
                              <span className="font-medium">8.9%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Jefferson County</span>
                              <span className="font-medium">9.1%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4">Emergency Department Visits</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Rate of asthma-related emergency department visits per 10,000 population.
                      </p>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">County</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rate (per 10,000)</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trend</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">Denver</td>
                              <td className="px-4 py-3 whitespace-nowrap">42.3</td>
                              <td className="px-4 py-3 whitespace-nowrap text-red-500">↑ 5.2%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">Boulder</td>
                              <td className="px-4 py-3 whitespace-nowrap">31.7</td>
                              <td className="px-4 py-3 whitespace-nowrap text-green-500">↓ 2.1%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">El Paso</td>
                              <td className="px-4 py-3 whitespace-nowrap">38.9</td>
                              <td className="px-4 py-3 whitespace-nowrap text-red-500">↑ 3.7%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">Larimer</td>
                              <td className="px-4 py-3 whitespace-nowrap">29.4</td>
                              <td className="px-4 py-3 whitespace-nowrap text-green-500">↓ 1.8%</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 whitespace-nowrap">Jefferson</td>
                              <td className="px-4 py-3 whitespace-nowrap">33.6</td>
                              <td className="px-4 py-3 whitespace-nowrap text-red-500">↑ 0.9%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                )}

                {contentTab === 'about' && <AboutPage />}
              </div>
            )}
            
            {/* About Me Tab */}
            {activeTab === 'about-me' && (
              <div id="about-me-content" className="animate-fade-in">
                <section className="container mx-auto px-4 py-8">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
                    
                    <div className="card mb-8">
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-4">Mateus Stocco Di Francesco</h3>
                          
                          <div className="prose dark:prose-invert max-w-none">
                            <p>Hi! I'm Mateus Stocco Di Francesco, the creator of this website.</p>
                            
                            <p>I'm a pre-med student from São Paulo, Brazil, a city known for its heavy traffic and high pollution levels. Growing up there, I saw firsthand how poor air quality can affect asthma and other respiratory conditions. That experience shaped my interest in environmental health and inspired this project.</p>
                            
                            <p>Now based in Colorado, I'm studying to become a doctor while also exploring my passion for coding and data science. I love using code to solve real-world problems, especially ones that blend public health, accessibility, and technology. This site is a personal project that brings those interests together: tracking air pollution, visualizing health data, and making it easy for people to explore trends in their area.</p>
                            
                            <p>I built this platform using tools like Python, Streamlit, and PostgreSQL, and I'm always learning new ways to improve it.</p>
                            
                            <p>Outside of research and programming, I enjoy reading (<a href="#books" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">check out my book recommendations!</a>), working on community health projects, and connecting with others who care about science, equity, and innovation.</p>
                            
                            <p>Thanks for visiting, and feel free to connect with me on <a href="https://www.linkedin.com/in/mateus-di-francesco/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">LinkedIn!</a></p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card">
                      <h3 className="text-xl font-bold mb-4">My Research Interests</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                          <div className="flex items-center mb-3">
                            <svg className="w-6 h-6 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            <h4 className="font-semibold">Environmental Health</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">Studying the relationship between air pollution and respiratory health outcomes, with a focus on vulnerable populations.</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                          <div className="flex items-center mb-3">
                            <svg className="w-6 h-6 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h4 className="font-semibold">Data Visualization</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">Creating accessible tools that help people understand complex health data and make informed decisions about their environment.</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                          <div className="flex items-center mb-3">
                            <svg className="w-6 h-6 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            <h4 className="font-semibold">Asthma Prevention</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">Developing strategies to reduce asthma triggers and improve quality of life for those with respiratory conditions.</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                          <div className="flex items-center mb-3">
                            <svg className="w-6 h-6 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                            <h4 className="font-semibold">Health Equity</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">Addressing disparities in environmental health impacts across different communities and advocating for equitable access to clean air.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
            
            {/* Book Recommendations Tab */}
            {activeTab === 'books' && (
              <div id="books-content" className="animate-fade-in">
                <section id="books" className="container mx-auto px-4 py-8">
                  <h2 className="text-3xl font-bold mb-8 text-center">Book Recommendations</h2>
                  
                  <div className="max-w-4xl mx-auto">
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                      Here are some of my favorite books related to environmental health, medicine, and data science.
                    </p>
                    
                    <div className="space-y-8">
                      {/* Book 1 */}
                      <div className="card">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/4 flex-shrink-0">
                            <div className="aspect-w-2 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Breathing Space: How Air Pollution Affects Our Health</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">By Mark Z. Jacobson</p>
                            <div className="prose dark:prose-invert max-w-none mb-4">
                              <p>A comprehensive look at how air pollution impacts respiratory health across different populations. This book changed my perspective on environmental health policy and inspired my work on this dashboard.</p>
                            </div>
                            <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition">Read More</button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Book 2 */}
                      <div className="card">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/4 flex-shrink-0">
                            <div className="aspect-w-2 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Data Visualization: A Practical Introduction</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">By Kieran Healy</p>
                            <div className="prose dark:prose-invert max-w-none mb-4">
                              <p>This book taught me how to transform complex environmental health data into clear, compelling visualizations that tell a story. The techniques I learned here directly influenced the design of this dashboard.</p>
                            </div>
                            <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition">Read More</button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Book 3 */}
                      <div className="card">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/4 flex-shrink-0">
                            <div className="aspect-w-2 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">The Invisible Kingdom: Reimagining Chronic Illness</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">By Meghan O'Rourke</p>
                            <div className="prose dark:prose-invert max-w-none mb-4">
                              <p>A powerful exploration of how environmental factors contribute to chronic health conditions. This book helped me understand the lived experiences of people with environmentally-triggered health issues.</p>
                            </div>
                            <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition">Read More</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
            
            {/* About Tab (Project Info) */}
            {activeTab === 'about' && <AboutPage />}
          </>
        )}
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
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Monitoring air quality and asthma rates across Colorado.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/Mateusinhoo" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition"
                  aria-label="GitHub"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/mateus-di-francesco/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-500 transition"
                  aria-label="LinkedIn"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Mateus Stocco Di Francesco
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
