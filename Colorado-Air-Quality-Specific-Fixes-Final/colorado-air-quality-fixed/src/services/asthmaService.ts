// Asthma Data Service using CDC Environmental Health Tracking API

export interface AsthmaDataPoint {
  year: number;
  state: string;
  county?: string;
  prevalence: number;
  ageGroup: string;
  dataType: string;
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

// Fetch asthma emergency department visits data
export const fetchAsthmaEmergencyVisits = async (): Promise<AsthmaDataPoint[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - 2;
    
    const url = `${CDC_API_BASE_URL}/getCoreHolder/${ASTHMA_MEASURE_IDS.EMERGENCY_VISITS}/${COLORADO_STATE_CODE}/0/${targetYear}/${targetYear}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AsthmaApiResponse = await response.json();
    
    if (!data.tableResults || !data.tableResults.dataRows) {
      return [];
    }
    
    return data.tableResults.dataRows.map(row => ({
      year: targetYear,
      state: 'Colorado',
      county: row.geoName as string || 'Colorado',
      prevalence: parseFloat(row.dataValue as string) || 0,
      ageGroup: 'All Ages',
      dataType: 'Emergency Visits'
    }));
  } catch (error) {
    console.error('Error fetching asthma emergency visits data:', error);
    return [];
  }
};

// Get Colorado county-level asthma data
export const fetchColoradoCountyAsthmaData = async (): Promise<AsthmaDataPoint[]> => {
  try {
    // Fetch both adult and child prevalence data
    const [adultData, childData] = await Promise.all([
      fetchAsthmaPrevalence(ASTHMA_MEASURE_IDS.ADULT_PREVALENCE),
      fetchAsthmaPrevalence(ASTHMA_MEASURE_IDS.CHILD_PREVALENCE)
    ]);
    
    return [...adultData, ...childData];
  } catch (error) {
    console.error('Error fetching Colorado county asthma data:', error);
    return [];
  }
};

// Calculate state-wide asthma statistics
export const calculateAsthmaStatistics = (data: AsthmaDataPoint[]) => {
  if (data.length === 0) {
    return {
      averagePrevalence: 8.7, // National average fallback
      totalCounties: 64, // Colorado has 64 counties
      dataAvailable: false
    };
  }
  
  const prevalenceData = data.filter(d => d.dataType === 'Prevalence');
  const adultData = prevalenceData.filter(d => d.ageGroup === 'Adults 18+');
  const childData = prevalenceData.filter(d => d.ageGroup === 'Children 0-17');
  
  const avgAdultPrevalence = adultData.length > 0 
    ? adultData.reduce((sum, d) => sum + d.prevalence, 0) / adultData.length 
    : 8.7;
    
  const avgChildPrevalence = childData.length > 0 
    ? childData.reduce((sum, d) => sum + d.prevalence, 0) / childData.length 
    : 7.5;
  
  return {
    averagePrevalence: (avgAdultPrevalence + avgChildPrevalence) / 2,
    adultPrevalence: avgAdultPrevalence,
    childPrevalence: avgChildPrevalence,
    totalCounties: Math.max(adultData.length, childData.length, 1),
    dataAvailable: data.length > 0
  };
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

export default {
  fetchAsthmaPrevalence,
  fetchAsthmaEmergencyVisits,
  fetchColoradoCountyAsthmaData,
  calculateAsthmaStatistics,
  getMockAsthmaData
};

