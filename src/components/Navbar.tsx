import React from 'react';
import { 
  ShoppingBag, 
  Moon, 
  Sun, 
  Sparkles, 
  Wheat, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Menu, 
  X,
  Phone,
  Store
} from 'lucide-react';
import { StoreSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: 'home' | 'catalog' | 'reviews' | 'admin';
  setCurrentTab: (tab: 'home' | 'catalog' | 'reviews' | 'admin') => void;
  cartCount: number;
  cartTotalUsd: number;
  openCart: () => void;
  settings: StoreSettings;
  updateTheme: (theme: 'classic' | 'navidad') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onRefreshBcv: () => void;
  isBcvRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  cartCount,
  cartTotalUsd,
  openCart,
  settings,
  updateTheme,
  isDarkMode,
  toggleDarkMode,
  onRefreshBcv,
  isBcvRefreshing,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-md backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-amber-200/50 dark:border-slate-800 transition-colors">
      {/* Top Banner - BCV Rate, Schedule & Contact */}
      <div className={`text-xs py-1.5 px-4 transition-colors ${
        settings.seasonTheme === 'navidad'
          ? 'bg-gradient-to-r from-red-800 via-rose-900 to-emerald-900 text-white'
          : 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-amber-50'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* BCV Rate pill */}
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide flex items-center gap-1 shadow-xs">
              BCV OFICIAL
            </span>
            <span className="font-medium">
              Tasa: <strong className="font-bold text-amber-200 dark:text-amber-300">Bs. {settings.bcvRate.toFixed(2)}</strong> / USD
            </span>
            <button
              onClick={onRefreshBcv}
              title="Actualizar tasa BCV oficial"
              className="p-1 hover:text-white text-amber-200 transition-transform active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBcvRefreshing ? 'animate-spin text-white' : ''}`} />
            </button>
          </div>

          {/* Schedule & Location */}
          <div className="hidden md:flex items-center gap-4 text-[11px] opacity-90">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              {settings.openingHours}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Los Teques, C.C. Los Teques
            </span>
            <a 
              href={`https://wa.me/${settings.whatsappNumber}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 font-semibold"
            >
              <Phone className="w-3 h-3" />
              +58 {settings.whatsappNumber.slice(2)}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <button
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="relative">
            <img
              src="/logomipan.jpg"
              alt="Logo MiPan 2025"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-amber-400 shadow-md group-hover:scale-105 transition-transform"
              onError={(e) => {
                // Fallback to placeholder if asset is loading
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80';
              }}
            />
            {settings.seasonTheme === 'navidad' && (
              <span className="absolute -top-1 -right-1 text-xs">🎄</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg sm:text-xl font-black tracking-tight text-amber-800 dark:text-amber-400">
                MiPan <span className="text-amber-600 dark:text-amber-300">2025</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-slate-700">
                C.A.
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 hidden xs:flex">
              <Wheat className="w-3 h-3 text-amber-600" />
              Los Teques • Panadería & Repostería
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'home'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'catalog'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            Catálogo & Tienda
          </button>
          <button
            onClick={() => setCurrentTab('reviews')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'reviews'
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Opiniones
          </button>
          <button
            onClick={() => setCurrentTab('admin')}
            className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
              currentTab === 'admin'
                ? 'bg-slate-900 text-amber-400 dark:bg-slate-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Admin
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>

          {/* Theme selector */}
          <div className="hidden sm:block">
            <select
              value={settings.seasonTheme}
              onChange={(e) => updateTheme(e.target.value as 'classic' | 'navidad')}
              aria-label="Seleccionar tema de temporada"
              className="text-xs bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-medium text-amber-900 dark:text-amber-300 focus:outline-none cursor-pointer"
            >
              <option value="classic">🥖 Clásico Artesanal</option>
              <option value="navidad">🎄 Mágica Navidad</option>
            </select>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            className="p-2 rounded-lg text-slate-600 dark:text-amber-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <ShoppingBag className="w-5 h-5" />
            <div className="text-left hidden xs:block">
              <span className="block text-[10px] uppercase font-bold leading-none text-amber-100">
                Tu Carrito
              </span>
              <span className="text-xs font-black leading-tight">
                ${cartTotalUsd.toFixed(2)}
              </span>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm font-semibold text-center ${
                currentTab === 'home'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => {
                setCurrentTab('catalog');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-1.5 ${
                currentTab === 'catalog'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Store className="w-4 h-4" />
              Catálogo
            </button>
            <button
              onClick={() => {
                setCurrentTab('reviews');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm font-semibold text-center ${
                currentTab === 'reviews'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Opiniones
            </button>
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className={`p-2.5 rounded-lg text-sm font-semibold text-center flex items-center justify-center gap-1.5 ${
                currentTab === 'admin'
                  ? 'bg-slate-900 text-amber-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Admin
            </button>
          </div>

          {/* Theme switcher & Install on mobile */}
          <div className="pt-2 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Temporada:</span>
              <select
                value={settings.seasonTheme}
                onChange={(e) => updateTheme(e.target.value as 'classic' | 'navidad')}
                aria-label="Seleccionar tema de temporada en móvil"
                className="text-xs bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-medium text-amber-900 dark:text-amber-300"
              >
                <option value="classic">🥖 Clásico Artesanal</option>
                <option value="navidad">🎄 Mágica Navidad</option>
              </select>
            </div>
            <div className="pt-1 flex justify-center">
              <PWAInstallButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
