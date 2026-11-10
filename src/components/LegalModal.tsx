import React from 'react';
import { X, ShieldCheck, Cookie, FileText, CheckCircle, Wheat } from 'lucide-react';
import { StoreSettings } from '../types';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  defaultSection?: 'cookies' | 'terms' | 'privacy';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  settings,
  defaultSection = 'cookies',
}) => {
  const [activeSection, setActiveSection] = React.useState<'cookies' | 'terms' | 'privacy'>(defaultSection);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200 dark:border-slate-800 overflow-hidden my-6 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white leading-tight">
                Información Legal & Privacidad
              </h3>
              <p className="text-xs text-slate-500">
                {settings.businessName} • RIF: {settings.rif}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 gap-2 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveSection('cookies')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeSection === 'cookies'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Cookie className="w-4 h-4" />
            <span>Política de Cookies</span>
          </button>

          <button
            onClick={() => setActiveSection('privacy')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeSection === 'privacy'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Privacidad de Datos</span>
          </button>

          <button
            onClick={() => setActiveSection('terms')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition ${
              activeSection === 'terms'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Términos del Servicio</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {activeSection === 'cookies' && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                🍪 Política de Cookies y Almacenamiento Local
              </h4>
              <p>
                En <strong>{settings.businessName}</strong>, valoramos tu privacidad y la transparencia total. Esta aplicación web no utiliza cookies de rastreo publicitario de terceros ni vende tus datos.
              </p>

              <div className="space-y-2 pt-2">
                <h5 className="font-bold text-slate-900 dark:text-white">¿Qué datos almacenamos en tu navegador?</h5>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Carrito de Compras (`mipan_cart`):</strong> Guarda los panes y productos que seleccionas para que no los pierdas si recargas la página.
                  </li>
                  <li>
                    <strong>Preferencias de Visualización (`mipan_theme`, `mipan_settings`):</strong> Recuerda si activaste el modo oscuro o el tema navideño para brindarte una mejor experiencia.
                  </li>
                  <li>
                    <strong>Tasa BCV en Caché:</strong> Guarda la última tasa oficial consultada del Banco Central de Venezuela para que puedas consultar precios incluso si tu conexión es inestable.
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                Puedes limpiar estos datos en cualquier momento borrando el almacenamiento local o cookies de tu navegador.
              </p>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                🔒 Política de Privacidad
              </h4>
              <p>
                La información que ingresas al realizar un pedido (nombre, teléfono y dirección de entrega):
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Se utiliza <strong>únicamente para procesar tu orden de compra</strong> y coordinar el despacho directo en Los Teques o Altos Mirandinos.</li>
                <li>Los pedidos se envían directamente a través de WhatsApp cifrado de extremo a extremo al canal oficial de la panadería.</li>
                <li>No compartimos tu información con empresas de mercadeo externo ni spammers.</li>
              </ul>
              <p>
                Para cualquier consulta sobre tus datos o pedidos, puedes contactarnos directamente al teléfono: <strong>+58 {settings.whatsappNumber.slice(2)}</strong>.
              </p>
            </div>
          )}

          {activeSection === 'terms' && (
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                📜 Términos y Condiciones del Servicio
              </h4>
              <div className="space-y-2">
                <p>
                  1. <strong>Precios y Tasas:</strong> Todos los precios mostrados en Bolívares (Bs.) se calculan tomando como referencia la tasa oficial publicada por el Banco Central de Venezuela (BCV) del día.
                </p>
                <p>
                  2. <strong>Horario de Atención:</strong> Nuestro horario de horneado y despacho es de {settings.openingHours}. Pedidos recibidos fuera de este horario se procesarán a primera hora de la mañana siguiente.
                </p>
                <p>
                  3. <strong>Garantía de Frescura:</strong> Todos nuestros productos se hornean el mismo día con ingredientes de primera categoría. En caso de cualquier duda al recibir tu pedido, contáctanos inmediatamente vía WhatsApp con tu número de orden.
                </p>
                <p>
                  4. <strong>Ubicación:</strong> Sede principal ubicada en {settings.address}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Entendido y Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
