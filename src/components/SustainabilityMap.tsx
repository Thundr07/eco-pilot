import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Sample data for industries and sustainability locations
const sustainabilityLocations = [
  { 
    id: 1, 
    name: 'Solar Power Plant', 
    type: 'renewable', 
    coords: [80.2707, 13.0827], 
    description: 'Major solar energy facility',
    impact: 'positive'
  },
  { 
    id: 2, 
    name: 'Industrial Complex', 
    type: 'industry', 
    coords: [80.1863, 13.0674], 
    description: 'Manufacturing hub with high emissions',
    impact: 'negative'
  },
  { 
    id: 3, 
    name: 'Wind Farm', 
    type: 'renewable', 
    coords: [80.2365, 13.1181], 
    description: 'Clean wind energy generation',
    impact: 'positive'
  },
  { 
    id: 4, 
    name: 'Waste Treatment Plant', 
    type: 'waste', 
    coords: [80.2500, 13.0500], 
    description: 'Modern waste processing facility',
    impact: 'neutral'
  },
  { 
    id: 5, 
    name: 'Coal Power Station', 
    type: 'industry', 
    coords: [80.1500, 13.1000], 
    description: 'Fossil fuel power generation',
    impact: 'negative'
  },
];

const SustainabilityMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [80.2707, 13.0827], // Chennai coordinates
      zoom: 10,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      // Add markers for each location
      sustainabilityLocations.forEach(location => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        
        // Color based on impact
        if (location.impact === 'positive') {
          el.style.backgroundColor = '#10b981'; // green
        } else if (location.impact === 'negative') {
          el.style.backgroundColor = '#ef4444'; // red
        } else {
          el.style.backgroundColor = '#3b82f6'; // blue
        }

        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${location.name}</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 4px;">${location.description}</p>
            <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; background-color: ${
              location.impact === 'positive' ? '#d1fae5' : location.impact === 'negative' ? '#fee2e2' : '#dbeafe'
            }; color: ${
              location.impact === 'positive' ? '#065f46' : location.impact === 'negative' ? '#991b1b' : '#1e40af'
            };">
              ${location.impact === 'positive' ? '✓ Positive Impact' : location.impact === 'negative' ? '⚠ High Emissions' : 'ℹ Neutral'}
            </span>
          </div>`
        );

        new mapboxgl.Marker(el)
          .setLngLat(location.coords as [number, number])
          .setPopup(popup)
          .addTo(map.current!);
      });
    });

    setIsMapInitialized(true);
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {!isMapInitialized ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-4 bg-card p-6 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Access Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="Enter your Mapbox public token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Get your token from{' '}
                <a 
                  href="https://account.mapbox.com/access-tokens/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  mapbox.com
                </a>
              </p>
            </div>
            <button
              onClick={() => initializeMap(mapboxToken)}
              disabled={!mapboxToken}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Load Map
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-card border-b px-6 py-4">
            <h2 className="text-xl font-semibold mb-2">Live Sustainability Map</h2>
            <p className="text-sm text-muted-foreground">
              Showing industries and sustainability-affecting locations
            </p>
            <div className="flex gap-4 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                <span>Positive Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white"></div>
                <span>High Emissions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                <span>Neutral</span>
              </div>
            </div>
          </div>
          <div ref={mapContainer} className="flex-1" />
        </>
      )}
    </div>
  );
};

export default SustainabilityMap;
