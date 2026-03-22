import React, { useState } from 'react';
import api from '../lib/api';
import { useStore } from '../store/useStore';
import { Sparkles, Loader2, MapPin, ReceiptText } from 'lucide-react';

export default function AiPanel() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const selectedBuilding = useStore((state) => state.selectedBuilding);

  const generateStrategy = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/admin/insights');
      // If the backend returns { insights: "text" }
      setInsight(data.insights || data);
    } catch (err) {
      setInsight("Erro ao contactar o Conselheiro IA. Verifique sua conexão e autorização B2G.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl overflow-hidden relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-600/20 text-teal-400 p-2 rounded-xl">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-zinc-100">Consultor IA (Urbanismo)</h2>
          <p className="text-xs text-zinc-400">Motor de Decisão Llama 3</p>
        </div>
      </div>

      <div className="mb-6 bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex-shrink-0">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-teal-500" /> Foco Ativo (Map Pins)
        </h3>
        {selectedBuilding ? (
          <div className="space-y-2">
            <p className="text-xs text-zinc-400 flex justify-between">
              <span>Endereço:</span>
              <span className="text-zinc-100 text-right w-2/3 truncate">{selectedBuilding.address}</span>
            </p>
            <p className="text-xs text-zinc-400 flex justify-between">
              <span>Status Mapeado:</span>
              <span className={selectedBuilding.status === 'ABANDONED' ? 'text-red-400 font-bold' : 'text-amber-400 font-bold'}>
                {selectedBuilding.status}
              </span>
            </p>
            <p className="text-xs text-zinc-400 flex justify-between">
              <span>Potencial de Tráfego:</span>
              <span className="text-teal-400">{selectedBuilding.footTrafficScore} / 100</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic text-center py-2">
            Selecione uma Oportunidade no mapa para isolar dados.
          </p>
        )}
      </div>

      <button 
        onClick={generateStrategy}
        disabled={loading}
        className="w-full mb-6 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-900/20 disabled:opacity-50 flex-shrink-0"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
        {loading ? 'Processando Malha Urbana...' : 'Gerar Estratégia de Revitalização'}
      </button>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-800 rounded w-full"></div>
            <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
          </div>
        ) : insight ? (
          <div className="text-sm text-zinc-300 leading-relaxed space-y-4 whitespace-pre-wrap">
            {insight}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-3 opacity-50">
            <ReceiptText size={48} />
            <p className="text-xs text-center px-4">
              Aguardando solicitação para inferir concessões e isenções (IPTU/ISS).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
