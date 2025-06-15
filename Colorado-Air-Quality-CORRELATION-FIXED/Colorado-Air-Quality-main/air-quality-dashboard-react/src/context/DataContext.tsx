import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { fetchColoradoCountyAsthmaData, calculateAsthmaStatistics, generateTimeLagAnalysis, identifyHighAlertDays, CorrelationData } from '../services/asthmaService';

// Colorado cities with ZIP codes
export const COLORADO_CITIES = [
  { name: 'Denver', zip: '80219', population: 715522 },
  { name: 'Colorado Springs', zip: '80918', population: 478961 },
  { name: 'Aurora', zip: '80013', population: 386261 },
  { name: 'Fort Collins', zip: '80525', population: 169810 },
  { name: 'Lakewood', zip: '80227', population: 156798 },
  { name: 'Thornton', zip: '80229', population: 141867 },
  { name: 'Arvada', zip: '80004', population: 124402 },
  { name: 'Westminster', zip: '80031', population: 116317 },
  { name: 'Pueblo', zip: '81001', population: 112251 },
  { name: 'Centennial', zip: '80122', population: 110937 },
  { name: 'Boulder', zip: '80301', population: 108250 },
  { name: 'Greeley', zip: '80634', population: 108649 },
  { name: 'Longmont', zip: '80504', population: 98885 },
  { name: 'Loveland', zip: '80538', population: 78877 },
  { name: 'Grand Junction', zip: '81501', population: 65560 },
  { name: 'Castle Rock', zip: '80109', population: 68484 },
  { name: 'Commerce City', zip: '80022', population: 62418 },
  { name: 'Parker', zip: '80134', population: 57706 },
  { name: 'Littleton', zip: '80123', population: 48065 },
  { name: 'Northglenn', zip: '80233', population: 38918 },
  { name: 'Brighton', zip: '80601', population: 41554 },
  { name: 'Englewood', zip: '80113', population: 34957 },
  { name: 'Wheat Ridge', zip: '80033', population: 31287 },
  { name: 'Fountain', zip: '80817', population: 30754 },
  { name: 'Lafayette', zip: '80026', population: 30687 },
  { name: 'Windsor', zip: '80550', population: 29158 },
  { name: 'Evans', zip: '80620', population: 21205 },
  { name: 'Golden', zip: '80401', population: 20399 },
  { name: 'Sterling', zip: '80751', population: 14777 },
  { name: 'Louisville', zip: '80027', population: 21226 },
  { name: 'Montrose', zip: '81401', population: 19749 },
  { name: 'Broomfield', zip: '80020', population: 74112 },
  { name: 'Durango', zip: '81301', population: 19071 },
  { name: 'Glenwood Springs', zip: '81601', population: 10386 },
  { name: 'Steamboat Springs', zip: '80487', population: 13214 },
  { name: 'Canon City', zip: '81212', population: 16679 },
  { name: 'Aspen', zip: '81611', population: 7401 },
  { name: 'Vail', zip: '81657', population: 5483 },
  { name: 'Breckenridge', zip: '80424', population: 5078 },
  { name: 'Telluride', zip: '81435', population: 2484 },
  { name: 'Estes Park', zip: '80517', population: 6426 },
  { name: 'Frisco', zip: '80443', population: 3116 },
  { name: 'Gunnison', zip: '81230', population: 6560 },
  { name: 'Alamosa', zip: '81101', population: 9918 },
  { name: 'Cortez', zip: '81321', population: 8766 },
  { name: 'Trinidad', zip: '81082', population: 8211 },
  { name: 'Craig', zip: '81625', population: 8871 },
  { name: 'Delta', zip: '81416', population: 8915 },
  { name: 'Rifle', zip: '81650', population: 9825 },
  { name: 'Fort Morgan', zip: '80701', population: 11407 }
];

// Interface for air quality data
export interface AirQualityData {
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    properties: {
      AQI: number;
      Category: string;
      ParameterName: string;
      ReportingArea: string;
      State: string;
      latitude: number;
      longitude: number;
      zip: string;
      city?: string;
    };
  }>;
}

