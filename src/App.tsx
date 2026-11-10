/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  ArrowRight, 
  Crown, 
  Sparkles, 
  Wheat, 
  Flame, 
  Truck, 
  ShieldCheck, 
  Phone, 
  MessageCircle,
  Filter,
  CheckCircle,
  ShoppingBag
} from 'lucide-react';
import { Product, CartItem, StoreSettings, Category, CustomerOrder } from './types';
import { 
  getStoredProducts, 
  getStoredSettings, 
  saveStoredSettings 
} from './utils/storage';
import { fetchOfficialBcvRate } from './utils/bcv';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminPanel } from './components/AdminPanel';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { SnowCanvas } from './components/SnowCanvas';
import { OfflineIndicator } from './components/OfflineIndicator';
import { CookieBanner } from './components/CookieBanner';
import { LegalModal } from './components/LegalModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'reviews' | 'admin'>('home');
  const [settings, setSettings] = useState<StoreSettings>(() => getStoredSettings());
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('mipan_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<CustomerOrder | null>(null);

  // Legal & Cookie Modal State
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalSection, setLegalSection] = useState<'cookies' | 'terms' | 'privacy'>('cookies');

  const handleOpenLegal = (section: 'cookies' | 'terms' | 'privacy' = 'cookies') => {
    setLegalSection(section);
    setIsLegalOpen(true);
  };

  // Catalog Filters & Sorting
  const [catalogCategory, setCatalogCategory] = useState<Category>('todos');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogSort, setCatalogSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mipan_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  // BCV Status
  const [isBcvRefreshing, setIsBcvRefreshing] = useState(false);

  // Persist dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mipan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mipan_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('mipan_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cartItems]);

  // Auto-fetch BCV rate on mount
  useEffect(() => {
    refreshBcvRate();
  }, []);

  // Listen to product/setting changes
  useEffect(() => {
    const handleProductsChange = () => setProducts(getStoredProducts());
    const handleSettingsChange = () => setSettings(getStoredSettings());

    window.addEventListener('mipan_products_changed', handleProductsChange);
    window.addEventListener('mipan_settings_changed', handleSettingsChange);
    return () => {
      window.removeEventListener('mipan_products_changed', handleProductsChange);
      window.removeEventListener('mipan_settings_changed', handleSettingsChange);
    };
  }, []);

  const refreshBcvRate = async () => {
    setIsBcvRefreshing(true);
    try {
      const res = await fetchOfficialBcvRate(settings.bcvRate);
      if (res.rate > 0) {
        const updated = {
          ...settings,
          bcvRate: res.rate,
          bcvLastUpdated: res.lastUpdated,
        };
        setSettings(updated);
        saveStoredSettings(updated);
      }
    } catch (e) {
      console.warn('Could not auto-refresh BCV', e);
    } finally {
      setIsBcvRefreshing(false);
    }
  };

  const handleUpdateTheme = (theme: 'classic' | 'navidad') => {
    const updated = { ...settings, seasonTheme: theme };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity,
    0
  );

  // Filtered & Sorted Catalog Products
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      catalogCategory === 'todos' || p.category === catalogCategory;
    const matchSearch =
      p.name.toLowerCase().includes(catalogSearch.toLowerCase().trim()) ||
      p.desc.toLowerCase().includes(catalogSearch.toLowerCase().trim());
    return matchCategory && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (catalogSort === 'price-asc') return a.priceUsd - b.priceUsd;
    if (catalogSort === 'price-desc') return b.priceUsd - a.priceUsd;
    if (catalogSort === 'name') return a.name.localeCompare(b.name);
    return 0; // featured default
  });

  // Featured products for Home page
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Snowfall canvas for Christmas theme */}
      <SnowCanvas active={settings.seasonTheme === 'navidad'} />

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cartCount}
        cartTotalUsd={cartTotalUsd}
        openCart={() => setIsCartOpen(true)}
        settings={settings}
        updateTheme={handleUpdateTheme}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onRefreshBcv={refreshBcvRate}
        isBcvRefreshing={isBcvRefreshing}
      />

      {/* VIEW: HOME */}
      {currentTab === 'home' && (
        <main className="flex-1 space-y-12 pb-16">
          <Hero
            onGoToCatalog={() => setCurrentTab('catalog')}
            settings={settings}
          />

          {/* Featured Highlights Showcase */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-bold mb-2">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Lo Más Pedido en Los Teques</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  Especialidades de la Casa
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Elaborados con masa madre, ingredientes frescos y recetas tradicionales venezolanas.
                </p>
              </div>

              <button
                onClick={() => setCurrentTab('catalog')}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 transition self-start sm:self-auto shadow-sm"
              >
                <span>Ver Catálogo Completo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  bcvRate={settings.bcvRate}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </section>

          {/* Prominent Exclusive Catalog Banner (matching original repo) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-14 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white">
              <div 
                className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1920&q=80')` }}
              />

              <div className="relative z-10 max-w-2xl space-y-4 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider border border-white/20">
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Colección & Pedidos Directos</span>
                </div>

                <h3 className="font-serif text-3xl sm:text-5xl font-black leading-tight text-white drop-shadow-md">
                  Descubre Nuestra <br className="hidden sm:inline" />
                  Tienda Virtual Completa
                </h3>

                <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
                  Realiza tu pedido de panes calientes, donas, tortas personalizadas o combo navideño. Puedes pagar en Pago Móvil a tasa oficial BCV, Zelle o divisas y recibirlo en la puerta de tu hogar o retirar en tienda.
                </p>

                <div className="pt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  <button
                    onClick={() => setCurrentTab('catalog')}
                    className="px-8 py-4 bg-white text-amber-900 hover:bg-amber-100 font-extrabold text-sm rounded-full shadow-xl transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>Ingresar a la Tienda Virtual</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hola Panadería MiPan 2025, quisiera ordenar para entrega a domicilio.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-full shadow-xl transition flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Delivery</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Reviews Section */}
          <ReviewsSection onAddReviewSuccess={() => setCurrentTab('reviews')} />
        </main>
      )}

      {/* VIEW: CATALOG / STORE */}
      {currentTab === 'catalog' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-900 dark:text-amber-300 text-xs font-bold mb-1">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span>Catálogo E-commerce MiPan 2025</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  Nuestros Productos & Precios
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Precios sincronizados en tiempo real: USD ($) y Bolívares (Bs.) según la tasa oficial del BCV ({settings.bcvRate.toFixed(2)} Bs/$).
                </p>
              </div>

              {/* View Cart Quick Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition self-start md:self-auto"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ver Mi Pedido ({cartCount} {cartCount === 1 ? 'ítem' : 'ítems'})</span>
                <span className="ml-1 font-black bg-white/20 px-2 py-0.5 rounded-lg">
                  ${cartTotalUsd.toFixed(2)}
                </span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => setCatalogCategory('todos')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  catalogCategory === 'todos'
                    ? 'bg-amber-600 text-white shadow-amber-600/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                Todos ({products.length})
              </button>
              <button
                onClick={() => setCatalogCategory('panes')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  catalogCategory === 'panes'
                    ? 'bg-amber-600 text-white shadow-amber-600/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                🥖 Panes
              </button>
              <button
                onClick={() => setCatalogCategory('tortas_dulces')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  catalogCategory === 'tortas_dulces'
                    ? 'bg-amber-600 text-white shadow-amber-600/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                🍰 Tortas & Dulces
              </button>
              <button
                onClick={() => setCatalogCategory('dulces_secos')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  catalogCategory === 'dulces_secos'
                    ? 'bg-amber-600 text-white shadow-amber-600/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                🍪 Dulces Secos & Galletas
              </button>
              <button
                onClick={() => setCatalogCategory('navideno')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  catalogCategory === 'navideno'
                    ? 'bg-red-700 text-white shadow-red-700/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-red-400'
                }`}
              >
                🎄 Especial Navideño
              </button>
              <button
                onClick={() => setCatalogCategory('viveres')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  catalogCategory === 'viveres'
                    ? 'bg-amber-600 text-white shadow-amber-600/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                🥫 Víveres
              </button>
              <button
                onClick={() => setCatalogCategory('otros')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                  catalogCategory === 'otros'
                    ? 'bg-amber-600 text-white shadow-amber-600/25'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                📦 Otros
              </button>
            </div>

            {/* Search Bar & Sorter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar en el catálogo (ej. campesino, chocolate, donas)..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                <span className="text-slate-400">Ordenar:</span>
                <select
                  value={catalogSort}
                  onChange={(e) => setCatalogSort(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre alfabético</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-amber-200 dark:border-slate-800 p-8">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-700 dark:text-slate-300">
                No encontramos productos con ese filtro
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Intenta con otro término de búsqueda o selecciona "Todos" para ver el surtido completo.
              </p>
              <button
                onClick={() => {
                  setCatalogCategory('todos');
                  setCatalogSearch('');
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Restablecer Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  bcvRate={settings.bcvRate}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* VIEW: REVIEWS */}
      {currentTab === 'reviews' && (
        <main className="flex-1 py-4">
          <ReviewsSection />
        </main>
      )}

      {/* VIEW: ADMIN PANEL */}
      {currentTab === 'admin' && (
        <main className="flex-1 py-4">
          <AdminPanel
            settings={settings}
            onUpdateSettings={(updated) => setSettings(updated)}
            onProductsChange={() => setProducts(getStoredProducts())}
            onOpenInvoice={(order) => setInvoiceOrder(order)}
          />
        </main>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        bcvRate={settings.bcvRate}
        onAddToCart={handleAddToCart}
        settings={settings}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        settings={settings}
        onOpenInvoice={(order) => setInvoiceOrder(order)}
      />

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        settings={settings}
      />

      {/* Legal & Cookies Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        settings={settings}
        defaultSection={legalSection}
      />

      {/* Offline Status Alert Banner */}
      <OfflineIndicator />

      {/* Cookie & LocalStorage Consent Banner */}
      <CookieBanner onOpenLegal={handleOpenLegal} />

      {/* Footer */}
      <Footer
        settings={settings}
        onGoToTab={(tab) => setCurrentTab(tab)}
        onOpenLegal={handleOpenLegal}
      />
    </div>
  );
}
