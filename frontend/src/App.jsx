import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Shield, Radio, Battery, Activity, Navigation } from 'lucide-react';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Bağlanıyor...');

  useEffect(() => {
    // Node.js WebSocket sunucusuna bağlanıyoruz
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      setConnectionStatus('Bağlantı Kuruldu (Canlı)');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setVehicles(data);
    };

    ws.onclose = () => {
      setConnectionStatus('Bağlantı Koptu');
    };

    return () => {
      ws.close();
    };
  }, []);

  const defaultCenter = [37.0662, 37.3833];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* SOL PANEL: Komuta Kontrol & Araç Listesi */}
      <div className="w-1/3 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/30">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-cyan-400">Araç Takip</h1>
              <p className="text-xs text-slate-400">Taktik Filo Takip & Komuta Merkezi</p>
            </div>
          </div>

          <div className="mb-6 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Sistem Durumu:
            </span>
            <span className="text-xs font-semibold text-emerald-400">{connectionStatus}</span>
          </div>

          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Aktif Birimler ({vehicles.length})</h2>
          <div className="space-y-4">
            {vehicles.map((v) => (
              <div key={v.id} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl hover:border-cyan-500/50 transition-all">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-cyan-300 flex items-center gap-2">
                    <Navigation className="w-4 h-4" /> {v.id} ({v.type})
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {v.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mt-3">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-amber-400" /> Hız: <span className="text-slate-200 font-mono">{v.speed} km/s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" /> Batarya: <span className="text-slate-200 font-mono">%{v.battery}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-600 text-center border-t border-slate-800/60 pt-4">
          Eren Kartal Araç Takip
        </div>
      </div>

      {/* SAĞ TARAF: Canlı Harita */}
      <div className="w-2/3 relative z-0">
        <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
          
          {vehicles.map((v) => (
            <Marker key={v.id} position={[v.lat, v.lng]}>
              <Popup>
                <div className="text-slate-900 font-sans">
                  <strong>Birim: {v.id}</strong><br />
                  Tür: {v.type}<br />
                  Hız: {v.speed} km/s<br />
                  Batarya: %{v.battery}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
}