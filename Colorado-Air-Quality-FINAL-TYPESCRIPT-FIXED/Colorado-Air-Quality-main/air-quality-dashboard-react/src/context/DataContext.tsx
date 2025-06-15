import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  fetchColoradoCountyAsthmaData, 
  calculateAsthmaStatistics, 
  getMockAsthmaData,
  AsthmaDataPoint,
  fetchAsthmaEmergencyVisits,
  fetchAsthmaHospitalizations,
  AsthmaEventData,
  calculatePollutionAsthmaCorrelation,
  generateTimeLagAnalysis,
  identifyHighAlertDays,
  CorrelationData,
  getMockAsthmaEmergencyData,
  getMockAsthmaHospitalizationData
} from '../services/asthmaService';

// Types for API responses
interface AirNowObservation {
  DateObserved: string;
  HourObserved: number;
  LocalTimeZone: string;
  ReportingArea: string;
  StateCode: string;
  Latitude: number;
  Longitude: number;
  ParameterName: string;
  AQI: number;
  Category: {
    Number: number;
    Name: string;
  };
}

interface AirQualityFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    city: string;
    zip: string;
    AQI: number;
    Pollutant: string;
    category: string;
    dateObserved: string;
  };
}

interface AirQualityData {
  type: 'FeatureCollection';
  features: AirQualityFeature[];
}

interface AsthmaStatistics {
  averagePrevalence: number;
  adultPrevalence?: number;
  childPrevalence?: number;
  emergencyVisitRate?: number;
  hospitalizationRate?: number;
  totalCounties: number;
  dataAvailable: boolean;
  eventDataAvailable?: boolean;
}

interface HighAlertDay {
  date: string;
  pollutionValue: number;
  asthmaValue: number;
  alertLevel: 'high' | 'moderate' | 'low';
}

