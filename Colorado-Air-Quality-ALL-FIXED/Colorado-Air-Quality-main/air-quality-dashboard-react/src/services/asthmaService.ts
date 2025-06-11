// Asthma Data Service using CDC Environmental Health Tracking API

export interface AsthmaDataPoint {
  year: number;
  state: string;
  county?: string;
  prevalence: number;
  ageGroup: string;
  dataType: string;
  date?: string; // For time-series data
  pollutantLevel?: number; // For correlation analysis
}

// Extended interface for emergency/hospitalization data
export interface AsthmaEventData extends AsthmaDataPoint {
  rate: number; // Rate per 10,000 population
  count?: number; // Actual number of events if available
  seasonalFactor?: number; // Seasonal adjustment factor
}

// Interface for correlation analysis
export interface CorrelationData {
  pollutantType: string;
  asthmaMetric: string;
  correlationCoefficient: number;
  significance: number;
  timelag: number; // Days of lag between pollution and health effects
  startDate: string;
  endDate: string;
}

interface AsthmaApiResponse {
  tableResults: {
    dataRows: Array<{
      [key: string]: string | number;
    }>;
  };
}

// CDC Environmental Health Tracking API configuration
const CDC_API_BASE_URL = 'https://ephtracking.cdc.gov/apigateway/api/v1';

// Known measure IDs for asthma data from CDC Tracking Network
const ASTHMA_MEASURE_IDS = {
  ADULT_PREVALENCE: '296', // Age-adjusted Prevalence of Current Asthma among Adults >=18 Years
  CHILD_PREVALENCE: '297', // Prevalence of Current Asthma among Children 0-17 Years
  EMERGENCY_VISITS: '298', // Emergency Department Visits for Asthma
  HOSPITALIZATIONS: '299' // Hospitalizations for Asthma
};

// Colorado state code
const COLORADO_STATE_CODE = '08';

// Fetch asthma prevalence data for Colorado
export const fetchAsthmaPrevalence = async (measureId: string = ASTHMA_MEASURE_IDS.ADULT_PREVALENCE): Promise<AsthmaDataPoint[]> => {
  try {
    // Get the most recent year available (usually 2-3 years behind current year)
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - 2; // Try 2 years ago
    
    const url = `${CDC_API_BASE_URL}/getCoreHolder/${measureId}/${COLORADO_STATE_CODE}/0/${targetYear}/${targetYear}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AsthmaApiResponse = await response.json();
    
    if (!data.tableResults || !data.tableResults.dataRows) {
      return [];
    }
    
    // Transform the API response to our format
    return data.tableResults.dataRows.map(row => ({
      year: targetYear,
      state: 'Colorado',
      county: row.geoName as string || 'Colorado',
      prevalence: parseFloat(row.dataValue as string) || 0,
      ageGroup: measureId === ASTHMA_MEASURE_IDS.ADULT_PREVALENCE ? 'Adults 18+' : 'Children 0-17',
      dataType: 'Prevalence'
    }));
  } catch (error) {
    console.error('Error fetching asthma prevalence data:', error);
    return [];
  }
};

// Fetch asthma emergency department visits data with historical data
export const fetchAsthmaEmergencyVisits = async (startYear?: number, endYear?: number): Promise<AsthmaEventData[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const targetEndYear = endYear || currentYear - 2;
    const targetStartYear = startYear || targetEndYear - 1; // Default to 1 year of data
    
    const url = `${CDC_API_BASE_URL}/getCoreHolder/${ASTHMA_MEASURE_IDS.EMERGENCY_VISITS}/${COLORADO_STATE_CODE}/0/${targetStartYear}/${targetEndYear}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AsthmaApiResponse = await response.json();
    
    if (!data.tableResults || !data.tableResults.dataRows) {
      return [];
    }
    
    return data.tableResults.dataRows.map(row => {
      // Extract year from the data
      const yearValue = row.yearStart || row.year || targetEndYear;
      const year = typeof yearValue === 'string' ? parseInt(yearValue) : yearValue as number;
      
      // Calculate a date for this data point (using mid-year if only year is available)
      const date = row.date ? row.date as string : `${year}-07-01`;
      
      // Extract rate and count if available
      const rate = parseFloat(row.dataValue as string) || 0;
      const count = row.count ? parseFloat(row.count as string) : undefined;
      
      // Calculate seasonal factor based on month (if date is available)
      let seasonalFactor = 1.0;
      if (date) {
        const month = new Date(date).getMonth();
        // Higher factors in spring and fall (allergy seasons)
        if (month >= 2 && month <= 4) seasonalFactor = 1.3; // Spring
        else if (month >= 8 && month <= 10) seasonalFactor = 1.2; // Fall
        else if (month >= 11 || month <= 1) seasonalFactor = 1.1; // Winter
        else seasonalFactor = 0.9; // Summer
      }
      
      return {
        year,
        state: 'Colorado',
        county: row.geoName as string || 'Colorado',
        prevalence: rate, // Use rate as prevalence for consistency
        rate,
        count,
        ageGroup: 'All Ages',
        dataType: 'Emergency Visits',
        date,
        seasonalFactor
      };
    });
  } catch (error) {
    console.error('Error fetching asthma emergency visits data:', error);
    return [];
  }
};

