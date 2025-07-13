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
  { name: 'Thornton', zip: '80011', lat: 39.8956, lon: -104.9811, population: 47000 },
  { name: 'Thornton', zip: '80012', lat: 39.8680, lon: -104.9547, population: 46000 },
  { name: 'Severance', zip: '80538', lat: 40.5225, lon: -104.8547, population: 45000 },
  { name: 'Colorado Springs', zip: '80918', lat: 38.8339, lon: -104.8214, population: 44000 },
  { name: 'Northglenn', zip: '80233', lat: 39.8956, lon: -104.9811, population: 43000 },
  { name: 'Denver', zip: '80202', lat: 39.7392, lon: -105.0178, population: 50000 },
  // Adding Boulder area zip codes
  { name: 'Boulder', zip: '80301', lat: 40.0150, lon: -105.2705, population: 45000 },
  { name: 'Boulder', zip: '80302', lat: 40.0274, lon: -105.2519, population: 42000 },
  { name: 'Boulder', zip: '80303', lat: 40.0176, lon: -105.2811, population: 38000 },
  { name: 'Boulder', zip: '80304', lat: 40.0093, lon: -105.2430, population: 35000 },
  { name: 'Boulder', zip: '80305', lat: 40.0499, lon: -105.2277, population: 32000 },
  // Adding more Fort Collins area
  { name: 'Fort Collins', zip: '80521', lat: 40.5853, lon: -105.0844, population: 48000 },
  { name: 'Fort Collins', zip: '80522', lat: 40.5508, lon: -105.0668, population: 45000 },
  { name: 'Fort Collins', zip: '80523', lat: 40.5508, lon: -105.0668, population: 42000 },
  { name: 'Fort Collins', zip: '80524', lat: 40.5508, lon: -105.0668, population: 40000 },
  { name: 'Fort Collins', zip: '80526', lat: 40.5508, lon: -105.0668, population: 38000 },
  // Adding more Denver area
  { name: 'Denver', zip: '80203', lat: 39.7392, lon: -105.0178, population: 45000 },
  { name: 'Denver', zip: '80204', lat: 39.7392, lon: -105.0178, population: 43000 },
  { name: 'Denver', zip: '80205', lat: 39.7392, lon: -105.0178, population: 41000 },
  { name: 'Denver', zip: '80206', lat: 39.7392, lon: -105.0178, population: 39000 },
  { name: 'Denver', zip: '80207', lat: 39.7392, lon: -105.0178, population: 37000 },
  { name: 'Denver', zip: '80209', lat: 39.7392, lon: -105.0178, population: 35000 },
  { name: 'Denver', zip: '80210', lat: 39.7392, lon: -105.0178, population: 33000 },
  { name: 'Denver', zip: '80211', lat: 39.7392, lon: -105.0178, population: 31000 },
  { name: 'Denver', zip: '80212', lat: 39.7392, lon: -105.0178, population: 29000 },
  { name: 'Denver', zip: '80214', lat: 39.7392, lon: -105.0178, population: 27000 },
  { name: 'Denver', zip: '80218', lat: 39.7392, lon: -105.0178, population: 25000 },
  { name: 'Denver', zip: '80220', lat: 39.7392, lon: -105.0178, population: 23000 },
  { name: 'Denver', zip: '80221', lat: 39.7392, lon: -105.0178, population: 21000 },
  { name: 'Denver', zip: '80222', lat: 39.7392, lon: -105.0178, population: 19000 },
  { name: 'Denver', zip: '80223', lat: 39.7392, lon: -105.0178, population: 17000 },
  { name: 'Denver', zip: '80224', lat: 39.7392, lon: -105.0178, population: 15000 },
  { name: 'Denver', zip: '80226', lat: 39.7392, lon: -105.0178, population: 13000 },
  { name: 'Denver', zip: '80227', lat: 39.7392, lon: -105.0178, population: 11000 },
  { name: 'Denver', zip: '80230', lat: 39.7392, lon: -105.0178, population: 9000 },
  { name: 'Denver', zip: '80231', lat: 39.7392, lon: -105.0178, population: 7000 },
  { name: 'Denver', zip: '80235', lat: 39.7392, lon: -105.0178, population: 5000 },
  // Adding Colorado Springs area
  { name: 'Colorado Springs', zip: '80906', lat: 38.8339, lon: -104.8214, population: 42000 },
  { name: 'Colorado Springs', zip: '80907', lat: 38.8339, lon: -104.8214, population: 40000 },
  { name: 'Colorado Springs', zip: '80909', lat: 38.8339, lon: -104.8214, population: 38000 },
  { name: 'Colorado Springs', zip: '80910', lat: 38.8339, lon: -104.8214, population: 36000 },
  { name: 'Colorado Springs', zip: '80911', lat: 38.8339, lon: -104.8214, population: 34000 },
  { name: 'Colorado Springs', zip: '80915', lat: 38.8339, lon: -104.8214, population: 32000 },
  { name: 'Colorado Springs', zip: '80916', lat: 38.8339, lon: -104.8214, population: 30000 },
  { name: 'Colorado Springs', zip: '80917', lat: 38.8339, lon: -104.8214, population: 28000 },
  { name: 'Colorado Springs', zip: '80919', lat: 38.8339, lon: -104.8214, population: 26000 },
  { name: 'Colorado Springs', zip: '80920', lat: 38.8339, lon: -104.8214, population: 24000 },
  { name: 'Colorado Springs', zip: '80921', lat: 38.8339, lon: -104.8214, population: 22000 },
  { name: 'Colorado Springs', zip: '80922', lat: 38.8339, lon: -104.8214, population: 20000 },
  { name: 'Colorado Springs', zip: '80923', lat: 38.8339, lon: -104.8214, population: 18000 },
  { name: 'Colorado Springs', zip: '80924', lat: 38.8339, lon: -104.8214, population: 16000 },
  { name: 'Colorado Springs', zip: '80925', lat: 38.8339, lon: -104.8214, population: 14000 },
  // Adding more Longmont area
  { name: 'Longmont', zip: '80501', lat: 40.1672, lon: -105.1019, population: 35000 },
  { name: 'Longmont', zip: '80502', lat: 40.1672, lon: -105.1019, population: 33000 },
  { name: 'Longmont', zip: '80503', lat: 40.1672, lon: -105.1019, population: 31000 },
  // Adding Arvada area
  { name: 'Arvada', zip: '80001', lat: 39.8028, lon: -105.0875, population: 45000 },
  { name: 'Arvada', zip: '80002', lat: 39.8028, lon: -105.0875, population: 43000 },
  { name: 'Arvada', zip: '80003', lat: 39.8028, lon: -105.0875, population: 41000 },
  { name: 'Arvada', zip: '80004', lat: 39.8028, lon: -105.0875, population: 39000 },
  { name: 'Arvada', zip: '80005', lat: 39.8028, lon: -105.0875, population: 37000 },
  // Adding Westminster area
  { name: 'Westminster', zip: '80021', lat: 39.8366, lon: -105.0372, population: 40000 },
  { name: 'Westminster', zip: '80030', lat: 39.8366, lon: -105.0372, population: 38000 },
  { name: 'Westminster', zip: '80031', lat: 39.8366, lon: -105.0372, population: 36000 },
  // Adding Littleton area
  { name: 'Littleton', zip: '80120', lat: 39.6133, lon: -105.0178, population: 35000 },
  { name: 'Littleton', zip: '80121', lat: 39.6133, lon: -105.0178, population: 33000 },
  { name: 'Littleton', zip: '80122', lat: 39.6133, lon: -105.0178, population: 31000 },
  { name: 'Littleton', zip: '80123', lat: 39.6133, lon: -105.0178, population: 29000 },
  { name: 'Littleton', zip: '80124', lat: 39.6133, lon: -105.0178, population: 27000 },
  { name: 'Littleton', zip: '80125', lat: 39.6133, lon: -105.0178, population: 25000 },
  { name: 'Littleton', zip: '80126', lat: 39.6133, lon: -105.0178, population: 23000 },
  { name: 'Littleton', zip: '80127', lat: 39.6133, lon: -105.0178, population: 21000 },
  // Adding Pueblo area
  { name: 'Pueblo', zip: '81001', lat: 38.2544, lon: -104.6091, population: 40000 },
  { name: 'Pueblo', zip: '81003', lat: 38.2544, lon: -104.6091, population: 38000 },
  { name: 'Pueblo', zip: '81005', lat: 38.2544, lon: -104.6091, population: 36000 },
  { name: 'Pueblo', zip: '81007', lat: 38.2544, lon: -104.6091, population: 34000 },
  { name: 'Pueblo', zip: '81008', lat: 38.2544, lon: -104.6091, population: 32000 },
  // Adding more comprehensive coverage
  { name: 'Aurora', zip: '80019', lat: 39.6880, lon: -104.7547, population: 30000 },
  { name: 'Westminster', zip: '80021', lat: 39.8366, lon: -105.0372, population: 29000 },
  { name: 'Broomfield', zip: '80023', lat: 39.9205, lon: -105.0866, population: 28000 },
  { name: 'Broomfield', zip: '80024', lat: 39.9205, lon: -105.0866, population: 27000 },
  { name: 'Broomfield', zip: '80025', lat: 39.9205, lon: -105.0866, population: 26000 },
  { name: 'Lafayette', zip: '80026', lat: 39.9936, lon: -105.0897, population: 25000 },
  { name: 'Louisville', zip: '80027', lat: 39.9778, lon: -105.1319, population: 24000 },
  { name: 'Westminster', zip: '80030', lat: 39.8366, lon: -105.0372, population: 23000 },
  { name: 'Westminster', zip: '80031', lat: 39.8366, lon: -105.0372, population: 22000 },
  { name: 'Wheat Ridge', zip: '80033', lat: 39.7661, lon: -105.0772, population: 21000 },
  { name: 'Wheat Ridge', zip: '80034', lat: 39.7661, lon: -105.0772, population: 20000 },
  { name: 'Bennett', zip: '80102', lat: 39.7575, lon: -104.4286, population: 19000 },
  { name: 'Castle Rock', zip: '80109', lat: 39.3722, lon: -104.8561, population: 18000 },
  { name: 'Littleton', zip: '80129', lat: 39.6133, lon: -105.0178, population: 17000 },
  { name: 'Centennial', zip: '80112', lat: 39.5807, lon: -104.8769, population: 16000 }
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
      // Load air quality data for more zip codes (increased from 30 to 80)
      const airQualityPromises = zipCodes.slice(0, 80).map(async (zip) => {
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

