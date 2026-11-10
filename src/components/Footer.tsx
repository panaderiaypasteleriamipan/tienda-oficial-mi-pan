import React from 'react';
import { MapPin, Phone, Clock, Wheat, MessageCircle, Heart, Store, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onGoToTab: (tab: 'home' | 'catalog' | 'reviews' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onGoToTab }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src="/logomipan.jpg"
                alt="Logo Panadería MiPan 2025"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <div>
                <h3 className="font-serif text-xl font-black text-amber-400">
                  {settings.businessName}
                </h3>
                <p className="text-xs text-slate-400">
                  RIF: {settings.rif} • Los Teques, Estado Miranda
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Dedicados a hornear con amor, tradición y materias primas de la más alta calidad. Pan campesino, canillas, panes dulces, repostería fina y el tradicional Pan de Jamón para todas las familias de los Altos Mirandinos.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Escríbenos al WhatsApp</span>
              </a>

              <button
                onClick={() => onGoToTab('admin')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Acceso Admin</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Navegación Rápida
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onGoToTab('home')}
                  className="hover:text-amber-400 transition"
                >
                  Página Principal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToTab('catalog')}
                  className="hover:text-amber-400 transition"
                >
                  Catálogo & Tienda Virtual
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToTab('reviews')}
                  className="hover:text-amber-400 transition"
                >
                  Opiniones de Clientes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onGoToTab('admin')}
                  className="hover:text-amber-400 transition"
                >
                  Gestión de Inventario (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Ubicación y Horario
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+58 {settings.whatsappNumber.slice(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Panadería y Pastelería MiPan 2025 C.A. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con dedicación en Los Teques</span>
            <Wheat className="w-3.5 h-3.5 text-amber-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
