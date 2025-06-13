import React, { useContext, useEffect, useState, useRef } from 'react';
import './App.css';
import { DataContext } from './context/DataContext';
import Header from './components/layout/Header';
import Hero from './components/hero/Hero';
import MapView from './components/map/MapView';
import TrendChart from './components/charts/TrendChart';
import AboutPage from './components/AboutPage';

// Function to get color based on AQI value
const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'rgba(0, 228, 0, 0.2)';
  if (aqi <= 100) return 'rgba(255, 255, 0, 0.2)';
  if (aqi <= 150) return 'rgba(255, 126, 0, 0.2)';
  if (aqi <= 200) return 'rgba(255, 0, 0, 0.2)';
  if (aqi <= 300) return 'rgba(143, 63, 151, 0.2)';
  return 'rgba(126, 0, 35, 0.2)';
};

function App() {
  const { 
    airQualityData, 
    trendData, 
    selectedZip, 
    selectedPollutant,
    mostPollutedCities,
    cleanestCities,
    zipCodes,
    loading,
    error,
    setSelectedZip,
    setSelectedPollutant
  } = useContext(DataContext);
  
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  const [activeTab, setActiveTab] = useState<string>('home');
  const [contentTab, setContentTab] = useState<string>('map');
  
  // Refs for scroll targets
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const booksSectionRef = useRef<HTMLDivElement>(null);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };
  
  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Handle tab change with smooth scrolling
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Smooth scroll with offset for header
    setTimeout(() => {
      const contentElement = document.getElementById(`${tab}-content`);
      if (contentElement) {
        const headerHeight = 80; // Approximate header height
        const yOffset = -headerHeight - 20; // Additional offset for spacing
        const y = contentElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 100);
  };
  
  // Handle scroll to map section
  const scrollToMap = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setContentTab('map');
      
      // Wait for tab change to complete before scrolling
      setTimeout(() => {
        if (mapSectionRef.current) {
          const headerHeight = 80; // Approximate header height
          const yOffset = -headerHeight - 20; // Additional offset for spacing
          const y = mapSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Already on home tab, just scroll to map
      if (mapSectionRef.current) {
        const headerHeight = 80; // Approximate header height
        const yOffset = -headerHeight - 20; // Additional offset for spacing
        const y = mapSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }
  };
  
  // Handle scroll to books section
  const scrollToBooks = () => {
    if (activeTab !== 'books') {
      setActiveTab('books');
      
      // Wait for tab change to complete before scrolling
      setTimeout(() => {
        if (booksSectionRef.current) {
          const headerHeight = 80; // Approximate header height
          const yOffset = -headerHeight - 20; // Additional offset for spacing
          const y = booksSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Already on books tab, just scroll to top of books section
      if (booksSectionRef.current) {
        const headerHeight = 80; // Approximate header height
        const yOffset = -headerHeight - 20; // Additional offset for spacing
        const y = booksSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        {/* Header */}
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
        
        <main>
          {/* Hero Section */}
          <Hero scrollToMap={scrollToMap} />
          
          {/* Main Content */}
          {activeTab === 'home' && (
            <div id="home-content" className="animate-fade-in">
              {/* Secondary Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4">
                  <div className="flex overflow-x-auto space-x-4 py-2">
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
              </div>

              {contentTab === 'map' && (
                <section ref={mapSectionRef} id="map-section" className="container mx-auto px-4 py-8">
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
                  <h2 className="text-2xl font-bold mb-6 text-center">Air Quality Trends</h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                    Analyze air quality trends and their correlation with asthma rates over time.
                  </p>
                  
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="w-full md:w-1/2">
                        <label htmlFor="zip-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Location
                        </label>
                        <select
                          id="zip-select"
                          value={selectedZip}
                          onChange={(e) => setSelectedZip(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                        >
                          {zipCodes.map((zip, index) => (
                            <option key={index} value={zip.value}>
                              {zip.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="w-full md:w-1/2">
                        <label htmlFor="pollutant-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Select Pollutant
                        </label>
                        <select
                          id="pollutant-select"
                          value={selectedPollutant}
                          onChange={(e) => setSelectedPollutant(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                        >
                          <option value="PM2.5">PM2.5</option>
                          <option value="OZONE">Ozone</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="card">
                      <TrendChart data={trendData} darkMode={darkMode} />
                    </div>
                  </div>
                </section>
              )}

              {contentTab === 'asthma' && (
                <section className="container mx-auto px-4 py-8">
                  <h2 className="text-2xl font-bold mb-6 text-center">Asthma Statistics</h2>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                    Colorado asthma prevalence and emergency visit data by county.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4">Asthma Prevalence</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Percentage of population with diagnosed asthma by county.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
                
                <div className="card mb-8 max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-4 text-center md:text-left">Mateus Stocco Di Francesco</h3>
                      
                      <div className="prose dark:prose-invert max-w-none space-y-4">
                        <p>Hi! I'm Mateus Stocco Di Francesco, the creator of this website.</p>
                        
                        <p>I'm a pre-med student from São Paulo, Brazil, a city known for its heavy traffic and high pollution levels. Growing up there, I saw firsthand how poor air quality can affect asthma and other respiratory conditions. That experience shaped my interest in environmental health and inspired this project.</p>
                        
                        <p>Now based in Colorado, I'm studying to become a doctor while also exploring my passion for coding and data science. I love using code to solve real-world problems, especially ones that blend public health, accessibility, and technology. This site is a personal project that brings those interests together: tracking air pollution, visualizing health data, and making it easy for people to explore trends in their area.</p>
                        
                        <p>I built this platform using tools like Python, Streamlit, and PostgreSQL, and I'm always learning new ways to improve it.</p>
                        
                        <p>Outside of research and programming, I enjoy reading (<button onClick={scrollToBooks} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline bg-transparent border-none cursor-pointer p-0">check out my book recommendations!</button>), working on community health projects, and connecting with others who care about science, equity, and innovation.</p>
                        
                        <p>Thanks for visiting, and feel free to connect with me on <a href="https://www.linkedin.com/in/mateus-di-francesco/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium">LinkedIn!</a></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card max-w-4xl mx-auto">
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
              </section>
            </div>
          )}
          
          {/* Book Recommendations Tab */}
          {activeTab === 'books' && (
            <div id="books-content" className="animate-fade-in">
              <section ref={booksSectionRef} id="books" className="container mx-auto px-4 py-8">
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
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">Breath: The New Science of a Lost Art</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by James Nestor</p>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            A fascinating exploration of how the way we breathe affects our health, including respiratory conditions like asthma. Nestor combines historical research with modern science to show how proper breathing techniques can improve health outcomes.
                          </p>
                          
                          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Read More
                            <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Book 2 */}
                    <div className="card">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4 flex-shrink-0">
                          <div className="aspect-w-2 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">Clearing the Air: The Beginning and the End of Air Pollution</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by Tim Smedley</p>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            An insightful look at air pollution around the world, its health impacts, and potential solutions. Smedley combines personal stories with scientific research to create a compelling narrative about one of our most pressing environmental health challenges.
                          </p>
                          
                          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Read More
                            <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Book 3 */}
                    <div className="card">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4 flex-shrink-0">
                          <div className="aspect-w-2 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">Visualizing Data: Exploring and Explaining Data with the Processing Environment</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">by Ben Fry</p>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            A practical guide to data visualization that has influenced how I approach presenting complex health information. Fry provides both theoretical frameworks and hands-on techniques for creating visualizations that reveal patterns and insights in data.
                          </p>
                          
                          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Read More
                            <svg className="ml-2 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  © {new Date().getFullYear()} Colorado Air Quality & Asthma Tracker
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Data provided by AirNow API and CDC Environmental Health Tracking Network
                </p>
              </div>
              
              <div className="flex space-x-4">
                <a
                  href="https://github.com/Mateusinhoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  aria-label="GitHub"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                
                <a
                  href="https://www.linkedin.com/in/mateus-di-francesco/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  aria-label="LinkedIn"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
