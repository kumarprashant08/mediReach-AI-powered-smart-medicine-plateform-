import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';
import { PharmacyAccessResult } from '../../types';

// Custom Leaflet Icons using SVG Data URIs to ensure no broken image URLs
const createCustomIcon = (color: string, isUser = false) => {
  const svg = isUser
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32"><circle cx="12" cy="12" r="10" fill="${color}" fill-opacity="0.3"/><circle cx="12" cy="12" r="6" fill="${color}"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });
};

const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

interface PharmacyMapProps {
  userLat?: number;
  userLng?: number;
  pharmacies: PharmacyAccessResult[];
  selectedPharmacyId?: string;
  onSelectPharmacy?: (pharmacyId: string) => void;
  routeCoordinates?: [number, number][];
  routeLabel?: string;
}

export const PharmacyMap: React.FC<PharmacyMapProps> = ({
  userLat = 28.6139,
  userLng = 77.2090,
  pharmacies,
  selectedPharmacyId,
  onSelectPharmacy,
  routeCoordinates = [],
  routeLabel = 'MediReach Safety-Aware Route',
}) => {
  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-200 relative">
      <MapContainer
        center={[userLat, userLng]}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[400px] z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={userLat} lng={userLng} />

        {/* User Location Marker & Radius */}
        <Marker position={[userLat, userLng]} icon={createCustomIcon('#0c8de9', true)}>
          <Popup>
            <div className="p-1 text-center">
              <span className="font-bold text-xs text-brand-600 block">Your Location</span>
              <span className="text-[10px] text-slate-500">Patient Search Center</span>
            </div>
          </Popup>
        </Marker>

        <Circle
          center={[userLat, userLng]}
          radius={3000}
          pathOptions={{ color: '#0c8de9', fillColor: '#0c8de9', fillOpacity: 0.08, weight: 1.5 }}
        />

        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color: '#8b5cf6', weight: 6, opacity: 0.85, dashArray: '10 8' }}
          >
            <Popup>{routeLabel}</Popup>
          </Polyline>
        )}

        {/* Pharmacy Markers */}
        {pharmacies.map((item) => {
          const ph = item.pharmacy;
          const isSelected = selectedPharmacyId === ph._id;

          let pinColor = '#10b981'; // Green for in stock
          if (item.inventory?.quantity === 0) pinColor = '#ef4444'; // Red for out of stock
          else if (item.inventory && item.inventory.quantity < 10) pinColor = '#f59e0b'; // Amber for limited

          if (isSelected) pinColor = '#8b5cf6'; // Purple highlight for selected

          return (
            <Marker
              key={ph._id}
              position={[ph.latitude, ph.longitude]}
              icon={createCustomIcon(pinColor)}
              eventHandlers={{
                click: () => onSelectPharmacy && onSelectPharmacy(ph._id),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-xs text-navy-900 leading-tight">{ph.name}</h4>
                    <span className="text-[10px] bg-brand-50 text-brand-600 font-bold px-1.5 py-0.5 rounded">
                      Score {item.accessScore}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-brand-500" /> {item.distanceKm} km away
                  </p>

                  {item.inventory && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 mb-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Price: ₹{item.inventory.price}</span>
                        <span className={item.inventory.quantity > 0 ? 'text-emerald-600' : 'text-red-600'}>
                          {item.inventory.quantity > 0 ? `${item.inventory.quantity} units` : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {ph.avgPickupMinutes}m pickup
                    </span>
                    <a
                      href={`https://maps.google.com/?q=${ph.latitude},${ph.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      Directions <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
