export type Category = 
  | 'todos'
  | 'panes'
  | 'tortas_dulces'
  | 'dulces_secos'
  | 'navideno'
  | 'viveres'
  | 'otros';

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, 'todos'>;
  priceUsd: number;
  stock: number;
  image: string;
  desc: string;
  badge?: string;
  isAvailable?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreSettings {
  businessName: string;
  rif: string;
  whatsappNumber: string;
  address: string;
  openingHours: string;
  bcvRate: number;
  bcvLastUpdated: string;
  ivaRate: number; // e.g. 0.16
  adminPin: string;
  seasonTheme: 'classic' | 'navidad';
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  paymentMethod: string;
  notes?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    priceUsd: number;
    subtotalUsd: number;
  }[];
  subtotalUsd: number;
  ivaUsd: number;
  totalUsd: number;
  totalBs: number;
  bcvRate: number;
  status: 'pendiente' | 'en_preparacion' | 'completado' | 'cancelado';
}

export interface Review {
  id: string;
  author: string;
  city: string;
  comment: string;
  rating: number;
  date: string;
}
