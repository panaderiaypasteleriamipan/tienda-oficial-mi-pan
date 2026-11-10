import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  DollarSign, 
  Package, 
  RefreshCw, 
  Check, 
  X, 
  Eye, 
  Save, 
  RotateCcw, 
  Download, 
  UploadCloud, 
  MessageCircle, 
  FileText, 
  Phone, 
  MapPin, 
  Clock, 
  Search, 
  Lock, 
  Unlock,
  AlertCircle
} from 'lucide-react';
import { Product, StoreSettings, CustomerOrder, Category } from '../types';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredSettings, 
  saveStoredSettings, 
  getStoredOrders, 
  updateStoredOrderStatus, 
  resetToDefaults 
} from '../utils/storage';
import { fetchOfficialBcvRate } from '../utils/bcv';

interface AdminPanelProps {
  settings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  onProductsChange: () => void;
  onOpenInvoice: (order: CustomerOrder) => void;
}

const PRESET_IMAGES = [
  { name: 'Pan Campesino', url: '/inventario/pan campasino.jpg' },
  { name: 'Donas Glaseadas', url: '/inventario/donas glaceadas.jpg' },
  { name: 'Pan de Jamón Navideño', url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80' },
  { name: 'Canillas & Baguettes', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { name: 'Rollo de Canela', url: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80' },
  { name: 'Torta de Chocolate', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  { name: 'Brazo Gitano', url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pasta Seca / Galletas', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Panettone', url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Queso Paisa', url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  settings,
  onUpdateSettings,
  onProductsChange,
  onOpenInvoice,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<Exclude<Category, 'todos'>>('panes');
  const [formPriceUsd, setFormPriceUsd] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formDesc, setFormDesc] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formImage, setFormImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Settings State
  const [settingsForm, setSettingsForm] = useState(settings);
  const [isBcvLoading, setIsBcvLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const handleStorageChange = () => loadData();
    window.addEventListener('mipan_products_changed', handleStorageChange);
    window.addEventListener('mipan_orders_changed', handleStorageChange);
    window.addEventListener('mipan_settings_changed', handleStorageChange);
    return () => {
      window.removeEventListener('mipan_products_changed', handleStorageChange);
      window.removeEventListener('mipan_orders_changed', handleStorageChange);
      window.removeEventListener('mipan_settings_changed', handleStorageChange);
    };
  }, []);

  const loadData = () => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    setSettingsForm(getStoredSettings());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === settings.adminPin || pinInput === 'mipan2025') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN incorrecto. El PIN por defecto es: mipan2025');
    }
  };

  // Open Modal for Add/Edit
  const handleOpenModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setFormName(prod.name);
      setFormCategory(prod.category);
      setFormPriceUsd(prod.priceUsd.toString());
      setFormStock(prod.stock.toString());
      setFormDesc(prod.desc);
      setFormBadge(prod.badge || '');
      setFormImage(prod.image);
    } else {
      setEditingProduct(null);
      setFormName('');
      setFormCategory('panes');
      setFormPriceUsd('');
      setFormStock('20');
      setFormDesc('');
      setFormBadge('');
      setFormImage('/inventario/pan campasino.jpg');
    }
    setIsModalOpen(true);
  };

  // Process image file upload (converts to base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formPriceUsd);
    const stock = parseInt(formStock, 10);

    if (isNaN(price) || price < 0) {
      alert('Por favor introduce un precio válido.');
      return;
    }

    const currentList = getStoredProducts();

    if (editingProduct) {
      const updatedList = currentList.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formName.trim(),
              category: formCategory,
              priceUsd: price,
              stock: isNaN(stock) ? 0 : stock,
              desc: formDesc.trim(),
              badge: formBadge.trim() || undefined,
              image: formImage || '/inventario/pan campasino.jpg',
            }
          : p
      );
      saveStoredProducts(updatedList);
      showToast('Producto actualizado correctamente.');
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        priceUsd: price,
        stock: isNaN(stock) ? 0 : stock,
        desc: formDesc.trim(),
        badge: formBadge.trim() || undefined,
        image: formImage || '/inventario/pan campasino.jpg',
        isAvailable: true,
      };
      saveStoredProducts([newProduct, ...currentList]);
      showToast('Producto agregado al catálogo.');
    }

    onProductsChange();
    setIsModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de eliminar "${name}" del catálogo?`)) {
      const updated = products.filter((p) => p.id !== id);
      saveStoredProducts(updated);
      onProductsChange();
      showToast('Producto eliminado.');
    }
  };

  // Quick stock edit
  const handleQuickStock = (productId: string, delta: number) => {
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock + delta) };
      }
      return p;
    });
    saveStoredProducts(updated);
    onProductsChange();
  };

  // Manual BCV Update & Sync
  const handleSyncBcv = async () => {
    setIsBcvLoading(true);
    try {
      const res = await fetchOfficialBcvRate(settings.bcvRate);
      const updated = {
        ...settings,
        bcvRate: res.rate,
        bcvLastUpdated: res.lastUpdated,
      };
      saveStoredSettings(updated);
      onUpdateSettings(updated);
      setSettingsForm(updated);
      showToast(`Tasa BCV sincronizada: Bs. ${res.rate.toFixed(2)} (${res.source})`);
    } catch {
      showToast('No se pudo conectar a la API del BCV.');
    } finally {
      setIsBcvLoading(false);
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settingsForm);
    onUpdateSettings(settingsForm);
    showToast('Configuraciones guardadas.');
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (window.confirm('¿Deseas restaurar el catálogo predeterminado de MiPan 2025 con todos sus productos e imágenes?')) {
      resetToDefaults();
      onProductsChange();
      showToast('Catálogo y productos restaurados exitosamente.');
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      products: getStoredProducts(),
      settings: getStoredSettings(),
      orders: getStoredOrders(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_mipan2025_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad descargada.');
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchCat = categoryFilter === 'todos' || p.category === categoryFilter;
    const matchQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Calculate equivalent in Bs
  const calculatedBs = (parseFloat(formPriceUsd || '0') * settings.bcvRate).toFixed(2);

  // Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/80 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center shadow-xs">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-serif text-2xl font-black text-slate-900 dark:text-white">
            Panel de Administración
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión de inventario, precios en USD/Bs, pedidos y productos de MiPan 2025.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1 text-left">
              PIN de Acceso
            </label>
            <input
              type="password"
              placeholder="Ingresa el PIN (defecto: mipan2025)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white text-center tracking-widest font-mono font-bold"
            />
          </div>

          {pinError && (
            <p className="text-xs text-red-500 font-medium">{pinError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition active:scale-98"
          >
            Ingresar al Panel
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              setPinInput('mipan2025');
              setIsAuthenticated(true);
            }}
            className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            <Unlock className="w-3.5 h-3.5" /> Desbloquear con PIN predeterminado (mipan2025)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3 animate-slide-up text-sm font-medium">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-200/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              Control E-Commerce
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Sincronizado
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            Panel de Control MiPan 2025
          </h1>
          <p className="text-xs text-slate-500">
            Administra precios en USD, equivalencias automáticas en Bs, fotos y pedidos de la panadería.
          </p>
        </div>

        {/* BCV Quick Card & Logout */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3 bg-amber-50 dark:bg-slate-800/80 rounded-2xl border border-amber-200/60 dark:border-slate-700 flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">
                Tasa Oficial BCV
              </span>
              <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                Bs. {settings.bcvRate.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleSyncBcv}
              disabled={isBcvLoading}
              title="Sincronizar con API oficial de BCV"
              className="p-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isBcvLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'products'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Productos e Inventario ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition relative ${
            activeTab === 'orders'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Historial de Pedidos ({orders.length})</span>
          {orders.some((o) => o.status === 'pendiente') && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
            activeTab === 'settings'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Configuración & Respaldos</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS INVENTORY */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar producto por nombre o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value="todos">Todas las categorías</option>
                <option value="panes">🥖 Panes</option>
                <option value="tortas_dulces">🍰 Repostería</option>
                <option value="dulces_secos">🍪 Dulces Secos</option>
                <option value="navideno">🎄 Especial Navideño</option>
                <option value="viveres">🥫 Víveres</option>
                <option value="otros">📦 Otros</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenModal()}
                className="px-4 py-2.5 bg-slate-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Producto</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 w-16 text-center">Foto</th>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-right">Precio USD</th>
                    <th className="p-4 text-right">Equivalente Bs.</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No se encontraron productos coincidentes.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const priceBs = (p.priceUsd * settings.bcvRate).toFixed(2);
                      const isLow = p.stock <= 5;

                      return (
                        <tr key={p.id} className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition">
                          <td className="p-4 text-center">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-amber-200 dark:border-slate-700 mx-auto"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80';
                              }}
                            />
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {p.desc}
                            </div>
                            {p.badge && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                                {p.badge}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                              {p.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 text-right font-black text-amber-600 dark:text-amber-400 text-sm">
                            ${p.priceUsd.toFixed(2)}
                          </td>
                          <td className="p-4 text-right font-bold text-slate-700 dark:text-slate-300">
                            Bs. {priceBs}
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl">
                              <button
                                onClick={() => handleQuickStock(p.id, -1)}
                                className="w-5 h-5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                isLow ? 'text-red-600 bg-red-100 dark:bg-red-950/50' : 'text-slate-800 dark:text-slate-200'
                              }`}>
                                {p.stock}
                              </span>
                              <button
                                onClick={() => handleQuickStock(p.id, 1)}
                                className="w-5 h-5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenModal(p)}
                                title="Editar Producto"
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 transition"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                title="Eliminar Producto"
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-red-600 dark:text-red-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Pedidos Recibidos en Tienda
            </h2>
            <span className="text-xs text-slate-500">
              Total: {orders.length} pedidos registrados
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-amber-200/60 dark:border-slate-800 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-slate-700 dark:text-slate-300">
                Aún no hay pedidos registrados
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Cuando los clientes realicen pedidos desde el carrito, aparecerán aquí con su estado y detalles para despachar.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200/60 dark:border-slate-800 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-sm">
                        #{order.orderNumber}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {order.customerName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {order.date} • {order.customerPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Selector */}
                      <select
                        value={order.status}
                        onChange={(e) => updateStoredOrderStatus(order.id, e.target.value as CustomerOrder['status'])}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                          order.status === 'completado'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : order.status === 'en_preparacion'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                            : order.status === 'cancelado'
                            ? 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300'
                            : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        <option value="pendiente">🟡 Pendiente</option>
                        <option value="en_preparacion">🟠 En Preparación</option>
                        <option value="completado">🟢 Completado / Entregado</option>
                        <option value="cancelado">🔴 Cancelado</option>
                      </select>

                      <button
                        onClick={() => onOpenInvoice(order)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>Ver Factura</span>
                      </button>

                      <a
                        href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${order.customerName}, le saludamos de Panadería MiPan 2025 respecto a su orden #${order.orderNumber}.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Items List in Order */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Detalle de Artículos:
                      </span>
                      <ul className="space-y-1">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex justify-between text-slate-700 dark:text-slate-300">
                            <span>{item.quantity}x {item.productName}</span>
                            <span className="font-semibold">${item.subtotalUsd.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Modalidad:</span>
                        <strong className="text-slate-800 dark:text-slate-200">
                          {order.deliveryType === 'delivery' ? 'Delivery a Domicilio' : 'Retiro en Tienda'}
                        </strong>
                      </div>
                      {order.address && (
                        <div className="text-slate-600 dark:text-slate-400">
                          <span>Dirección: </span>
                          <span className="text-slate-800 dark:text-slate-200">{order.address}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Método de Pago:</span>
                        <strong className="text-slate-800 dark:text-slate-200">{order.paymentMethod}</strong>
                      </div>
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>Total:</span>
                        <span className="text-amber-600 dark:text-amber-400">
                          ${order.totalUsd.toFixed(2)} USD (Bs. {order.totalBs.toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTINGS & BACKUPS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Store Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Datos de la Panadería
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Nombre Comercial
                </label>
                <input
                  type="text"
                  value={settingsForm.businessName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  RIF
                </label>
                <input
                  type="text"
                  value={settingsForm.rif}
                  onChange={(e) => setSettingsForm({ ...settingsForm, rif: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  WhatsApp Oficial para Pedidos (con código de país)
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  placeholder="584162214657"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Dirección Física en Los Teques
                </label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Tasa de Cambio Manual BCV (Bs. / USD)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.bcvRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bcvRate: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                  <button
                    type="button"
                    onClick={handleSyncBcv}
                    className="px-3 py-2 rounded-xl bg-amber-600 text-white font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Sincronizar API
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                  PIN de Administrador
                </label>
                <input
                  type="text"
                  value={settingsForm.adminPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Guardar Cambios de Configuración
              </button>
            </form>
          </div>

          {/* Backup & Catalog Restoration */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Respaldos y Recuperación
            </h2>
            <p className="text-xs text-slate-500">
              Descarga o restaura copias completas del catálogo, precios y órdenes de MiPan 2025.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleExportBackup}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4 text-amber-600" />
                <span>Exportar Catálogo Completo (Descargar JSON)</span>
              </button>

              <button
                onClick={handleResetDefaults}
                className="w-full py-3 px-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-950/50 font-bold text-xs text-red-600 dark:text-red-400 flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Catálogo Predeterminado de MiPan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-200 dark:border-slate-800 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                {editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto al Catálogo'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Pan de Jamón Especial Navideño"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none font-medium"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Categoría
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Exclude<Category, 'todos'>)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                  >
                    <option value="panes">🥖 Panes</option>
                    <option value="tortas_dulces">🍰 Repostería & Tortas</option>
                    <option value="dulces_secos">🍪 Dulces Secos & Galletas</option>
                    <option value="navideno">🎄 Especial Navideño</option>
                    <option value="viveres">🥫 Víveres</option>
                    <option value="otros">📦 Otros</option>
                  </select>
                </div>

                {/* Badge Tag */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Etiqueta / Badge (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Recién Horneado, Más Vendido, Favorito"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Price in USD */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Precio en USD ($) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.05"
                      required
                      placeholder="0.00"
                      value={formPriceUsd}
                      onChange={(e) => setFormPriceUsd(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                    Equivalente: <strong>Bs. {calculatedBs}</strong> (a tasa {settings.bcvRate.toFixed(2)})
                  </p>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Cantidad en Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Descripción del Producto *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe ingredientes, textura, recomendaciones..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {/* Image Section */}
                <div className="sm:col-span-2 space-y-3">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Foto o Imagen del Producto
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    {/* Image Preview */}
                    <div className="w-24 h-24 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-dashed border-amber-300 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                      {formImage ? (
                        <img
                          src={formImage}
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                      ) : (
                        <Upload className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <Upload className="w-3.5 h-3.5" /> Subir Imagen del Dispositivo
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="O pega aquí la URL de la imagen..."
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset quick photo selector */}
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">
                      O elige una foto recomendada de panadería:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormImage(preset.url)}
                          className={`text-[10px] px-2 py-1 rounded-md border transition ${
                            formImage === preset.url
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Añadir al Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
