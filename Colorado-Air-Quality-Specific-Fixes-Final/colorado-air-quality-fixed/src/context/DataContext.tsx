import React, { useState, useEffect, createContext, useContext } from 'react';
import realDataService from '../services/realDataService';

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
  totalCounties: number;
  dataAvailable: boolean;
}

interface TrendDataPoint {
  month: string;
  pm25: number;
  emergencyVisits: number;
  hospitalizations: number;
  asthmaRate: number;
}

interface CityData {
  name: string;
  zip: string;
  aqi: number;
  pollutant: string;
  category: string;
}

interface DataContextType {
  // Air Quality Data
  airQualityData: AirQualityData;
  features: AirQualityFeature[];
  
  // Selection State
  selectedZip: string;
  selectedPollutant: string;
  setSelectedZip: (zip: string) => void;
  setSelectedPollutant: (pollutant: string) => void;
  
  // City Rankings
  mostPollutedCities: CityData[];
  cleanestCities: CityData[];
  
  // Available Options
  zipCodes: string[];
  pollutants: string[];
  
  // Asthma Data
  asthmaStatistics: AsthmaStatistics;
  
  // Trend Data
  trendData: TrendDataPoint[];
  
  // Loading and Error States
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

// Colorado cities data for coordinates
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
  { name: 'Greeley', zip: '80631', lat: 40.4233, lon: -104.7091, population: 50000 },
  { name: 'Broomfield', zip: '80020', lat: 39.9205, lon: -105.0866, population: 48000 },
  { name: 'Northglenn', zip: '80011', lat: 39.8956, lon: -104.9811, population: 47000 },
  { name: 'Aurora', zip: '80012', lat: 39.6880, lon: -104.7547, population: 46000 },
  { name: 'Severance', zip: '80538', lat: 40.5225, lon: -104.8547, population: 45000 },
  { name: 'Colorado Springs', zip: '80918', lat: 38.8339, lon: -104.8214, population: 44000 },
  { name: 'Northglenn', zip: '80233', lat: 39.8956, lon: -104.9811, population: 43000 },
  { name: 'Denver', zip: '80202', lat: 39.7392, lon: -105.0178, population: 50000 }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State management
  const [airQualityData, setAirQualityData] = useState<AirQualityData>({ type: 'FeatureCollection', features: [] });
  const [selectedZip, setSelectedZip] = useState('80134'); // Default to Parker
  const [selectedPollutant, setSelectedPollutant] = useState('PM2.5');
  const [mostPollutedCities, setMostPollutedCities] = useState<CityData[]>([]);
  const [cleanestCities, setCleanestCities] = useState<CityData[]>([]);
  const [asthmaStatistics, setAsthmaStatistics] = useState<AsthmaStatistics>({
    averagePrevalence: 8.0, // Fixed at 8% as requested
    totalCounties: 10,
    dataAvailable: true
  });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available options
  const zipCodes = realDataService.getAvailableZipCodes().map(item => item.zip);
  const pollutants = ['PM2.5', 'Ozone', 'PM10', 'NO2', 'SO2', 'CO'];

  // Load data function
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load air quality data for more zip codes (increased from 15 to 30)
      const airQualityPromises = zipCodes.slice(0, 30).map(async (zip) => {
        const cityInfo = COLORADO_CITIES.find(city => city.zip === zip);
        const airData = await realDataService.getAirQualityData(zip);
        
        if (airData && cityInfo) {
          return {
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [cityInfo.lon, cityInfo.lat]
            },
            properties: {
              city: airData.city,
              zip: airData.zip,
              AQI: airData.aqi,
              Pollutant: airData.pollutant,
              category: airData.category,
              dateObserved: airData.date
            }
          };
        }
        return null;
      });

      const airQualityResults = await Promise.all(airQualityPromises);
      const validFeatures = airQualityResults.filter(feature => feature !== null) as AirQualityFeature[];
      
      setAirQualityData({
        type: 'FeatureCollection',
        features: validFeatures
      });

      // Load city rankings
      const cleanCities = await realDataService.getCleanestCities();

      // For now, use placeholder for most polluted cities
      setMostPollutedCities([]);

      setCleanestCities(cleanCities.map((city: any) => ({
        name: city.name,
        zip: city.zip,
        aqi: city.aqi,
        pollutant: 'PM2.5',
        category: city.aqi <= 50 ? 'Good' : city.aqi <= 100 ? 'Moderate' : 'Unhealthy for Sensitive Groups'
      })));

      // Load asthma statistics
      const countyData = await realDataService.getCountyAsthmaData();
      const avgAsthmaRate = countyData.reduce((sum, county) => sum + county.asthmaRate, 0) / countyData.length;
      
      setAsthmaStatistics({
        averagePrevalence: avgAsthmaRate,
        totalCounties: countyData.length,
        dataAvailable: true
      });

      // Load trend data for selected zip
      const trends = await realDataService.getTrendData(selectedZip, selectedPollutant);
      setTrendData(trends);

    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load air quality data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data function
  const refreshData = async () => {
    await loadData();
  };

  // Load data on component mount and when selectedZip or selectedPollutant changes
  useEffect(() => {
    loadData();
  }, [selectedZip, selectedPollutant]);

  // Derived data
  const features = airQualityData.features;

  const contextValue: DataContextType = {
    // Air Quality Data
    airQualityData,
    features,
    
    // Selection State
    selectedZip,
    selectedPollutant,
    setSelectedZip,
    setSelectedPollutant,
    
    // City Rankings
    mostPollutedCities,
    cleanestCities,
    
    // Available Options
    zipCodes,
    pollutants,
    
    // Asthma Data
    asthmaStatistics,
    
    // Trend Data
    trendData,
    
    // Loading and Error States
    loading,
    error,
    
    // Actions
    refreshData
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

