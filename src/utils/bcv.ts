/**
 * Service to fetch official Banco Central de Venezuela (BCV) exchange rate.
 * Uses public endpoints with resilient fallbacks.
 */

export interface BcvResponse {
  rate: number;
  lastUpdated: string;
  source: string;
  success: boolean;
}

export const fetchOfficialBcvRate = async (fallbackRate = 58.50): Promise<BcvResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  // Attempt 1: DolarAPI Venezuela (Official BCV)
  try {
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      signal: controller.signal,
    });
    if (res.ok) {
      const data = await res.json();
      const rate = typeof data.promedio === 'number' ? data.promedio : parseFloat(data.promedio);
      if (!isNaN(rate) && rate > 0) {
        clearTimeout(timeoutId);
        return {
          rate: Math.round(rate * 100) / 100,
          lastUpdated: data.fechaActualizacion || new Date().toISOString(),
          source: 'BCV Oficial (DolarAPI)',
          success: true,
        };
      }
    }
  } catch (err) {
    console.warn('DolarAPI fetch failed, trying secondary mirror...', err);
  }

  // Attempt 2: PyDolarVenezuela API
  try {
    const res = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv', {
      signal: controller.signal,
    });
    if (res.ok) {
      const data = await res.json();
      const rate = data?.monitors?.usd?.price;
      if (typeof rate === 'number' && rate > 0) {
        clearTimeout(timeoutId);
        return {
          rate: Math.round(rate * 100) / 100,
          lastUpdated: new Date().toISOString(),
          source: 'BCV Oficial (PyDolar)',
          success: true,
        };
      }
    }
  } catch (err) {
    console.warn('PyDolarVenezuela fetch failed', err);
  } finally {
    clearTimeout(timeoutId);
  }

  // Fallback to configured rate
  return {
    rate: fallbackRate,
    lastUpdated: new Date().toISOString(),
    source: 'Tasa Referencial Guardada',
    success: false,
  };
};