// Colorado cities with their ZIP codes, coordinates, and population data (Top 50)
const COLORADO_CITIES = [
  { name: 'Parker', zip: '80134', lat: 39.5186, lon: -104.7614, population: 77814 },
  { name: 'Aurora', zip: '80013', lat: 39.6880, lon: -104.7547, population: 74732 },
  { name: 'Aurora', zip: '80015', lat: 39.6292, lon: -104.8319, population: 72155 },
  { name: 'Aurora', zip: '80016', lat: 39.6292, lon: -104.7319, population: 66479 },
  { name: 'Greeley', zip: '80634', lat: 40.4233, lon: -104.7091, population: 63553 },
  { name: 'Longmont', zip: '80504', lat: 40.1672, lon: -105.1019, population: 61305 },
  { name: 'Denver', zip: '80219', lat: 39.7392, lon: -105.0178, population: 60095 },
  { name: 'Commerce City', zip: '80022', lat: 39.8083, lon: -104.9342, population: 59556 },
  { name: 'Denver', zip: '80229', lat: 39.8361, lon: -105.0178, population: 57274 },
  { name: 'Fort Collins', zip: '80525', lat: 40.5853, lon: -105.0844, population: 55541 },
  { name: 'Greeley', zip: '80631', lat: 40.4233, lon: -104.7591, population: 53920 },
  { name: 'Broomfield', zip: '80020', lat: 39.9205, lon: -105.0866, population: 53589 },
  { name: 'Aurora', zip: '80011', lat: 39.7292, lon: -104.8319, population: 53334 },
  { name: 'Aurora', zip: '80012', lat: 39.6792, lon: -104.8319, population: 51389 },
  { name: 'Loveland', zip: '80538', lat: 40.3978, lon: -105.0748, population: 49183 },
  { name: 'Colorado Springs', zip: '80918', lat: 38.9517, lon: -104.7319, population: 48291 },
  { name: 'Denver', zip: '80233', lat: 39.8392, lon: -105.0178, population: 47692 },
  { name: 'Littleton', zip: '80123', lat: 39.6133, lon: -105.0166, population: 45364 },
  { name: 'Loveland', zip: '80537', lat: 40.3978, lon: -105.1248, population: 44505 },
  { name: 'Littleton', zip: '80126', lat: 39.5633, lon: -105.0166, population: 44482 },
  { name: 'Fort Collins', zip: '80526', lat: 40.5353, lon: -105.0844, population: 44423 },
  { name: 'Windsor', zip: '80550', lat: 40.4775, lon: -104.9014, population: 44224 },
  { name: 'Denver', zip: '80239', lat: 39.7792, lon: -104.8678, population: 44077 },
  { name: 'Littleton', zip: '80127', lat: 39.5833, lon: -105.0666, population: 43826 },
  { name: 'Longmont', zip: '80501', lat: 40.1672, lon: -105.1519, population: 43591 },
  { name: 'Golden', zip: '80401', lat: 39.7555, lon: -105.2211, population: 43429 },
  { name: 'Brighton', zip: '80602', lat: 39.9853, lon: -104.8206, population: 42237 },
  { name: 'Aurora', zip: '80010', lat: 39.7292, lon: -104.9319, population: 42010 },
  { name: 'Brighton', zip: '80601', lat: 39.9853, lon: -104.8706, population: 41301 },
  { name: 'Denver', zip: '80249', lat: 39.8092, lon: -104.7678, population: 41209 },
  { name: 'Denver', zip: '80221', lat: 39.7892, lon: -105.0678, population: 40938 },
  { name: 'Colorado Springs', zip: '80916', lat: 38.9017, lon: -104.7819, population: 40579 },
  { name: 'Aurora', zip: '80017', lat: 39.6792, lon: -104.7819, population: 39553 },
  { name: 'Aurora', zip: '80014', lat: 39.6292, lon: -104.7819, population: 39277 },
  { name: 'Denver', zip: '80210', lat: 39.6992, lon: -104.9678, population: 39155 },
  { name: 'Fort Collins', zip: '80524', lat: 40.5353, lon: -105.1344, population: 39111 },
  { name: 'Fort Collins', zip: '80521', lat: 40.5853, lon: -105.1344, population: 38217 },
  { name: 'Colorado Springs', zip: '80920', lat: 38.9517, lon: -104.6819, population: 38154 },
  { name: 'Denver', zip: '80211', lat: 39.7892, lon: -105.0178, population: 37441 },
  { name: 'Colorado Springs', zip: '80906', lat: 38.8317, lon: -104.8219, population: 37403 },
  { name: 'Longmont', zip: '80516', lat: 40.1172, lon: -105.1019, population: 37107 },
  { name: 'Littleton', zip: '80128', lat: 39.5333, lon: -105.0166, population: 36859 },
  { name: 'Englewood', zip: '80112', lat: 39.6483, lon: -104.9497, population: 36687 },
  { name: 'Castle Rock', zip: '80104', lat: 39.3722, lon: -104.8561, population: 36461 },
  { name: 'Westminster', zip: '80031', lat: 39.8667, lon: -105.0372, population: 36350 },
  { name: 'Denver', zip: '80220', lat: 39.7392, lon: -104.9178, population: 36311 },
  { name: 'Longmont', zip: '80503', lat: 40.2172, lon: -105.1019, population: 36206 },
  { name: 'Colorado Springs', zip: '80909', lat: 38.8817, lon: -104.8219, population: 36171 },
  { name: 'Littleton', zip: '80138', lat: 39.5133, lon: -105.0666, population: 35942 },
  { name: 'Westminster', zip: '80021', lat: 39.9167, lon: -105.0372, population: 35562 }
];

// AirNow API configuration
const AIRNOW_API_KEY = 'E97798F2-4817-46B4-9E10-21E25227F39C';
const AIRNOW_BASE_URL = 'https://www.airnowapi.org/aq';

// API functions
const fetchAirQualityByZip = async (zipCode: string): Promise<AirNowObservation[]> => {
  try {
    const response = await fetch(
      `${AIRNOW_BASE_URL}/observation/zipCode/current/?format=application/json&zipCode=${zipCode}&distance=25&API_KEY=${AIRNOW_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching air quality data for ${zipCode}:`, error);
    return [];
  }
};

const fetchHistoricalData = async (zipCode: string, startDate: string, endDate: string): Promise<AirNowObservation[]> => {
  try {
    const response = await fetch(
      `${AIRNOW_BASE_URL}/observation/zipCode/historical/?format=application/json&zipCode=${zipCode}&date=${startDate}T00-0000&distance=25&API_KEY=${AIRNOW_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching historical data for ${zipCode}:`, error);
    return [];
  }
};

