import React from 'react';
import { ShoppingCart, Eye, AlertCircle, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  bcvRate: number;
  onAddToCart: (product: Product, quantity?: number) => void;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  bcvRate,
  onAddToCart,
  onOpenDetail,
}) => {
  const [isAddedRecently, setIsAddedRecently] = React.useState(false);
  const priceBs = (product.priceUsd * bcvRate).toFixed(2);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'panes': return '🥖 Panes';
      case 'tortas_dulces': return '🍰 Repostería';
      case 'dulces_secos': return '🍪 Dulces Secos';
      case 'navideno': return '🎄 Navideño';
      case 'viveres': return '🥫 Víveres';
      default: return '📦 Otros';
    }
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-amber-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-amber-400 dark:hover:border-amber-600/50 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-amber-50/50 dark:bg-slate-800/50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
          }}
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-md">
            {product.badge}
          </span>
        )}

        {/* Category Pill */}
        <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white">
          {getCategoryLabel(product.category)}
        </span>

        {/* Quick View Floating Hint */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 p-2 rounded-full shadow-md">
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* Product Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.desc}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between gap-2">
          {/* Prices */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400">
                ${product.priceUsd.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">USD</span>
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Bs. {priceBs}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : isAddedRecently
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
            }`}
          >
            {isOutOfStock ? (
              <span>Agotado</span>
            ) : isAddedRecently ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>

        {/* Stock status indicator */}
        <div className="mt-2 text-[11px] flex items-center justify-between text-slate-400">
          {isOutOfStock ? (
            <span className="text-red-500 font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Agotado temporalmente
            </span>
          ) : isLowStock ? (
            <span className="text-orange-500 font-bold">
              ¡Últimas {product.stock} unidades!
            </span>
          ) : (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Disponibles: {product.stock}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
