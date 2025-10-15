import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useWeather } from '../contexts/WeatherContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherLayer {
  id: string;
  name: string;
  url: string;
  description: string;
}

const weatherLayers: WeatherLayer[] = [
  {
    id: 'temp',
    name: 'Temperature',
    url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=demo',
    description: 'Temperature overlay',
  },
  {
    id: 'precipitation',
    name: 'Precipitation',
    url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=demo',
    description: 'Precipitation and rain overlay',
  },
  {
    id: 'clouds',
    name: 'Clouds',
    url: 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=demo',
    description: 'Cloud coverage overlay',
  },
  {
    id: 'wind',
    name: 'Wind',
    url: 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=demo',
    description: 'Wind speed and direction',
  },
];

// Component to update map view when location changes
const MapUpdater: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  
  return null;
};

const WeatherMap: React.FC = () => {
  const { weatherData } = useWeather();
  const [activeLayer, setActiveLayer] = useState<string | null>('temp');

  if (!weatherData?.location) {
    return null;
  }

  const { location } = weatherData;
  const position: [number, number] = [location.lat, location.lon];

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Weather Map</h3>
        
        {/* Layer Controls */}
        <div className="flex gap-2">
          {weatherLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeLayer === layer.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={layer.description}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <MapContainer
          center={position}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <MapUpdater lat={location.lat} lon={location.lon} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Weather Overlay Layer */}
          {activeLayer && (
            <TileLayer
              url={weatherLayers.find(l => l.id === activeLayer)?.url || ''}
              opacity={0.6}
            />
          )}

          {/* Location Marker */}
          <Marker position={position}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold">{location.name}</div>
                {weatherData.aggregated.current && (
                  <div className="text-sm mt-1">
                    {Math.round(weatherData.aggregated.current.temperature.value)}°C
                    <br />
                    {weatherData.aggregated.current.condition}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          💡 Click layer buttons to toggle weather overlays. Use mouse wheel to zoom, drag to pan.
        </p>
      </div>
    </div>
  );
};

export default WeatherMap;

