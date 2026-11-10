import React, { useState } from 'react';
import { X, ShoppingCart, MessageCircle, Plus, Minus, Check, ShieldCheck, Heart } from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  bcvRate: number;
  onAddToCart: (product: Product, quantity: number) => void;
  settings: StoreSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  bcvRate,
  onAddToCart,
  settings,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const priceBs = (product.priceUsd * bcvRate).toFixed(2);
  const subtotalUsd = (product.priceUsd * quantity).toFixed(2);
  const subtotalBs = (product.priceUsd * quantity * bcvRate).toFixed(2);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  const whatsappInquiryUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Hola Panadería MiPan 2025, quisiera consultar sobre el producto: *${product.name}* ($${product.priceUsd.toFixed(2)} / Bs. ${priceBs}). ¿Tienen disponibilidad en este momento?`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-200/60 dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Section */}
        <div className="md:w-1/2 relative bg-amber-50/50 dark:bg-slate-800/50 min-h-[260px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {product.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-600 text-white shadow-lg">
              {product.badge}
            </span>
          )}
        </div>

        {/* Right Info Section */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {product.category.replace('_', ' ')}
              </span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {product.name}
              </h2>
            </div>

            {/* Price Box */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800/60 border border-amber-200/50 dark:border-slate-700">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  ${product.priceUsd.toFixed(2)} <span className="text-xs text-slate-500 font-normal">USD</span>
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Bs. {priceBs}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Tasa BCV del día: Bs. {bcvRate.toFixed(2)} por dólar.
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Descripción & Detalles
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.desc}
              </p>
            </div>

            {/* Stock information */}
            <div className="flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-600 dark:text-slate-300">
                {isOutOfStock ? (
                  <strong className="text-red-500">Agotado por el día de hoy</strong>
                ) : (
                  <>Disponibilidad: <strong className="text-emerald-600">{product.stock} unidades</strong> en inventario</>
                )}
              </span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Cantidad a pedir:
                </span>
                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                isOutOfStock
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-98'
              }`}
            >
              {isOutOfStock ? (
                <span>No disponible actualmente</span>
              ) : isAdded ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>¡Añadido al Carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Añadir al Carrito (${subtotalUsd} / Bs. {subtotalBs})</span>
                </>
              )}
            </button>

            {/* WhatsApp Direct Inquiry */}
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Consultar por WhatsApp con un encargado</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