// Interface for trend data
export interface TrendDataPoint {
  date: string;
  value: number;
  asthmaRate: number;
  emergencyVisitRate: number | null;
  laggedEmergencyVisitRate?: number | null;
  peopleWithAsthma?: number;
  population?: number;
  seasonalFactor?: number;
}

// Interface for high alert days
export interface HighAlertDay {
  date: string;
  pollutionValue: number;
  asthmaValue: number;
  alertLevel: 'high' | 'moderate' | 'low';
}

// Interface for city ranking
export interface CityRanking {
  city: string;
  zip: string;
  aqi: number;
}

// Interface for asthma statistics
export interface AsthmaStatistics {
  averagePrevalence: number;
  adultPrevalence?: number;
  childPrevalence?: number;
  emergencyVisitRate?: number;
  hospitalizationRate?: number;
  totalCounties: number;
  dataAvailable: boolean;
  eventDataAvailable?: boolean;
}

// Interface for asthma data
export interface AsthmaData {
  zip: string;
  city: string;
  rate: number;
  population: number;
  peopleWithAsthma: number;
  emergencyVisitRate?: number;
  hospitalizationRate?: number;
}

// Context interface
interface DataContextType {
  airQualityData: AirQualityData;
  trendData: TrendDataPoint[];
  asthmaData: AsthmaData[];
  asthmaStatistics: AsthmaStatistics;
  selectedZip: string;
  selectedPollutant: string;
  mostPollutedCities: CityRanking[];
  cleanestCities: CityRanking[];
  zipCodes: { label: string; value: string; zip: string; city: string }[];
  loading: boolean;
  error: string | null;
  correlationData: CorrelationData[];
  optimalTimelag: number;
  highAlertDays: HighAlertDay[];
  setSelectedZip: (zip: string) => void;
  setSelectedPollutant: (pollutant: string) => void;
}

