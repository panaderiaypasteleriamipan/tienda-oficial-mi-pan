import React from 'react';
import { 
  Store, 
  MessageCircle, 
  Award, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroProps {
  onGoToCatalog: () => void;
  settings: StoreSettings;
}

export const Hero: React.FC<HeroProps> = ({ onGoToCatalog, settings }) => {
  const isChristmas = settings.seasonTheme === 'navidad';

  return (
    <section className="relative overflow-hidden border-b border-amber-200/60 dark:border-slate-800 transition-colors">
      {/* Background Gradient */}
      <div className={`absolute inset-0 transition-opacity ${
        isChristmas
          ? 'bg-gradient-to-br from-red-950/40 via-amber-950/20 to-slate-900'
          : 'bg-gradient-to-br from-amber-100/70 via-orange-50/50 to-amber-50 dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-900'
      }`} />

      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-bold shadow-xs">
              <Award className="w-4 h-4 text-amber-600" />
              <span>La Panadería & Pastelería Favorita de Los Teques</span>
              {isChristmas && <span className="text-red-500 font-extrabold">🎄 Edición Navideña</span>}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
              Sabor Artesanal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500">
                Recién Horneado
              </span> Cada Mañana
            </h1>

            <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Disfruta de nuestros panes recién salidos del horno, donas glaseadas, rollos de canela, tortas húmedas de chocolate y el inconfundible <strong>Pan de Jamón Navideño</strong>. Haz tu pedido online con precios en USD y tasa BCV garantizada.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGoToCatalog}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-amber-600/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <Store className="w-5 h-5" />
                <span>Ingresar a la Tienda Virtual</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('¡Hola Panadería MiPan 2025! Quisiera consultar la disponibilidad de panes y productos hoy.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>

            {/* Features Bar */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left border-t border-amber-200/50 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">6:00 AM</h4>
                  <p className="text-[10px] text-slate-500">Pan Caliente</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">Delivery</h4>
                  <p className="text-[10px] text-slate-500">Altos Mirandinos</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">Tasa Oficial</h4>
                  <p className="text-[10px] text-slate-500">Cambio BCV</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-slate-800 flex items-center justify-center text-amber-700 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">Artesanal</h4>
                  <p className="text-[10px] text-slate-500">100% Calidad</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              {/* Outer Golden Glow Border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-700">
                <div className="p-4 bg-gradient-to-b from-amber-50 to-orange-50/30 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center">
                  <img
                    src="/logomipan.jpg"
                    alt="Panadería MiPan 2025"
                    className="w-full max-h-80 object-contain p-2 group-hover:scale-102 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                <div className="p-4 bg-slate-900 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-amber-400">
                        Panadería y Pastelería MiPan 2025
                      </h3>
                      <p className="text-xs text-slate-300">
                        Horneado con pasión y dedicación para toda la familia
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      Abierto Hoy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
