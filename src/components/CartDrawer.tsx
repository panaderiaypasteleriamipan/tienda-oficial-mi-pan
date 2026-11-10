import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Send, 
  FileText, 
  Truck, 
  Store, 
  CreditCard, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CustomerOrder, StoreSettings } from '../types';
import { saveStoredOrder } from '../utils/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  settings: StoreSettings;
  onOpenInvoice: (order: CustomerOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  onOpenInvoice,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pago Móvil');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Totals calculations
  const subtotalUsd = cartItems.reduce(
    (sum, item) => sum + item.product.priceUsd * item.quantity,
    0
  );
  const ivaUsd = subtotalUsd * settings.ivaRate;
  const totalUsd = subtotalUsd + ivaUsd;
  const totalBs = totalUsd * settings.bcvRate;

  const handleCheckout = (action: 'whatsapp' | 'invoice') => {
    setFormError('');

    if (cartItems.length === 0) {
      setFormError('Tu carrito está vacío. Agrega productos antes de procesar.');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Por favor indica tu nombre completo.');
      return;
    }

    if (!customerPhone.trim()) {
      setFormError('Por favor indica tu número de teléfono / WhatsApp.');
      return;
    }

    if (deliveryType === 'delivery' && !address.trim()) {
      setFormError('Por favor ingresa la dirección de entrega para el delivery.');
      return;
    }

    setIsSubmitting(true);

    const orderNumber = Math.floor(10000 + Math.random() * 90000).toString();
    const newOrder: CustomerOrder = {
      id: `order-${Date.now()}`,
      orderNumber,
      date: new Date().toLocaleString('es-VE'),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryType,
      address: deliveryType === 'delivery' ? address.trim() : 'Retiro en Sede Los Teques',
      paymentMethod,
      notes: notes.trim() || undefined,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        priceUsd: item.product.priceUsd,
        subtotalUsd: item.product.priceUsd * item.quantity,
      })),
      subtotalUsd,
      ivaUsd,
      totalUsd,
      totalBs,
      bcvRate: settings.bcvRate,
      status: 'pendiente',
    };

    // Save order in admin history
    saveStoredOrder(newOrder);

    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignored if canvas not ready
    }

    // Build WhatsApp message
    let itemsListText = '';
    cartItems.forEach((item) => {
      const lineTotal = (item.product.priceUsd * item.quantity).toFixed(2);
      itemsListText += `▪️ ${item.quantity}x ${item.product.name} ($${item.product.priceUsd.toFixed(2)}) = *$${lineTotal}*\n`;
    });

    const waText = 
`🥖 *${settings.businessName.toUpperCase()}* 🧾
*NUEVA ORDEN #${orderNumber}*
📅 Fecha: ${newOrder.date}

👤 *CLIENTE:* ${newOrder.customerName}
📞 *TELÉFONO:* ${newOrder.customerPhone}
🚚 *MODALIDAD:* ${deliveryType === 'delivery' ? 'Delivery a Domicilio' : 'Retiro en Tienda (C.C. Los Teques)'}
${deliveryType === 'delivery' ? `📍 *DIRECCIÓN:* ${newOrder.address}\n` : ''}💳 *MÉTODO DE PAGO:* ${paymentMethod}
${newOrder.notes ? `📝 *NOTAS:* ${newOrder.notes}\n` : ''}
🛒 *DETALLE DEL PEDIDO:*
${itemsListText}
───────────────────────
💵 *Subtotal:* $${subtotalUsd.toFixed(2)}
📑 *IVA (16%):* $${ivaUsd.toFixed(2)}
💰 *TOTAL ORDEN:* *$${totalUsd.toFixed(2)} USD*
🇻🇪 *TOTAL EN BOLÍVARES:* *Bs. ${totalBs.toFixed(2)}*
(Tasa oficial BCV: Bs. ${settings.bcvRate.toFixed(2)})

_Orden confirmada a través de la Tienda Virtual MiPan 2025._`;

    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waText)}`;

    if (action === 'whatsapp') {
      window.open(waUrl, '_blank');
      onClearCart();
      setIsSubmitting(false);
      onClose();
    } else {
      // View invoice
      onOpenInvoice(newOrder);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-amber-200/50 dark:border-slate-800 animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white leading-tight">
                Tu Carrito de Pedido
              </h2>
              <p className="text-xs text-slate-500">
                {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} seleccionado(s)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-700 dark:text-slate-300">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explora nuestro catálogo y agrega tus panes artesanales y postres favoritos.
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Productos ({cartItems.length})</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Vaciar
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                  {cartItems.map((item) => {
                    const itemTotalUsd = item.product.priceUsd * item.quantity;
                    const itemTotalBs = itemTotalUsd * settings.bcvRate;

                    return (
                      <div key={item.product.id} className="p-3 sm:p-4 flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover border border-amber-200/50 dark:border-slate-700 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80';
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-xs font-black text-amber-600 dark:text-amber-400">
                            ${item.product.priceUsd.toFixed(2)} USD
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Total: ${itemTotalUsd.toFixed(2)} / Bs. {itemTotalBs.toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex flex-col items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-amber-600 hover:text-white transition shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-2xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Breakdown Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotalUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>IVA ({(settings.ivaRate * 100).toFixed(0)}%):</span>
                  <span className="font-semibold">${ivaUsd.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-amber-200 dark:border-slate-700 flex justify-between items-baseline text-slate-900 dark:text-white">
                  <span className="font-bold text-sm">TOTAL USD:</span>
                  <span className="font-black text-lg text-amber-600 dark:text-amber-400">
                    ${totalUsd.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-slate-900 dark:text-white pt-1">
                  <span className="font-bold text-xs">TOTAL EN BOLÍVARES:</span>
                  <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                    Bs. {totalBs.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 text-right">
                  Calculado a Tasa Oficial BCV: Bs. {settings.bcvRate.toFixed(2)}
                </p>
              </div>

              {/* Checkout Form */}
              <div className="space-y-4 pt-2">
                <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Datos de Envío y Contacto
                </h3>

                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. María Pérez"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 0414-1234567 o +58416..."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Delivery Mode Choice */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Modalidad de Entrega
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                          deliveryType === 'delivery'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>Delivery</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                          deliveryType === 'pickup'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Store className="w-4 h-4" />
                        <span>Retiro en Tienda</span>
                      </button>
                    </div>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Dirección exacta de Delivery en Los Teques / Alrededores *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ej. Urb. Los Nuevos Teques, Edif. Araguaney, Apto 4B. Punto de referencia: cerca de la panadería."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Forma de Pago Preferida
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="Pago Móvil">📱 Pago Móvil (Bs. Tasa Oficial)</option>
                      <option value="Zelle">💳 Zelle ($ USD)</option>
                      <option value="Efectivo Divisas">💵 Efectivo Divisas ($ USD)</option>
                      <option value="Efectivo Bolívares">🇻🇪 Efectivo Bolívares (Bs.)</option>
                      <option value="Punto de Venta">💳 Punto de Venta (en tienda / al recibir)</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Observaciones / Notas Especiales (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Por favor pan bien dorado / avisar al llegar al portón"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2.5">
            {/* Primary WhatsApp Action */}
            <button
              onClick={() => handleCheckout('whatsapp')}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Send className="w-5 h-5" />
              <span>Enviar Pedido a WhatsApp (${totalUsd.toFixed(2)})</span>
            </button>

            {/* Secondary Invoice Action */}
            <button
              onClick={() => handleCheckout('invoice')}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 transition text-xs"
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Generar Factura / Comprobante Digital</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