// Generate trend data from historical API calls with enhanced asthma event data
const generateTrendData = async (zipCode: string, pollutant: string) => {
  if (zipCode === 'all') {
    // For 'all', use Denver as representative
    zipCode = '80219';
  }
  
  // Get population and asthma data for this ZIP code
  const getLocationData = (zip: string) => {
    const cityData = COLORADO_CITIES.find(city => city.zip === zip);
    const population = cityData ? cityData.population : 45000; // Default population if not found
    
    // Use ZIP code to generate a consistent asthma rate (not random)
    const zipNum = parseInt(zip.replace(/\D/g, '')) || 80000;
    const baseRate = 6.5; // Base asthma rate for Colorado
    const variation = ((zipNum % 1000) / 1000) * 4; // 0-4% variation based on ZIP
    const asthmaRate = parseFloat((baseRate + variation).toFixed(1));
    
    // Calculate asthma percentage (number of people with asthma / total population * 100)
    const peopleWithAsthma = Math.round((population * asthmaRate) / 100);
    const asthmaPercentage = parseFloat(((peopleWithAsthma / population) * 100).toFixed(2));
    
    return {
      population,
      asthmaRate,
      peopleWithAsthma,
      asthmaPercentage
    };
  };
  
  const locationData = getLocationData(zipCode);
  
  const today = new Date();
  const pollutionData = [];
  
  // Get pollution data for the last 7 days (AirNow historical data is limited)
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const historicalData = await fetchHistoricalData(zipCode, dateStr, dateStr);
      const pollutantData = historicalData.find(d => d.ParameterName === pollutant);
      
      pollutionData.push({
        date: dateStr,
        value: pollutantData ? pollutantData.AQI : Math.floor(Math.random() * 30) + 20
      });
    } catch (error) {
      // Fallback to mock data if API fails
      pollutionData.push({
        date: dateStr,
        value: Math.floor(Math.random() * 30) + 20
      });
    }
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Try to get real emergency visit data from CDC API
  let emergencyVisitData: AsthmaEventData[] = [];
  try {
    const currentYear = new Date().getFullYear();
    emergencyVisitData = await fetchAsthmaEmergencyVisits(currentYear - 1, currentYear);
  } catch (error) {
    console.error('Error fetching emergency visit data:', error);
  }
  
  // If real data is not available, generate mock data that correlates with pollution
  if (emergencyVisitData.length === 0) {
    emergencyVisitData = getMockAsthmaEmergencyData(pollutionData);
  }
  
  // Format the data for the trend chart
  const trendData = pollutionData.map(pollutionPoint => {
    // Find matching emergency visit data (same day)
    const emergencyData = emergencyVisitData.find(d => d.date === pollutionPoint.date);
    
    // Find emergency visit data with 1-day lag (for time-lag analysis)
    const nextDay = new Date(pollutionPoint.date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];
    const laggedEmergencyData = emergencyVisitData.find(d => d.date === nextDayStr);
    
    return {
      date: pollutionPoint.date,
      value: pollutionPoint.value, // Pollution AQI
      asthmaRate: locationData.asthmaRate, // Consistent asthma prevalence rate
      asthmaPercentage: locationData.asthmaPercentage, // Percentage of people with asthma
      peopleWithAsthma: locationData.peopleWithAsthma, // Number of people with asthma
      population: locationData.population, // Total population
      emergencyVisitRate: emergencyData ? emergencyData.rate : null, // Emergency visit rate (same day)
      laggedEmergencyVisitRate: laggedEmergencyData ? laggedEmergencyData.rate : null, // Emergency visit rate (next day)
      seasonalFactor: emergencyData ? emergencyData.seasonalFactor : 1.0 // Seasonal factor
    };
  });
  
  return trendData;
};

// Data context interface with enhanced types
interface DataContextType {
  airQualityData: AirQualityData;
  trendData: any[];
  selectedZip: string;
  selectedPollutant: string;
  mostPollutedCities: any[];
  cleanestCities: any[];
  zipCodes: any[];
  asthmaData: AsthmaDataPoint[];
  asthmaEventData: AsthmaEventData[];
  asthmaStatistics: AsthmaStatistics;
  correlationData: CorrelationData[];
  highAlertDays: HighAlertDay[];
  optimalTimelag: number;
  loading: boolean;
  error: string | null;
  setSelectedZip: (zip: string) => void;
  setSelectedPollutant: (pollutant: string) => void;
  refreshData: () => void;
}

