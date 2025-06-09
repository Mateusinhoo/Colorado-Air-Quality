import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import Map, { Source, Layer, Popup } from 'react-map-gl';
import type { CircleLayer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// This would normally come from an environment variable
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xhbXBsZWtleSJ9.example-signature';

const MapView: React.FC = () => {
  const { airQualityData, selectedPollutant } = useContext(DataContext);
  const [viewState, setViewState] = React.useState({
    longitude: -105.78, // Colorado center
    latitude: 39.55,
    zoom: 6.5,
    bearing: 0,
    pitch: 0
  });
  
  const [popupInfo, setPopupInfo] = React.useState<any>(null);
  
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
        0, 4000,
        300, 25000
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'AQI'],
        0, '#a8e05f',    // Good
        50, '#fdd74b',   // Moderate
        100, '#fe9b57',  // Unhealthy for Sensitive
        150, '#fe6a69',  // Unhealthy
        200, '#a97abc',  // Very Unhealthy
        300, '#a87383'   // Hazardous
      ],
      'circle-opacity': 0.7,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
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
        mapStyle="mapbox://styles/mapbox/light-v11"
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
            <div className="p-2">
              <h3 className="font-semibold text-lg">{popupInfo.properties.city}</h3>
              <p className="text-sm text-gray-600">ZIP: {popupInfo.properties.zip}</p>
              <div className="mt-2 flex items-center">
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2"
                  style={{ 
                    backgroundColor: getAQIColor(popupInfo.properties.AQI) 
                  }}
                ></span>
                <span className="font-medium">AQI: {popupInfo.properties.AQI}</span>
              </div>
              <p className="text-sm mt-1">Pollutant: {popupInfo.properties.Pollutant}</p>
            </div>
          </Popup>
        )}
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 flex flex-col space-y-2">
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setViewState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 20) }))}
            aria-label="Zoom in"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setViewState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }))}
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
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
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
        <h4 className="font-medium text-sm mb-2">Air Quality Index</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a8e05f] mr-2"></span>
            <span className="text-xs">Good (0-50)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fdd74b] mr-2"></span>
            <span className="text-xs">Moderate (51-100)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe9b57] mr-2"></span>
            <span className="text-xs">Unhealthy for Sensitive (101-150)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#fe6a69] mr-2"></span>
            <span className="text-xs">Unhealthy (151-200)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a97abc] mr-2"></span>
            <span className="text-xs">Very Unhealthy (201-300)</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-[#a87383] mr-2"></span>
            <span className="text-xs">Hazardous (301+)</span>
          </div>
        </div>
      </div>
      
      {/* Pollutant Filter */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-3">
        <h4 className="font-medium text-sm mb-2">Current Pollutant: {selectedPollutant}</h4>
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

export default MapView;
