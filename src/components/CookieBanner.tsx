import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenLegal: (section?: 'cookies' | 'terms' | 'privacy') => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('mipan_cookies_consent');
      if (!consent) {
        // Show after a gentle 1.2s delay for pleasant UX
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage error handled
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('mipan_cookies_consent', 'accepted_all');
    } catch {}
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('mipan_cookies_consent', 'essential_only');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 border border-amber-300/80 dark:border-slate-700 shadow-2xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-white leading-tight">
              Aviso de Cookies y Almacenamiento
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              En MiPan 2025 usamos almacenamiento local únicamente para conservar tu <strong>carrito de pedidos</strong>, tus preferencias de tema y la tasa oficial BCV. No realizamos rastreo publicitario invasivo.
            </p>
          </div>
          <button
            onClick={handleAcceptEssential}
            className="text-slate-400 hover:text-slate-600 p-1"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => onOpenLegal('cookies')}
            className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline"
          >
            Ver Política & Términos
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAcceptEssential}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition"
            >
              Solo Necesarias
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition shadow-sm"
            >
              Aceptar Todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