// Fetch asthma hospitalization data with historical data
export const fetchAsthmaHospitalizations = async (startYear?: number, endYear?: number): Promise<AsthmaEventData[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const targetEndYear = endYear || currentYear - 2;
    const targetStartYear = startYear || targetEndYear - 1; // Default to 1 year of data
    
    const url = `${CDC_API_BASE_URL}/getCoreHolder/${ASTHMA_MEASURE_IDS.HOSPITALIZATIONS}/${COLORADO_STATE_CODE}/0/${targetStartYear}/${targetEndYear}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AsthmaApiResponse = await response.json();
    
    if (!data.tableResults || !data.tableResults.dataRows) {
      return [];
    }
    
    return data.tableResults.dataRows.map(row => {
      // Extract year from the data
      const yearValue = row.yearStart || row.year || targetEndYear;
      const year = typeof yearValue === 'string' ? parseInt(yearValue) : yearValue as number;
      
      // Calculate a date for this data point (using mid-year if only year is available)
      const date = row.date ? row.date as string : `${year}-07-01`;
      
      // Extract rate and count if available
      const rate = parseFloat(row.dataValue as string) || 0;
      const count = row.count ? parseFloat(row.count as string) : undefined;
      
      // Calculate seasonal factor based on month (if date is available)
      let seasonalFactor = 1.0;
      if (date) {
        const month = new Date(date).getMonth();
        // Higher factors in spring and fall (allergy seasons)
        if (month >= 2 && month <= 4) seasonalFactor = 1.3; // Spring
        else if (month >= 8 && month <= 10) seasonalFactor = 1.2; // Fall
        else if (month >= 11 || month <= 1) seasonalFactor = 1.1; // Winter
        else seasonalFactor = 0.9; // Summer
      }
      
      return {
        year,
        state: 'Colorado',
        county: row.geoName as string || 'Colorado',
        prevalence: rate, // Use rate as prevalence for consistency
        rate,
        count,
        ageGroup: 'All Ages',
        dataType: 'Hospitalizations',
        date,
        seasonalFactor
      };
    });
  } catch (error) {
    console.error('Error fetching asthma hospitalization data:', error);
    return [];
  }
};

// Get Colorado county-level asthma data (both prevalence and events)
export const fetchColoradoCountyAsthmaData = async (): Promise<AsthmaDataPoint[]> => {
  try {
    // Fetch both prevalence and event data
    const [adultData, childData, emergencyData, hospitalizationData] = await Promise.all([
      fetchAsthmaPrevalence(ASTHMA_MEASURE_IDS.ADULT_PREVALENCE),
      fetchAsthmaPrevalence(ASTHMA_MEASURE_IDS.CHILD_PREVALENCE),
      fetchAsthmaEmergencyVisits(),
      fetchAsthmaHospitalizations()
    ]);
    
    return [...adultData, ...childData, ...emergencyData, ...hospitalizationData];
  } catch (error) {
    console.error('Error fetching Colorado county asthma data:', error);
    return [];
  }
};

// Calculate state-wide asthma statistics with extended metrics
export const calculateAsthmaStatistics = (data: AsthmaDataPoint[]) => {
  if (data.length === 0) {
    return {
      averagePrevalence: 8.7, // National average fallback
      totalCounties: 64, // Colorado has 64 counties
      dataAvailable: false,
      emergencyVisitRate: 49.3, // National average fallback
      hospitalizationRate: 8.2, // National average fallback
      eventDataAvailable: false
    };
  }
  
  const prevalenceData = data.filter(d => d.dataType === 'Prevalence');
  const adultData = prevalenceData.filter(d => d.ageGroup === 'Adults 18+');
  const childData = prevalenceData.filter(d => d.ageGroup === 'Children 0-17');
  
  // Calculate prevalence averages
  const avgAdultPrevalence = adultData.length > 0 
    ? adultData.reduce((sum, d) => sum + d.prevalence, 0) / adultData.length 
    : 8.7;
    
  const avgChildPrevalence = childData.length > 0 
    ? childData.reduce((sum, d) => sum + d.prevalence, 0) / childData.length 
    : 7.5;
  
  // Calculate emergency visit and hospitalization rates
  const emergencyData = data.filter(d => d.dataType === 'Emergency Visits') as AsthmaEventData[];
  const hospitalizationData = data.filter(d => d.dataType === 'Hospitalizations') as AsthmaEventData[];
  
  const avgEmergencyRate = emergencyData.length > 0
    ? emergencyData.reduce((sum, d) => sum + d.rate, 0) / emergencyData.length
    : 49.3;
    
  const avgHospitalizationRate = hospitalizationData.length > 0
    ? hospitalizationData.reduce((sum, d) => sum + d.rate, 0) / hospitalizationData.length
    : 8.2;
  
  return {
    averagePrevalence: (avgAdultPrevalence + avgChildPrevalence) / 2,
    adultPrevalence: avgAdultPrevalence,
    childPrevalence: avgChildPrevalence,
    emergencyVisitRate: avgEmergencyRate,
    hospitalizationRate: avgHospitalizationRate,
    totalCounties: Math.max(adultData.length, childData.length, emergencyData.length, hospitalizationData.length, 1),
    dataAvailable: prevalenceData.length > 0,
    eventDataAvailable: emergencyData.length > 0 || hospitalizationData.length > 0
  };
};

// Calculate correlation between pollution levels and asthma events
export const calculatePollutionAsthmaCorrelation = (
  pollutionData: { date: string; value: number }[],
  asthmaData: { date: string; value: number }[],
  timelagDays: number = 0
): CorrelationData | null => {
  try {
    if (!pollutionData || !asthmaData || pollutionData.length < 5 || asthmaData.length < 5) {
      return null;
    }
    
    // Align data by dates, applying timelag
    const alignedData: { pollution: number; asthma: number }[] = [];
    
    pollutionData.forEach(pollutionPoint => {
      // Calculate the lagged date for asthma effect
      const pollutionDate = new Date(pollutionPoint.date);
      const laggedDate = new Date(pollutionDate);
      laggedDate.setDate(laggedDate.getDate() + timelagDays);
      
      // Find matching asthma data point
      const matchingAsthmaPoint = asthmaData.find(asthmaPoint => {
        const asthmaDate = new Date(asthmaPoint.date);
        return asthmaDate.toISOString().split('T')[0] === laggedDate.toISOString().split('T')[0];
      });
      
      if (matchingAsthmaPoint) {
        alignedData.push({
          pollution: pollutionPoint.value,
          asthma: matchingAsthmaPoint.value
        });
      }
    });
    
    // Need at least 3 points for meaningful correlation
    if (alignedData.length < 3) {
      return null;
    }
    
    // Calculate correlation coefficient (Pearson's r)
    const n = alignedData.length;
    const sumX = alignedData.reduce((sum, point) => sum + point.pollution, 0);
    const sumY = alignedData.reduce((sum, point) => sum + point.asthma, 0);
    const sumXY = alignedData.reduce((sum, point) => sum + (point.pollution * point.asthma), 0);
    const sumXX = alignedData.reduce((sum, point) => sum + (point.pollution * point.pollution), 0);
    const sumYY = alignedData.reduce((sum, point) => sum + (point.asthma * point.asthma), 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    if (denominator === 0) {
      return null;
    }
    
    const correlation = numerator / denominator;
    
    // Calculate significance (simplified p-value approximation)
    // For small samples, this is a rough approximation
    const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
    const significance = 2 * (1 - Math.min(0.99, Math.abs(t) / 10)); // Simplified p-value approximation
    
    return {
      pollutantType: 'PM2.5', // Default, should be passed in from caller
      asthmaMetric: 'Emergency Visits', // Default, should be passed in from caller
      correlationCoefficient: correlation,
      significance,
      timelag: timelagDays,
      startDate: pollutionData[0].date,
      endDate: pollutionData[pollutionData.length - 1].date
    };
  } catch (error) {
    console.error('Error calculating pollution-asthma correlation:', error);
    return null;
  }
};

// Generate time-lagged correlation analysis
export const generateTimeLagAnalysis = (
  pollutionData: { date: string; value: number }[],
  asthmaData: { date: string; value: number }[],
  maxLagDays: number = 7
): CorrelationData[] => {
  const results: CorrelationData[] = [];
  
  // Calculate correlation for different time lags
  for (let lag = 0; lag <= maxLagDays; lag++) {
    const correlation = calculatePollutionAsthmaCorrelation(pollutionData, asthmaData, lag);
    if (correlation) {
      results.push(correlation);
    }
  }
  
  // Sort by correlation strength (absolute value)
  return results.sort((a, b) => Math.abs(b.correlationCoefficient) - Math.abs(a.correlationCoefficient));
};

// Identify high alert days based on pollution and asthma data
export const identifyHighAlertDays = (
  pollutionData: { date: string; value: number }[],
  asthmaData: { date: string; value: number }[],
  pollutionThreshold: number = 35, // AQI threshold for PM2.5
  asthmaThreshold: number = 75 // Percentile threshold for asthma events
): { date: string; pollutionValue: number; asthmaValue: number; alertLevel: 'high' | 'moderate' | 'low' }[] => {
  // Calculate asthma threshold value based on percentile
  const sortedAsthmaValues = [...asthmaData].sort((a, b) => a.value - b.value);
  const asthmaThresholdValue = sortedAsthmaValues[Math.floor(sortedAsthmaValues.length * asthmaThreshold / 100)]?.value || 0;
  
  const alertDays: { date: string; pollutionValue: number; asthmaValue: number; alertLevel: 'high' | 'moderate' | 'low' }[] = [];
  
  // Create a map of asthma data by date for quick lookup
  const asthmaByDate = new Map<string, number>();
  asthmaData.forEach(point => {
    asthmaByDate.set(point.date, point.value);
  });
  
  // Analyze each pollution data point
  pollutionData.forEach(pollutionPoint => {
    const asthmaValue = asthmaByDate.get(pollutionPoint.date) || 0;
    
    let alertLevel: 'high' | 'moderate' | 'low' = 'low';
    
    if (pollutionPoint.value >= pollutionThreshold && asthmaValue >= asthmaThresholdValue) {
      alertLevel = 'high';
    } else if (pollutionPoint.value >= pollutionThreshold || asthmaValue >= asthmaThresholdValue) {
      alertLevel = 'moderate';
    }
    
    alertDays.push({
      date: pollutionPoint.date,
      pollutionValue: pollutionPoint.value,
      asthmaValue,
      alertLevel
    });
  });
  
  return alertDays;
};

// Mock fallback data for when API is unavailable
export const getMockAsthmaData = (): AsthmaDataPoint[] => {
  const currentYear = new Date().getFullYear() - 2;
  const coloradoCounties = [
    'Adams', 'Alamosa', 'Arapahoe', 'Archuleta', 'Baca', 'Bent', 'Boulder', 'Broomfield',
    'Chaffee', 'Cheyenne', 'Clear Creek', 'Conejos', 'Costilla', 'Crowley', 'Custer',
    'Delta', 'Denver', 'Dolores', 'Douglas', 'Eagle', 'El Paso', 'Elbert', 'Fremont',
    'Garfield', 'Gilpin', 'Grand', 'Gunnison', 'Hinsdale', 'Huerfano', 'Jackson',
    'Jefferson', 'Kiowa', 'Kit Carson', 'La Plata', 'Lake', 'Larimer', 'Las Animas',
    'Lincoln', 'Logan', 'Mesa', 'Mineral', 'Moffat', 'Montezuma', 'Montrose', 'Morgan',
    'Otero', 'Ouray', 'Park', 'Phillips', 'Pitkin', 'Prowers', 'Pueblo', 'Rio Blanco',
    'Rio Grande', 'Routt', 'Saguache', 'San Juan', 'San Miguel', 'Sedgwick', 'Summit',
    'Teller', 'Washington', 'Weld', 'Yuma'
  ];
  
  const mockData: AsthmaDataPoint[] = [];
  
  // Generate mock data for major counties
  const majorCounties = ['Denver', 'El Paso', 'Jefferson', 'Arapahoe', 'Adams', 'Boulder', 'Larimer'];
  
  majorCounties.forEach(county => {
    // Adult prevalence (typically 8-12%)
    mockData.push({
      year: currentYear,
      state: 'Colorado',
      county: county,
      prevalence: Math.random() * 4 + 8, // 8-12%
      ageGroup: 'Adults 18+',
      dataType: 'Prevalence'
    });
    
    // Child prevalence (typically 6-10%)
    mockData.push({
      year: currentYear,
      state: 'Colorado',
      county: county,
      prevalence: Math.random() * 4 + 6, // 6-10%
      ageGroup: 'Children 0-17',
      dataType: 'Prevalence'
    });
  });
  
  return mockData;
};

// Generate mock emergency visit data with correlation to pollution levels
export const getMockAsthmaEmergencyData = (pollutionData: { date: string; value: number }[]): AsthmaEventData[] => {
  const mockData: AsthmaEventData[] = [];
  
  // Generate emergency visit data that correlates with pollution data
  pollutionData.forEach(pollutionPoint => {
    // Create data point for same day
    const baseRate = 5 + (pollutionPoint.value * 0.1); // Base correlation
    const noise = (Math.random() - 0.5) * 2; // Random noise
    
    // Parse date and get month for seasonal factor
    const date = new Date(pollutionPoint.date);
    const month = date.getMonth();
    
    // Higher factors in spring and fall (allergy seasons)
    let seasonalFactor = 1.0;
    if (month >= 2 && month <= 4) seasonalFactor = 1.3; // Spring
    else if (month >= 8 && month <= 10) seasonalFactor = 1.2; // Fall
    else if (month >= 11 || month <= 1) seasonalFactor = 1.1; // Winter
    else seasonalFactor = 0.9; // Summer
    
    // Calculate final rate with seasonal adjustment
    const rate = (baseRate + noise) * seasonalFactor;
    
    mockData.push({
      year: date.getFullYear(),
      state: 'Colorado',
      county: 'Colorado',
      prevalence: rate,
      rate,
      ageGroup: 'All Ages',
      dataType: 'Emergency Visits',
      date: pollutionPoint.date,
      seasonalFactor,
      pollutantLevel: pollutionPoint.value
    });
    
    // Create data point for day after (with lag effect - higher correlation)
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];
    
    // Stronger correlation with 1-day lag (pollution effect takes time)
    const laggedRate = 5 + (pollutionPoint.value * 0.2) + (Math.random() - 0.5) * 2;
    
    mockData.push({
      year: nextDay.getFullYear(),
      state: 'Colorado',
      county: 'Colorado',
      prevalence: laggedRate * seasonalFactor,
      rate: laggedRate * seasonalFactor,
      ageGroup: 'All Ages',
      dataType: 'Emergency Visits',
      date: nextDayStr,
      seasonalFactor,
      pollutantLevel: pollutionPoint.value
    });
  });
  
  return mockData;
};

// Generate mock hospitalization data with correlation to pollution levels
export const getMockAsthmaHospitalizationData = (pollutionData: { date: string; value: number }[]): AsthmaEventData[] => {
  const mockData: AsthmaEventData[] = [];
  
  // Generate hospitalization data that correlates with pollution data
  pollutionData.forEach(pollutionPoint => {
    // Create data point for two days after (hospitalizations typically lag emergency visits)
    const date = new Date(pollutionPoint.date);
    const laggedDate = new Date(date);
    laggedDate.setDate(date.getDate() + 2);
    const laggedDateStr = laggedDate.toISOString().split('T')[0];
    
    // Parse date and get month for seasonal factor
    const month = laggedDate.getMonth();
    
    // Higher factors in spring and fall (allergy seasons)
    let seasonalFactor = 1.0;
    if (month >= 2 && month <= 4) seasonalFactor = 1.3; // Spring
    else if (month >= 8 && month <= 10) seasonalFactor = 1.2; // Fall
    else if (month >= 11 || month <= 1) seasonalFactor = 1.1; // Winter
    else seasonalFactor = 0.9; // Summer
    
    // Stronger correlation with high pollution values (threshold effect)
    let baseRate = 1.0;
    if (pollutionPoint.value > 50) {
      baseRate = 1.5 + ((pollutionPoint.value - 50) * 0.05);
    } else if (pollutionPoint.value > 35) {
      baseRate = 1.0 + ((pollutionPoint.value - 35) * 0.03);
    }
    
    const noise = (Math.random() - 0.5) * 0.5; // Less noise than emergency visits
    const rate = (baseRate + noise) * seasonalFactor;
    
    mockData.push({
      year: laggedDate.getFullYear(),
      state: 'Colorado',
      county: 'Colorado',
      prevalence: rate,
      rate,
      ageGroup: 'All Ages',
      dataType: 'Hospitalizations',
      date: laggedDateStr,
      seasonalFactor,
      pollutantLevel: pollutionPoint.value
    });
  });
  
  return mockData;
};

export default {
  fetchAsthmaPrevalence,
  fetchAsthmaEmergencyVisits,
  fetchAsthmaHospitalizations,
  fetchColoradoCountyAsthmaData,
  calculateAsthmaStatistics,
  calculatePollutionAsthmaCorrelation,
  generateTimeLagAnalysis,
  identifyHighAlertDays,
  getMockAsthmaData,
  getMockAsthmaEmergencyData,
  getMockAsthmaHospitalizationData
};
