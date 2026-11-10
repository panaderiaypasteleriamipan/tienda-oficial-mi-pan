import React from 'react';
import { X, Printer, Send, Download, CheckCircle, Wheat } from 'lucide-react';
import { CustomerOrder, StoreSettings } from '../types';

interface InvoiceModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
  settings: StoreSettings;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  onClose,
  settings,
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSendWp = () => {
    let itemsText = '';
    order.items.forEach((item) => {
      itemsText += `▪️ ${item.quantity}x ${item.productName} = $${item.subtotalUsd.toFixed(2)}\n`;
    });

    const msg = `*COMPROBANTE DE COMPRA - MIPAN 2025* 🧾\n` +
      `Orden #${order.orderNumber}\n` +
      `Cliente: ${order.customerName}\n` +
      `Total: $${order.totalUsd.toFixed(2)} USD (Bs. ${order.totalBs.toFixed(2)})\n\n` +
      `${itemsText}\n` +
      `¡Gracias por su preferencia!`;

    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in no-print">
      <div 
        className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-amber-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden in print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Factura / Comprobante de Venta</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-xs font-bold flex items-center gap-1.5 transition text-white"
            >
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-10 space-y-6 bg-white text-slate-900">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b-2 border-slate-900">
            <div className="flex items-center gap-4">
              <img
                src="/logomipan.jpg"
                alt="Logo Panadería MiPan 2025"
                className="w-16 h-16 rounded-full object-cover border border-amber-500 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {settings.businessName}
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  RIF: <strong className="font-bold">{settings.rif}</strong>
                </p>
                <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                  {settings.address}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-amber-50 p-3 rounded-xl border border-amber-200">
              <div className="text-[11px] font-bold text-amber-900 uppercase">
                FACTURA DIGITAL
              </div>
              <div className="text-lg font-black text-slate-900">
                Nº {order.orderNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                {order.date}
              </div>
            </div>
          </div>

          {/* Customer & Delivery Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Datos del Cliente
              </span>
              <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600">Tel: {order.customerPhone}</p>
              <p className="text-slate-600">Pago: <strong className="text-slate-800">{order.paymentMethod}</strong></p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Destino y Modalidad
              </span>
              <p className="font-bold text-slate-900 text-sm">
                {order.deliveryType === 'delivery' ? '🛵 Entrega a Domicilio' : '🏪 Retiro en Sede Los Teques'}
              </p>
              <p className="text-slate-600">{order.address}</p>
              {order.notes && (
                <p className="text-slate-500 italic mt-1">Obs: {order.notes}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-2 text-center w-12">Cant.</th>
                  <th className="py-2.5 px-2">Descripción del Producto</th>
                  <th className="py-2.5 px-2 text-right w-24">Precio Unit.</th>
                  <th className="py-2.5 px-2 text-right w-24">Total USD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-2 text-center font-bold text-slate-800">{item.quantity}</td>
                    <td className="py-2.5 px-2 font-medium text-slate-900">{item.productName}</td>
                    <td className="py-2.5 px-2 text-right text-slate-600">${item.priceUsd.toFixed(2)}</td>
                    <td className="py-2.5 px-2 text-right font-bold text-slate-900">${item.subtotalUsd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="pt-4 border-t-2 border-slate-300 flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">${order.subtotalUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA ({(settings.ivaRate * 100).toFixed(0)}%):</span>
                <span className="font-semibold">${order.ivaUsd.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
                <span>TOTAL USD:</span>
                <span className="text-base text-amber-700">${order.totalUsd.toFixed(2)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex justify-between items-baseline font-black">
                <span className="text-xs">TOTAL EN BOLÍVARES:</span>
                <span className="text-sm">Bs. {order.totalBs.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-500 text-right">
                Tasa oficial BCV aplicada: Bs. {order.bcvRate.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t border-slate-200 text-center text-[11px] text-slate-500 space-y-1">
            <p className="font-medium">
              ¡Muchas gracias por su compra en Panadería MiPan 2025 C.A.!
            </p>
            <p>
              Pan artesanal recién horneado con los más altos estándares de calidad en Los Teques.
            </p>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in print) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            onClick={handleSendWp}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition"
          >
            <Send className="w-4 h-4" /> Enviar Resumen a WhatsApp
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
