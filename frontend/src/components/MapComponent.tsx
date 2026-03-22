import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../lib/api';
import { useStore, Building } from '../store/useStore';

// Fix shadow issues in leaflet markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const amberIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Props {
  onLoadLength: (len: number) => void;
}

export default function MapComponent({ onLoadLength }: Props) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const setSelectedBuilding = useStore((state) => state.setSelectedBuilding);

  useEffect(() => {
    api.get('/admin/buildings/opportunities')
      .then(res => {
        setBuildings(res.data);
        onLoadLength(res.data.length);
      })
      .catch((err) => console.error("API Fetch Error:", err));
  }, [onLoadLength]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative z-0">
      <MapContainer 
        center={[-10.9125, -37.0450]} 
        zoom={16} 
        style={{ height: '100%', width: '100%', backgroundColor: '#09090b', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {buildings.map((b) => (
          <Marker 
            key={b.id} 
            position={[b.latitude, b.longitude]}
            icon={b.status === 'ABANDONED' ? redIcon : amberIcon}
            eventHandlers={{
              click: () => setSelectedBuilding(b),
            }}
          >
            <Popup>
              <div className="text-zinc-900 font-sans p-1">
                <h3 className="font-bold text-sm mb-1">{b.address}</h3>
                <p className="text-xs mb-1">Status: <span className={b.status === 'ABANDONED' ? 'text-red-600 font-semibold' : 'text-amber-600 font-semibold'}>{b.status}</span></p>
                <p className="text-xs mb-1">Dívida IPTU: <span className="font-mono">R$ {b.taxDebt.toLocaleString('pt-BR')}</span></p>
                <p className="text-[10px] text-zinc-500 mt-2 italic">Visualizado no Command Center.</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
