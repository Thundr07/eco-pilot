import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import type { CircleMarkerProps } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pollutionZones = [
  { id: 1, name: 'High Pollution Zone A', lat: 13.0827, lng: 80.2707, radius: 3000, pollution: 'high' },
  { id: 2, name: 'Moderate Pollution Zone B', lat: 13.0674, lng: 80.1863, radius: 2500, pollution: 'moderate' },
  { id: 3, name: 'High Pollution Zone C', lat: 13.1000, lng: 80.1500, radius: 2000, pollution: 'high' },
];

const industryFriendlyZones = [
  { id: 1, name: 'Industrial Park Zone 1', lat: 13.1181, lng: 80.2365, radius: 2000, suitable: true },
  { id: 2, name: 'Green Industrial Zone 2', lat: 13.0500, lng: 80.2500, radius: 2500, suitable: true },
  { id: 3, name: 'Sustainable Industry Zone 3', lat: 13.0900, lng: 80.2900, radius: 1800, suitable: true },
];

const MapController = () => {
  const map = useMap();
  
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
    
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  
  return null;
};

const IndustryMap = () => {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border-2 border-border shadow-lg">
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <MapController />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {pollutionZones.map((zone) => {
          const center: [number, number] = [zone.lat, zone.lng];
          return (
            <Circle
              key={`pollution-${zone.id}`}
              center={center}
              radius={zone.radius}
              pathOptions={{
                color: zone.pollution === 'high' ? '#ef4444' : '#f97316',
                fillColor: zone.pollution === 'high' ? '#ef4444' : '#f97316',
                fillOpacity: 0.3,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{zone.name}</strong>
                  <p className="text-xs text-muted-foreground mt-1">
                    {zone.pollution === 'high' ? '⚠️ High Pollution' : '⚠️ Moderate Pollution'}
                  </p>
                  <p className="text-xs mt-1">Not recommended for new industries</p>
                </div>
              </Popup>
            </Circle>
          );
        })}
        {industryFriendlyZones.map((zone) => {
          const center: [number, number] = [zone.lat, zone.lng];
          return (
            <Circle
              key={`industry-${zone.id}`}
              center={center}
              radius={zone.radius}
              pathOptions={{
                color: '#10b981',
                fillColor: '#10b981',
                fillOpacity: 0.3,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{zone.name}</strong>
                  <p className="text-xs text-muted-foreground mt-1">✓ Suitable for Industries</p>
                  <p className="text-xs mt-1">Low pollution, good infrastructure</p>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>
      
      <div className="bg-card p-4 border-t">
        <div className="flex gap-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 opacity-50"></div>
            <span>High Pollution Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500 opacity-50"></div>
            <span>Moderate Pollution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 opacity-50"></div>
            <span>Industry-Friendly Zones</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryMap;
