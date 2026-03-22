import React, { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { LogOut, Building2, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import AiPanel from '../components/AiPanel';

export default function Dashboard() {
  const { user, logout } = useStore();
  const [abandonedCount, setAbandonedCount] = useState(0);

  const handleLocationsLoad = useCallback((count: number) => {
    setAbandonedCount(count);
  }, []);

  return (
    <div className="h-screen w-full bg-zinc-950 flex flex-col p-4 gap-4 overflow-hidden">
      
      {/* TOP NAVIGATION & KPIS */}
      <header className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 text-white p-2 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-100">Ficaqui</h1>
              <p className="text-xs text-teal-500 font-medium">B2G Dashboard</p>
            </div>
          </div>
          <button onClick={logout} className="text-zinc-500 hover:text-red-400 transition-colors p-2" title="Sair">
            <LogOut size={20} />
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-center shadow-lg relative overflow-hidden">
          <TrendingUp className="absolute -right-4 -bottom-4 text-zinc-800 opacity-50" size={64} />
          <p className="text-xs text-zinc-400 font-semibold mb-1">VGV Potencial (Est.)</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-500 bg-clip-text text-transparent">
            R$ 45.2M
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-center shadow-lg relative overflow-hidden">
          <AlertTriangle className="absolute -right-4 -bottom-4 text-red-900/20" size={64} />
          <p className="text-xs text-zinc-400 font-semibold mb-1">Passivos Urbanos Mapeados</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-amber-500">{abandonedCount}</p>
            <span className="text-xs text-zinc-500">Prédios</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-center shadow-lg relative overflow-hidden">
          <Users className="absolute -right-4 -bottom-4 text-zinc-800 opacity-50" size={64} />
          <p className="text-xs text-zinc-400 font-semibold mb-1">Índice de Tráfego Pedestre</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-teal-400">Alto</p>
            <div className="flex gap-1 h-3 mt-1">
              <div className="w-1.5 h-full bg-teal-600 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-full bg-teal-600 rounded-full animate-pulse delay-75"></div>
              <div className="w-1.5 h-full bg-teal-600 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        
        {/* LEAFLET MAP */}
        <div className="lg:col-span-2 h-[50vh] lg:h-full relative z-0">
          <MapComponent onLoadLength={handleLocationsLoad} />
        </div>

        {/* AI PANEL */}
        <div className="h-[50vh] lg:h-full">
          <AiPanel />
        </div>

      </main>
    </div>
  );
}
