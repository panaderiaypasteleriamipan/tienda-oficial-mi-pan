import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-600 text-white text-xs py-2 px-4 shadow-lg flex items-center justify-center gap-2 animate-slide-down">
      <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
      <span className="font-semibold">
        Modo sin conexión a Internet — Sigues navegando con el catálogo guardado en tu dispositivo.
      </span>
      <button
        onClick={() => window.location.reload()}
        className="ml-2 px-2 py-0.5 rounded bg-amber-800 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-amber-900 transition"
      >
        <RefreshCw className="w-3 h-3" /> Reintentar
      </button>
    </div>
  );
};
