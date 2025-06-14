import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">About This Project</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Learn more about the Colorado Air Quality & Asthma Tracker, our data sources, and methodology.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Colorado Air Quality & Asthma Tracker is a comprehensive dashboard that visualizes the relationship between air pollution and asthma rates across Colorado. Our goal is to provide accessible, actionable information to help residents make informed decisions about their health and environment.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              This project combines real-time air quality data with asthma statistics to identify patterns, correlations, and high-risk areas. We focus particularly on emergency department visits and hospitalizations related to asthma exacerbations, which often correlate with poor air quality events.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Methodology</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our dashboard employs advanced correlation analysis to identify relationships between air pollutants and asthma events. We analyze:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>Time-lag effects (0-7 days) between pollution exposure and health outcomes</li>
              <li>Seasonal variations in asthma-pollution relationships</li>
              <li>Statistical significance of correlations using p-value analysis</li>
              <li>Geographic distribution of high-risk areas across Colorado</li>
              <li>Population-adjusted metrics to account for demographic differences</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Data Sources & Resources</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <a href="https://www.airnow.gov/state/?name=colorado" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">AirNow API - Real-time air quality data</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <a href="https://ephtracking.cdc.gov/DataExplorer/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">CDC Environmental Health Tracking Network - Asthma prevalence data</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <a href="https://www.colorado.gov/cdphe/data" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">Colorado Department of Public Health & Environment - County-level health statistics</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <a href="https://www.census.gov/data.html" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">U.S. Census Bureau - Population data by ZIP code</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <a href="https://www.cdc.gov/asthma/healthcare-use/healthcare-use.htm" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">CDC Asthma Emergency Department Visits - Emergency visit statistics</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <a href="https://www.cdc.gov/asthma/asthmadata.htm" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">CDC Asthma Hospitalization Data - Hospitalization statistics</a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-primary-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <a href="https://www.epa.gov/outdoor-air-quality-data" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">EPA Air Quality System - Historical pollution data</a>
              </li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Technical Details</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This dashboard is built using modern web technologies:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
              <li>React for the user interface</li>
              <li>Tailwind CSS for styling</li>
              <li>Mapbox GL for interactive mapping</li>
              <li>Recharts for data visualization</li>
              <li>Python backend for data processing and API integration</li>
              <li>Statistical analysis using R for correlation studies</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Our correlation analysis implements time-series methods to identify relationships between environmental factors and health outcomes, with particular attention to time-lag effects and seasonal variations.
            </p>
          </div>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">New Features & Enhancements</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Advanced Correlation Analysis:</span> Statistical correlation between pollution levels and asthma emergency visits
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Time-Lag Analysis:</span> Visualization of delayed effects (1-2 days) between pollution exposure and health impacts
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">High Alert System:</span> Identification of days with both elevated pollution and asthma emergencies
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Seasonal Analysis:</span> Adjustment for known seasonal patterns in asthma (spring/fall allergy seasons)
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Expanded Coverage:</span> Data for 50 major Colorado ZIP codes with accurate population information
                </span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Emergency Visit Integration:</span> Real-time data on asthma-related emergency department visits
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