// Create context with enhanced properties
export const DataContext = createContext<DataContextType>({
  airQualityData: { type: 'FeatureCollection', features: [] },
  trendData: [],
  selectedZip: 'all',
  selectedPollutant: 'PM2.5',
  mostPollutedCities: [],
  cleanestCities: [],
  zipCodes: [],
  asthmaData: [],
  asthmaEventData: [],
  asthmaStatistics: { 
    averagePrevalence: 8.7, 
    totalCounties: 64, 
    dataAvailable: false,
    eventDataAvailable: false
  },
  correlationData: [],
  highAlertDays: [],
  optimalTimelag: 1,
  loading: false,
  error: null,
  setSelectedZip: () => {},
  setSelectedPollutant: () => {},
  refreshData: () => {}
});

export const DataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [airQualityData, setAirQualityData] = useState<AirQualityData>({ type: 'FeatureCollection', features: [] });
  const [trendData, setTrendData] = useState<any[]>([]);
  const [selectedZip, setSelectedZip] = useState<string>('all');
  const [selectedPollutant, setSelectedPollutant] = useState<string>('PM2.5');
  const [asthmaData, setAsthmaData] = useState<AsthmaDataPoint[]>([]);
  const [asthmaEventData, setAsthmaEventData] = useState<AsthmaEventData[]>([]);
  const [asthmaStatistics, setAsthmaStatistics] = useState<AsthmaStatistics>({ 
    averagePrevalence: 8.7, 
    totalCounties: 64, 
    dataAvailable: false,
    eventDataAvailable: false
  });
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [highAlertDays, setHighAlertDays] = useState<HighAlertDay[]>([]);
  const [optimalTimelag, setOptimalTimelag] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch air quality data for all Colorado cities
  const fetchAllAirQualityData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const features: AirQualityFeature[] = [];
      
      // Fetch data for each Colorado city
      for (const city of COLORADO_CITIES) {
        try {
          const observations = await fetchAirQualityByZip(city.zip);
          
          // Find PM2.5 data (primary pollutant)
          const pm25Data = observations.find(obs => obs.ParameterName === 'PM2.5');
          const ozoneData = observations.find(obs => obs.ParameterName === 'OZONE');
          
          // Use PM2.5 if available, otherwise use ozone, otherwise skip
          const primaryData = pm25Data || ozoneData;
          
          if (primaryData) {
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [city.lon, city.lat]
              },
              properties: {
                city: city.name,
                zip: city.zip,
                AQI: primaryData.AQI,
                Pollutant: primaryData.ParameterName,
                category: primaryData.Category.Name,
                dateObserved: primaryData.DateObserved
              }
            });
          } else {
            // Add city with fallback data if no API data available
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [city.lon, city.lat]
              },
              properties: {
                city: city.name,
                zip: city.zip,
                AQI: Math.floor(Math.random() * 50) + 20, // Fallback random AQI
                Pollutant: 'PM2.5',
                category: 'Good',
                dateObserved: new Date().toISOString().split('T')[0]
              }
            });
          }
        } catch (cityError) {
          console.error(`Error fetching data for ${city.name}:`, cityError);
          // Add fallback data for this city
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [city.lon, city.lat]
            },
            properties: {
              city: city.name,
              zip: city.zip,
              AQI: Math.floor(Math.random() * 50) + 20,
              Pollutant: 'PM2.5',
              category: 'Good',
              dateObserved: new Date().toISOString().split('T')[0]
            }
          });
        }
        
        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setAirQualityData({ type: 'FeatureCollection', features });
    } catch (err) {
      setError('Failed to fetch air quality data');
      console.error('Error fetching air quality data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trend data when zip or pollutant changes
  const fetchTrendData = async () => {
    try {
      const data = await generateTrendData(selectedZip, selectedPollutant);
      setTrendData(data);
      
      // Calculate correlation between pollution and asthma emergency visits
      const pollutionData = data.map(d => ({ date: d.date, value: d.value }));
      
      // FIXED: Filter out null/undefined values and use type assertion for TypeScript
      const asthmaEmergencyData = data
        .filter(d => d.emergencyVisitRate !== null && d.emergencyVisitRate !== undefined)
        .map(d => ({ date: d.date, value: d.emergencyVisitRate as number }));
      
      if (pollutionData.length > 0 && asthmaEmergencyData.length > 0) {
        // Generate time-lag analysis (0-7 days)
        const timeLagAnalysis = generateTimeLagAnalysis(pollutionData, asthmaEmergencyData, 7);
        setCorrelationData(timeLagAnalysis);
        
        // Find optimal time lag (highest absolute correlation)
        if (timeLagAnalysis.length > 0) {
          const optimal = timeLagAnalysis.reduce((prev, current) => 
            Math.abs(current.correlationCoefficient) > Math.abs(prev.correlationCoefficient) ? current : prev
          );
          setOptimalTimelag(optimal.timelag);
        }
        
        // Identify high alert days
        const alertDays = identifyHighAlertDays(pollutionData, asthmaEmergencyData);
        setHighAlertDays(alertDays);
      }
    } catch (err) {
      console.error('Error fetching trend data:', err);
      // Fallback to mock trend data with consistent asthma rates and percentages
      const fallbackData = [];
      const today = new Date();
      
      // Get population and asthma data for the selected ZIP code
      const getLocationData = (zip: string) => {
        const cityData = COLORADO_CITIES.find(city => city.zip === zip);
        const population = cityData ? cityData.population : 45000; // Default population if not found
        
        // Use ZIP code to generate a consistent asthma rate (not random)
        const zipNum = parseInt(zip.replace(/\D/g, '')) || 80000;
        const baseRate = 6.5; // Base asthma rate for Colorado
        const variation = ((zipNum % 1000) / 1000) * 4; // 0-4% variation based on ZIP
        const asthmaRate = parseFloat((baseRate + variation).toFixed(1));
        
        // Calculate asthma percentage (number of people with asthma / total population * 100)
        const peopleWithAsthma = Math.round((population * asthmaRate) / 100);
        const asthmaPercentage = parseFloat(((peopleWithAsthma / population) * 100).toFixed(2));
        
        return {
          population,
          asthmaRate,
          peopleWithAsthma,
          asthmaPercentage
        };
      };
      
      const zipForRate = selectedZip === 'all' ? '80219' : selectedZip;
      const locationData = getLocationData(zipForRate);
      
      // Generate 7 days of mock data
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        fallbackData.push({
          date: dateStr,
          value: Math.floor(Math.random() * 30) + 20, // Random AQI
          asthmaRate: locationData.asthmaRate,
          asthmaPercentage: locationData.asthmaPercentage,
          peopleWithAsthma: locationData.peopleWithAsthma,
          population: locationData.population,
          emergencyVisitRate: 5 + Math.random() * 10, // Random emergency visit rate
          laggedEmergencyVisitRate: 5 + Math.random() * 10 // Random lagged rate
        });
      }
      
      setTrendData(fallbackData);
      
      // Generate mock correlation data
      const mockCorrelations = [
        {
          pollutantType: selectedPollutant,
          asthmaMetric: 'Emergency Visits',
          correlationCoefficient: 0.65,
          significance: 0.03,
          timelag: 1,
          startDate: fallbackData[0].date,
          endDate: fallbackData[fallbackData.length - 1].date
        },
        {
          pollutantType: selectedPollutant,
          asthmaMetric: 'Emergency Visits',
          correlationCoefficient: 0.72,
          significance: 0.01,
          timelag: 2,
          startDate: fallbackData[0].date,
          endDate: fallbackData[fallbackData.length - 1].date
        },
        {
          pollutantType: selectedPollutant,
          asthmaMetric: 'Emergency Visits',
          correlationCoefficient: 0.58,
          significance: 0.04,
          timelag: 0,
          startDate: fallbackData[0].date,
          endDate: fallbackData[fallbackData.length - 1].date
        }
      ];
      
      setCorrelationData(mockCorrelations);
      setOptimalTimelag(2); // Mock optimal time lag
      
      // FIXED: Explicitly cast alertLevel to the union type 'high' | 'moderate' | 'low'
      const mockAlertDays = fallbackData.map(day => ({
        date: day.date,
        pollutionValue: day.value,
        asthmaValue: day.emergencyVisitRate,
        alertLevel: (day.value > 35 && day.emergencyVisitRate > 10 ? 'high' : 
                   day.value > 25 || day.emergencyVisitRate > 8 ? 'moderate' : 'low') as 'high' | 'moderate' | 'low'
      }));
      
      setHighAlertDays(mockAlertDays);
    }
  };

  // Fetch asthma data
  const fetchAsthmaData = async () => {
    try {
      // Fetch both prevalence and event data
      const countyData = await fetchColoradoCountyAsthmaData();
      setAsthmaData(countyData);
      
      // Extract event data
      const eventData = countyData.filter(d => 
        d.dataType === 'Emergency Visits' || d.dataType === 'Hospitalizations'
      ) as AsthmaEventData[];
      setAsthmaEventData(eventData);
      
      // Calculate statistics
      const stats = calculateAsthmaStatistics(countyData);
      setAsthmaStatistics(stats);
    } catch (err) {
      console.error('Error fetching asthma data:', err);
      // Fallback to mock data
      const mockData = getMockAsthmaData();
      setAsthmaData(mockData);
      
      // Generate mock event data based on trend data
      if (trendData.length > 0) {
        const pollutionData = trendData.map(d => ({ date: d.date, value: d.value }));
        const mockEmergencyData = getMockAsthmaEmergencyData(pollutionData);
        const mockHospitalizationData = getMockAsthmaHospitalizationData(pollutionData);
        setAsthmaEventData([...mockEmergencyData, ...mockHospitalizationData]);
      }
      
      // Set fallback statistics
      setAsthmaStatistics({
        averagePrevalence: 8.7,
        adultPrevalence: 9.2,
        childPrevalence: 8.1,
        emergencyVisitRate: 49.3,
        hospitalizationRate: 8.2,
        totalCounties: 7,
        dataAvailable: true,
        eventDataAvailable: true
      });
    }
  };

  // Calculate most polluted and cleanest cities
  const calculateCityRankings = () => {
    if (!airQualityData.features || airQualityData.features.length === 0) {
      return;
    }
    
    const sortedByAQI = [...airQualityData.features].sort((a, b) => 
      b.properties.AQI - a.properties.AQI
    );
    
    const mostPolluted = sortedByAQI.slice(0, 5).map(feature => ({
      city: feature.properties.city,
      zip: feature.properties.zip,
      aqi: feature.properties.AQI,
      pollutant: feature.properties.Pollutant
    }));
    
    const cleanest = sortedByAQI.slice(-5).reverse().map(feature => ({
      city: feature.properties.city,
      zip: feature.properties.zip,
      aqi: feature.properties.AQI,
      pollutant: feature.properties.Pollutant
    }));
    
    return { mostPolluted, cleanest };
  };

  // Refresh all data
  const refreshData = async () => {
    setLoading(true);
    
    try {
      await Promise.all([
        fetchAllAirQualityData(),
        fetchAsthmaData()
      ]);
      
      // After air quality data is loaded, calculate city rankings
      const rankings = calculateCityRankings();
      if (rankings) {
        setMostPollutedCities(rankings.mostPolluted);
        setCleanestCities(rankings.cleanest);
      }
      
      // After asthma data is loaded, fetch trend data
      await fetchTrendData();
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique ZIP codes from cities
  const [zipCodes, setZipCodes] = useState<any[]>([]);
  const [mostPollutedCities, setMostPollutedCities] = useState<any[]>([]);
  const [cleanestCities, setCleanestCities] = useState<any[]>([]);

  // Initialize data on component mount
  useEffect(() => {
    // Extract unique ZIP codes - FIXED: Include both zip and city properties
    const uniqueZips = [
      { label: 'All Colorado', value: 'all', zip: 'all', city: 'All Colorado' },
      ...COLORADO_CITIES.map(city => ({
        label: `${city.name} (${city.zip})`,
        value: city.zip,
        zip: city.zip,
        city: city.name
      }))
    ];
    setZipCodes(uniqueZips);
    
    // Fetch initial data
    refreshData();
  }, []);

  // Fetch trend data when ZIP or pollutant changes
  useEffect(() => {
    fetchTrendData();
  }, [selectedZip, selectedPollutant]);

  return (
    <DataContext.Provider value={{
      airQualityData,
      trendData,
      selectedZip,
      selectedPollutant,
      mostPollutedCities,
      cleanestCities,
      zipCodes,
      asthmaData,
      asthmaEventData,
      asthmaStatistics,
      correlationData,
      highAlertDays,
      optimalTimelag,
      loading,
      error,
      setSelectedZip,
      setSelectedPollutant,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
