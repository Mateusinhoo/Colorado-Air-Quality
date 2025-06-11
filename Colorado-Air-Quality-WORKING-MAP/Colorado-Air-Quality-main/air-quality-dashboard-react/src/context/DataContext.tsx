import React, { useState } from 'react';

// Mock data for air quality
const mockAirQualityData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-104.9903, 39.7392] // Denver
      },
      properties: {
        city: 'Denver',
        zip: '80202',
        AQI: 75,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-104.8214, 38.8339] // Colorado Springs
      },
      properties: {
        city: 'Colorado Springs',
        zip: '80903',
        AQI: 45,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-105.0844, 40.5853] // Fort Collins
      },
      properties: {
        city: 'Fort Collins',
        zip: '80521',
        AQI: 30,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-108.5506, 39.0639] // Grand Junction
      },
      properties: {
        city: 'Grand Junction',
        zip: '81501',
        AQI: 20,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-104.6091, 38.2544] // Pueblo
      },
      properties: {
        city: 'Pueblo',
        zip: '81001',
        AQI: 55,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-106.8317, 39.1911] // Aspen
      },
      properties: {
        city: 'Aspen',
        zip: '81611',
        AQI: 25,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-105.0166, 39.5501] // Boulder
      },
      properties: {
        city: 'Boulder',
        zip: '80301',
        AQI: 40,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-107.8801, 37.9375] // Durango
      },
      properties: {
        city: 'Durango',
        zip: '81301',
        AQI: 35,
        Pollutant: 'PM2.5'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-106.9253, 38.8339] // Gunnison
      },
      properties: {
        city: 'Gunnison',
        zip: '81230',
        AQI: 20,
        Pollutant: 'PM2.5'
      }
    }
  ]
};

// Mock data for trend charts
const generateTrendData = (zipCode: string, pollutant: string) => {
  const baseValue = Math.floor(Math.random() * 30) + 20; // Random base value between 20-50
  const asthmaRate = (Math.random() * 3 + 6).toFixed(1); // Random asthma rate between 6-9%
  
  const today = new Date();
  const data = [];
  
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (13 - i));
    
    // Create some variation in the values
    const variation = Math.sin(i / 2) * 10 + (Math.random() * 10 - 5);
    const value = Math.max(5, Math.round(baseValue + variation));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: value,
      asthmaRate: parseFloat(asthmaRate)
    });
  }
  
  return data;
};

// Mock data for rankings
const getMostPollutedCities = () => {
  return mockAirQualityData.features
    .map(feature => ({
      city: feature.properties.city,
      zip: feature.properties.zip,
      aqi: feature.properties.AQI
    }))
    .sort((a, b) => b.aqi - a.aqi)
    .slice(0, 5);
};

const getCleanestCities = () => {
  return mockAirQualityData.features
    .map(feature => ({
      city: feature.properties.city,
      zip: feature.properties.zip,
      aqi: feature.properties.AQI
    }))
    .sort((a, b) => a.aqi - b.aqi)
    .slice(0, 5);
};

// Mock data for ZIP codes
const getZipCodes = () => {
  return mockAirQualityData.features.map(feature => ({
    zip: feature.properties.zip,
    city: feature.properties.city
  }));
};

// Data context
export const DataContext = React.createContext<{
  airQualityData: typeof mockAirQualityData;
  trendData: any[];
  selectedZip: string;
  selectedPollutant: string;
  mostPollutedCities: any[];
  cleanestCities: any[];
  zipCodes: any[];
  setSelectedZip: (zip: string) => void;
  setSelectedPollutant: (pollutant: string) => void;
}>({
  airQualityData: mockAirQualityData,
  trendData: [],
  selectedZip: 'all',
  selectedPollutant: 'PM2.5',
  mostPollutedCities: [],
  cleanestCities: [],
  zipCodes: [],
  setSelectedZip: () => {},
  setSelectedPollutant: () => {}
});

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedZip, setSelectedZip] = useState<string>('all');
  const [selectedPollutant, setSelectedPollutant] = useState<string>('PM2.5');
  
  // Generate trend data based on selected ZIP and pollutant
  const trendData = generateTrendData(selectedZip, selectedPollutant);
  
  // Get rankings
  const mostPollutedCities = getMostPollutedCities();
  const cleanestCities = getCleanestCities();
  
  // Get ZIP codes for dropdown
  const zipCodes = getZipCodes();
  
  const value = {
    airQualityData: mockAirQualityData,
    trendData,
    selectedZip,
    selectedPollutant,
    mostPollutedCities,
    cleanestCities,
    zipCodes,
    setSelectedZip,
    setSelectedPollutant
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
