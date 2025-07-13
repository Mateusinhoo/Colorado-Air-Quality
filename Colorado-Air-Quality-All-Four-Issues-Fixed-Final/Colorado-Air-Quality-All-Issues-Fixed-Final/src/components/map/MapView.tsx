import React from 'react';
import { useDataContext } from '../../context/DataContext';
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  darkMode?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ darkMode = false }) => {
  const { airQualityData, selectedPollutant } = useDataContext();
  
  // Colorado center coordinates
  const coloradoCenter: [number, number] = [39.55, -105.78];
  
  // Choose tile layer based on dark mode
  const tileUrl = darkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  
  const attribution = darkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  // Helper function to get color based on AQI value
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return '#a8e05f';
    if (aqi <= 100) return '#fdd74b';
    if (aqi <= 150) return '#fe9b57';
    if (aqi <= 200) return '#fe6a69';
    if (aqi <= 300) return '#a97abc';
    return '#a87383';
  };

  // Helper function to get AQI description
  const getAQIDescription = (aqi: number): string => {
    if (aqi <= 50) return 'Good - Air quality is satisfactory';
    if (aqi <= 100) return 'Moderate - Acceptable for most people';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy - Everyone may experience problems';
    if (aqi <= 300) return 'Very Unhealthy - Health alert';
    return 'Hazardous - Emergency conditions';
  };

  // Helper function to get radius based on AQI value
  const getAQIRadius = (aqi: number): number => {
    if (aqi <= 50) return 8;
    if (aqi <= 100) return 12;
    if (aqi <= 150) return 16;
    if (aqi <= 200) return 20;
    if (aqi <= 300) return 24;
    return 28;
  };

  // Extract features from GeoJSON data
  const features = airQualityData?.features || [];

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg" style={{ zIndex: 1 }}>
      <MapContainer
        center={coloradoCenter}
        zoom={6.5}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
        className="rounded-lg"
      >
        <TileLayer
          url={tileUrl}
          attribution={attribution}
        />
        
        <ZoomControl position="topright" />
        
        {features.map((feature: any, index: number) => {
          const coordinates = feature.geometry.coordinates;
          const properties = feature.properties;
          const lat = coordinates[1];
          const lng = coordinates[0];
          const aqi = properties.AQI;
          
          return (
            <CircleMarker
              key={index}
              center={[lat, lng]}
              radius={getAQIRadius(aqi)}
              fillColor={getAQIColor(aqi)}
              color={darkMode ? '#ffffff' : '#000000'}
              weight={2}
              opacity={0.6}
              fillOpacity={0.8}
            >
              <Popup className="rounded-lg shadow-lg">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                  <h3 className="font-semibold text-lg">
                    {properties.city}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ZIP: {properties.zip}
                  </p>
                  <div className="mt-2 flex items-center">
                    <span 
                      className="inline-block w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: getAQIColor(aqi) }}
                    ></span>
                    <span className="font-medium">
                      AQI: {aqi}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Pollutant: {properties.Pollutant}
                  </p>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getAQIDescription(aqi)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* Map Legend */}
      <div className={`absolute bottom-4 left-4 rounded-lg shadow-md p-3 max-w-xs ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h4 className="font-medium text-sm mb-2">Air Quality Index</h4>
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a8e05f] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Good (0-50)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fdd74b] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Moderate (51-100)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe9b57] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unhealthy for Sensitive (101-150)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe6a69] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a97abc] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a87383] mr-2"></span>
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hazardous (301+)</span>
          </div>
        </div>
      </div>
      
      {/* Pollutant Filter */}
      <div className={`absolute top-4 left-4 rounded-lg shadow-md p-3 ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h4 className="font-medium text-sm mb-1">
          Current Pollutant: {selectedPollutant}
        </h4>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Click on circles for details
        </div>
      </div>
    </div>
  );
};

export default MapView;