// Create context with default values
export const DataContext = createContext<DataContextType>({
  airQualityData: { type: 'FeatureCollection', features: [] },
  trendData: [],
  asthmaData: [],
  asthmaStatistics: {
    averagePrevalence: 0,
    totalCounties: 0,
    dataAvailable: false
  },
  selectedZip: 'all',
  selectedPollutant: 'PM2.5',
  mostPollutedCities: [],
  cleanestCities: [],
  zipCodes: [],
  loading: false,
  error: null,
  correlationData: [],
  optimalTimelag: 1,
  highAlertDays: [],
  setSelectedZip: () => {},
  setSelectedPollutant: () => {}
});

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for air quality data
  const [airQualityData, setAirQualityData] = useState<AirQualityData>({ type: 'FeatureCollection', features: [] });
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [asthmaData, setAsthmaData] = useState<AsthmaData[]>([]);
  const [asthmaStatistics, setAsthmaStatistics] = useState<AsthmaStatistics>({
    averagePrevalence: 0,
    totalCounties: 0,
    dataAvailable: false
  });
  
  // State for selected filters
  const [selectedZip, setSelectedZip] = useState<string>('all');
  const [selectedPollutant, setSelectedPollutant] = useState<string>('PM2.5');
  
  // State for city rankings
  const [mostPollutedCities, setMostPollutedCities] = useState<CityRanking[]>([]);
  const [cleanestCities, setCleanestCities] = useState<CityRanking[]>([]);
  
  // State for loading and error
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for correlation analysis
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [optimalTimelag, setOptimalTimelag] = useState<number>(1);
  const [highAlertDays, setHighAlertDays] = useState<HighAlertDay[]>([]);
  
  // Generate unique ZIP codes for dropdown
  const uniqueZips = [
    { label: 'All Colorado', value: 'all', zip: 'all', city: 'All Colorado' },
    ...COLORADO_CITIES.map(city => ({
      label: `${city.name} (${city.zip})`,
      value: city.zip,
      zip: city.zip,
      city: city.name
    }))
  ];
  
  // Fetch air quality data on component mount
  useEffect(() => {
    fetchAirQualityData();
    fetchAsthmaData();
  }, []);
  
  // Fetch trend data when selected ZIP or pollutant changes
  useEffect(() => {
    fetchTrendData();
  }, [selectedZip, selectedPollutant]);
  
  // Recalculate city rankings when air quality data changes
  useEffect(() => {
    calculateCityRankings(airQualityData);
  }, [airQualityData]);
  
  // Fetch air quality data from API
  const fetchAirQualityData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate mock data for Colorado
      const mockData = generateMockAirQualityData();
      setAirQualityData(mockData);
    } catch (err) {
      console.error('Error fetching air quality data:', err);
      setError('Failed to fetch air quality data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch asthma data from CDC API
  const fetchAsthmaData = async () => {
    try {
      // Fetch real asthma data from CDC API
      const data = await fetchColoradoCountyAsthmaData();
      
      // Calculate statistics
      const stats = calculateAsthmaStatistics(data);
      setAsthmaStatistics({
        ...stats,
        dataAvailable: true
      });
      
      // Generate asthma data for each ZIP code
      const asthmaByZip = COLORADO_CITIES.map(city => {
        // Generate a consistent (not random) asthma rate based on ZIP code
        // This ensures each ZIP code always gets the same asthma rate
        const zipSum = city.zip.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
        const baseRate = 6.5; // Colorado average
        const variation = (zipSum % 40) / 10; // 0-4% variation based on ZIP
        const asthmaRate = baseRate + variation;
        
        // Calculate people with asthma
        const peopleWithAsthma = Math.round(city.population * asthmaRate / 100);
        
        return {
          zip: city.zip,
          city: city.name,
          rate: asthmaRate,
          population: city.population,
          peopleWithAsthma
        };
      });
      
      setAsthmaData(asthmaByZip);
    } catch (err) {
      console.error('Error fetching asthma data:', err);
      
      // Use mock data if API fails
      const mockData = getMockAsthmaData();
      setAsthmaData(mockData);
      
      // Calculate statistics from mock data
      const stats = calculateAsthmaStatistics(mockData);
      setAsthmaStatistics({
        ...stats,
        dataAvailable: true
      });
    }
  };

  // Fetch trend data for selected ZIP and pollutant
  const fetchTrendData = async () => {
    try {
      const data = await generateTrendData(selectedZip, selectedPollutant);
      setTrendData(data);
      
      // Calculate correlation between pollution and asthma emergency visits
      if (data.length > 0 && data[0].emergencyVisitRate !== null) {
        // Extract pollution and asthma data for correlation analysis
        const pollutionData = data.map(d => ({ date: d.date, value: d.value }));
        const asthmaEmergencyData = data
          .filter(d => d.emergencyVisitRate !== null && d.emergencyVisitRate !== undefined)
          .map(d => ({ date: d.date, value: d.emergencyVisitRate as number }));
        
        // Generate time-lag analysis (0-7 days)
        if (pollutionData.length > 0 && asthmaEmergencyData.length > 0) {
          const timeLagAnalysis = generateTimeLagAnalysis(pollutionData, asthmaEmergencyData, 7);
          setCorrelationData(timeLagAnalysis);
          
          // Find optimal time lag (highest absolute correlation)
          let maxCorr = 0;
          let optLag = 0;
          
          timeLagAnalysis.forEach(item => {
            if (Math.abs(item.correlationCoefficient) > Math.abs(maxCorr)) {
              maxCorr = item.correlationCoefficient;
              optLag = item.timelag;
            }
          });
          
          setOptimalTimelag(optLag);
        }
        
        // Generate high alert days
        const alertDays = identifyHighAlertDays(pollutionData, asthmaEmergencyData);
        setHighAlertDays(alertDays);
      } else {
        // Generate mock data for correlation and alerts if real data is not available
        const pollutionData = data.map(d => ({ date: d.date, value: d.value }));
        const mockEmergencyData = getMockAsthmaEmergencyData(pollutionData);
        
        // Generate time-lag analysis with mock data
        const timeLagAnalysis = generateTimeLagAnalysis(
          pollutionData, 
          mockEmergencyData.map(d => ({ date: d.date, value: d.rate })),
          7
        );
        setCorrelationData(timeLagAnalysis);
        
        // Find optimal time lag
        let maxCorr = 0;
        let optLag = 0;
        
        timeLagAnalysis.forEach(item => {
          if (Math.abs(item.correlationCoefficient) > Math.abs(maxCorr)) {
            maxCorr = item.correlationCoefficient;
            optLag = item.timelag;
          }
        });
        
        setOptimalTimelag(optLag);
        
        // Generate mock high alert days
        const mockAlertDays = data.map(day => ({
          date: day.date,
          pollutionValue: day.value,
          asthmaValue: day.value > 35 ? 12 : day.value > 25 ? 8 : 5,
          alertLevel: (day.value > 35 ? 'high' : day.value > 25 ? 'moderate' : 'low') as 'high' | 'moderate' | 'low'
        }));
        
        setHighAlertDays(mockAlertDays);
      }
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError('Failed to fetch trend data');
    }
  };

  // Calculate city rankings based on AQI
  const calculateCityRankings = (data: AirQualityData) => {
    if (!data.features || data.features.length === 0) {
      return;
    }
    
    const sortedByAQI = [...data.features].sort((a, b) => 
      b.properties.AQI - a.properties.AQI
    );
    
    // Get most polluted cities
    const mostPolluted = sortedByAQI.slice(0, 5).map(feature => {
      const zip = feature.properties.zip;
      const city = COLORADO_CITIES.find(c => c.zip === zip)?.name || 'Unknown';
      
      return {
        city,
        zip,
        aqi: feature.properties.AQI
      };
    });
    
    // Get cleanest cities
    const cleanest = [...sortedByAQI].reverse().slice(0, 5).map(feature => {
      const zip = feature.properties.zip;
      const city = COLORADO_CITIES.find(c => c.zip === zip)?.name || 'Unknown';
      
      return {
        city,
        zip,
        aqi: feature.properties.AQI
      };
    });
    
    setMostPollutedCities(mostPolluted);
    setCleanestCities(cleanest);
  };

  // Generate mock air quality data for Colorado
  const generateMockAirQualityData = (): AirQualityData => {
    const features = COLORADO_CITIES.map(city => {
      // Generate a consistent (not random) AQI based on ZIP code
      // This ensures each ZIP code always gets the same AQI
      const zipSum = city.zip.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const baseAQI = 30; // Moderate air quality base
      const variation = zipSum % 50; // 0-49 variation based on ZIP
      const aqi = baseAQI + variation;
      
      // Determine category based on AQI
      let category;
      if (aqi <= 50) category = 'Good';
      else if (aqi <= 100) category = 'Moderate';
      else if (aqi <= 150) category = 'Unhealthy for Sensitive Groups';
      else if (aqi <= 200) category = 'Unhealthy';
      else if (aqi <= 300) category = 'Very Unhealthy';
      else category = 'Hazardous';
      
      // Extract coordinates from city data or use default Denver coordinates
      const coordinates: [number, number] = [-104.9903, 39.7392]; // Default to Denver
      
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates
        },
        properties: {
          AQI: aqi,
          Category: category,
          ParameterName: selectedPollutant,
          ReportingArea: city.name,
          State: 'Colorado',
          latitude: coordinates[1],
          longitude: coordinates[0],
          zip: city.zip,
          city: city.name
        }
      };
    });
    
    return {
      type: 'FeatureCollection',
      features
    };
  };

  // Generate trend data for a specific ZIP code and pollutant
  const generateTrendData = async (zip: string, pollutant: string): Promise<TrendDataPoint[]> => {
    // Generate 7 days of data
    const data: TrendDataPoint[] = [];
    const today = new Date();
    
    // Find city data for the selected ZIP
    const cityData = zip === 'all' 
      ? { name: 'All Colorado', population: 5773714 } // Colorado's population
      : COLORADO_CITIES.find(city => city.zip === zip) || { name: 'Unknown', population: 10000 };
    
    // Find asthma rate for the selected ZIP
    const asthmaInfo = asthmaData.find(a => a.zip === zip) || {
      rate: 8.5, // Default asthma rate
      population: cityData.population,
      peopleWithAsthma: Math.round(cityData.population * 0.085) // 8.5% of population
    };
    
    // Generate data for each day
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i)); // Start 6 days ago
      
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Generate a consistent (not random) value based on date and ZIP
      const dateNum = parseInt(dateStr.replace(/-/g, ''));
      const zipNum = zip === 'all' ? 123456 : parseInt(zip);
      const seed = (dateNum + zipNum) % 100;
      
      // Base value depends on pollutant
      const baseValue = pollutant === 'PM2.5' ? 25 : 40;
      
      // Value with variation
      const value = baseValue + (seed % 40) - 10; // Range: baseValue ± 20
      
      // Calculate emergency visit rate based on pollution with some lag effect
      // Higher pollution = higher emergency visits with 1-2 day delay
      const prevDayIndex = i > 0 ? i - 1 : null;
      const prevDayValue = prevDayIndex !== null ? data[prevDayIndex].value : value;
      
      // Emergency visit rate increases with pollution levels
      const baseEmergencyRate = 5 + (prevDayValue / 10);
      const emergencyVisitRate = baseEmergencyRate + (seed % 10) / 10;
      
      // Calculate lagged emergency visit rate (for next day)
      const nextDayEmergencyRate = i < 6 ? null : data[0].emergencyVisitRate;
      
      data.push({
        date: dateStr,
        value,
        asthmaRate: asthmaInfo.rate,
        emergencyVisitRate,
        laggedEmergencyVisitRate: nextDayEmergencyRate,
        peopleWithAsthma: asthmaInfo.peopleWithAsthma,
        population: asthmaInfo.population,
        seasonalFactor: 1.0 + (date.getMonth() % 3) * 0.1 // Seasonal factor varies by month
      });
    }
    
    return data;
  };

  // Generate mock asthma data
  const getMockAsthmaData = (): AsthmaData[] => {
    return COLORADO_CITIES.map(city => {
      // Generate a consistent (not random) asthma rate based on ZIP code
      const zipSum = city.zip.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      const baseRate = 6.5; // Colorado average
      const variation = (zipSum % 40) / 10; // 0-4% variation based on ZIP
      const asthmaRate = baseRate + variation;
      
      // Calculate people with asthma
      const peopleWithAsthma = Math.round(city.population * asthmaRate / 100);
      
      return {
        zip: city.zip,
        city: city.name,
        rate: asthmaRate,
        population: city.population,
        peopleWithAsthma,
        emergencyVisitRate: 30 + (zipSum % 40), // Emergency visits per 10,000
        hospitalizationRate: 5 + (zipSum % 15) // Hospitalizations per 10,000
      };
    });
  };

  // Generate mock asthma emergency data
  const getMockAsthmaEmergencyData = (pollutionData: { date: string; value: number }[]): { date: string; rate: number }[] => {
    return pollutionData.map((point, index) => {
      // Emergency visits correlate with pollution levels from previous day
      const prevDayPollution = index > 0 ? pollutionData[index - 1].value : point.value;
      
      // Base rate depends on pollution level
      const baseRate = 5 + (prevDayPollution / 10);
      
      // Add some variation
      const dateNum = parseInt(point.date.replace(/-/g, ''));
      const variation = (dateNum % 10) / 2;
      
      return {
        date: point.date,
        rate: baseRate + variation
      };
    });
  };

  return (
    <DataContext.Provider
      value={{
        airQualityData,
        trendData,
        asthmaData,
        asthmaStatistics,
        selectedZip,
        selectedPollutant,
        mostPollutedCities,
        cleanestCities,
        zipCodes: uniqueZips,
        loading,
        error,
        correlationData,
        optimalTimelag,
        highAlertDays,
        setSelectedZip,
        setSelectedPollutant
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
