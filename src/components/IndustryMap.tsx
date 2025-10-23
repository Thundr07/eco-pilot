import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Data for pollution zones (high pollution areas in Chennai)
const pollutionZones = [
  { center: [13.1632, 80.3043] as LatLngExpression, radius: 3000, name: 'Ennore Industrial Zone', level: 'High' },
  { center: [13.0827, 80.2707] as LatLngExpression, radius: 2500, name: 'North Chennai', level: 'High' },
  { center: [12.9822, 80.2217] as LatLngExpression, radius: 2000, name: 'Manali', level: 'Moderate' },
];

// Data for industry-friendly zones (areas suitable for new industries)
const industryFriendlyZones = [
  { center: [12.8250, 79.7085] as LatLngExpression, radius: 4000, name: 'Sriperumbudur Industrial Corridor', infrastructure: 'Excellent' },
  { center: [12.7235, 79.9792] as LatLngExpression, radius: 3500, name: 'Oragadam Industrial Area', infrastructure: 'Good' },
  { center: [13.0443, 80.1735] as LatLngExpression, radius: 2500, name: 'Padi Industrial Estate', infrastructure: 'Good' },
];

interface Industry {
  name: string;
  type: string;
  lat: number;
  lng: number;
  emissions: number;
}

interface IndustryMapProps {
  industries?: Industry[];
}

// Map controller to fix Leaflet marker icons and ensure map renders properly
const MapController = () => {
  const map = useMap();
  
  useEffect(() => {
    // Fix Leaflet's default icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
    
    // Force map to recalculate size
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  
  return null;
};

// Custom icon for industry markers
const createIndustryIcon = (emissions: number) => {
  const color = emissions > 75 ? '#ef4444' : emissions > 60 ? '#f59e0b' : '#10b981';
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const IndustryMap = ({ industries = [] }: IndustryMapProps) => {
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border-2 border-border">
      <MapContainer
        center={[13.0827, 80.2707] as LatLngExpression}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Pollution zones - red circles */}
        {pollutionZones.map((zone, index) => (
          <Circle
            key={`pollution-${index}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
          >
            <Popup>
              <div>
                <strong>{zone.name}</strong>
                <br />
                Pollution Level: {zone.level}
              </div>
            </Popup>
          </Circle>
        ))}
        
        {/* Industry-friendly zones - green circles */}
        {industryFriendlyZones.map((zone, index) => (
          <Circle
            key={`friendly-${index}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.15 }}
          >
            <Popup>
              <div>
                <strong>{zone.name}</strong>
                <br />
                Infrastructure: {zone.infrastructure}
                <br />
                <span className="text-green-600">✓ Suitable for Industry</span>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Industry markers */}
        {industries.map((industry, index) => (
          <Marker
            key={`industry-${index}`}
            position={[industry.lat, industry.lng] as LatLngExpression}
            icon={createIndustryIcon(industry.emissions)}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-base">{industry.name}</strong>
                <br />
                <span className="text-muted-foreground">Type: {industry.type}</span>
                <br />
                <span className={industry.emissions > 75 ? 'text-red-600' : industry.emissions > 60 ? 'text-yellow-600' : 'text-green-600'}>
                  Emissions Score: {industry.emissions}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border z-[1000]">
        <h4 className="font-semibold mb-2 text-sm">Map Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 opacity-50"></div>
            <span>High Pollution Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 opacity-30"></div>
            <span>Industry-Friendly Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
            <span>High Emissions Industry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white"></div>
            <span>Medium Emissions Industry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
            <span>Low Emissions Industry</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryMap;
