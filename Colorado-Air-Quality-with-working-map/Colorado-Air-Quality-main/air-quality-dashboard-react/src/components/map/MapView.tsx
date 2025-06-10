import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import type { CircleLayer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Using Mapbox public token for demo purposes
// In production, you should use your own token from https://account.mapbox.com/
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

interface MapViewProps {
  darkMode?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ darkMode = false }) => {
  const { airQualityData, selectedPollutant } = useContext(DataContext);
  const [viewState, setViewState] = React.useState({
    longitude: -105.78, // Colorado center
    latitude: 39.55,
    zoom: 6.5,
    bearing: 0,
    pitch: 0
  });
  
  const [popupInfo, setPopupInfo] = React.useState<any>(null);
  
  // Choose map style based on dark mode
  const mapStyle = darkMode 
    ? "mapbox://styles/mapbox/dark-v11" 
    : "mapbox://styles/mapbox/light-v11";
  
  // Circle layer style for air quality data points
  const circleLayer: CircleLayer = {
    id: 'air-quality-circles',
    type: 'circle',
    source: 'air-quality-data',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'AQI'],
        0, 8,    // Minimum radius for low AQI
        50, 12,  // Small circles for good air quality
        100, 16, // Medium circles for moderate
        150, 20, // Larger circles for unhealthy
        200, 24, // Even larger for very unhealthy
        300, 28  // Maximum radius for hazardous
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'AQI'],
        0, '#a8e05f',    // Good - Green
        50, '#fdd74b',   // Moderate - Yellow
        100, '#fe9b57',  // Unhealthy for Sensitive - Orange
        150, '#fe6a69',  // Unhealthy - Red
        200, '#a97abc',  // Very Unhealthy - Purple
        300, '#a87383'   // Hazardous - Maroon
      ],
      'circle-opacity': 0.8,
      'circle-stroke-width': 2,
      'circle-stroke-color': darkMode ? '#ffffff' : '#000000',
      'circle-stroke-opacity': 0.6
    }
  };

  const onClick = (event: any) => {
    const feature = event.features && event.features[0];
    if (feature) {
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        properties: feature.properties
      });
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['air-quality-circles']}
        onClick={onClick}
      >
        <Source id="air-quality-data" type="geojson" data={airQualityData}>
          <Layer {...circleLayer} />
        </Source>
        
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            className="rounded-lg shadow-lg"
          >
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {popupInfo.properties.city}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                ZIP: {popupInfo.properties.zip}
              </p>
              <div className="mt-2 flex items-center">
                <span 
                  className="inline-block w-4 h-4 rounded-full mr-2"
                  style={{ 
                    backgroundColor: getAQIColor(popupInfo.properties.AQI) 
                  }}
                ></span>
                <span className="font-medium text-gray-900 dark:text-white">
                  AQI: {popupInfo.properties.AQI}
                </span>
              </div>
              <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                Pollutant: {popupInfo.properties.Pollutant}
              </p>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {getAQIDescription(popupInfo.properties.AQI)}
              </p>
            </div>
          </Popup>
        )}
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 flex flex-col space-y-2">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setViewState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 20) }))}
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setViewState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }))}
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            onClick={() => setViewState({
              longitude: -105.78,
              latitude: 39.55,
              zoom: 6.5,
              bearing: 0,
              pitch: 0
            })}
            aria-label="Reset view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </Map>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 max-w-xs">
        <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">Air Quality Index</h4>
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a8e05f] mr-2"></span>
            <span className="text-xs text-gray-700 dark:text-gray-300">Good (0-50)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fdd74b] mr-2"></span>
            <span className="text-xs text-gray-700 dark:text-gray-300">Moderate (51-100)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe9b57] mr-2"></span>
            <span className="text-xs text-gray-700 dark:text-gray-300">Unhealthy for Sensitive (101-150)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe6a69] mr-2"></span>
            <span className="text-xs text-gray-700 dark:text-gray-300">Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a97abc] mr-2"></span>
            <span className="text-xs text-gray-700 dark:text-gray-300">Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a87383] mr-2"></span>
            <span className="text-xs text-gray-700 dark:text-gray-300">Hazardous (301+)</span>
          </div>
        </div>
      </div>
      
      {/* Pollutant Filter */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
        <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-white">
          Current Pollutant: {selectedPollutant}
        </h4>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Click on circles for details
        </div>
      </div>
    </div>
  );
};

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

export default MapView;
