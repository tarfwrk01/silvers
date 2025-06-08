export interface ProductOption {
  id: number;
  title: string;
  value: string;
  identifierType: string;
  identifierValue: string;
  group: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryId: string;
  collection?: string;
  brand: string;
  vendor?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  features: string[];
  options?: ProductOption[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// Turso database product structure
export interface TursoProduct {
  id: number;
  title: string;
  image: string;
  medias: string; // JSON array
  excerpt: string;
  notes: string;
  type: string;
  category: string;
  collection: string;
  unit: string;
  price: number;
  saleprice: number;
  vendor: string;
  brand: string;
  options: string; // JSON array
  modifiers: string; // JSON array
  metafields: string; // JSON object
  saleinfo: string;
  stores: string;
  pos: number;
  website: number;
  seo: string; // JSON object
  tags: string;
  cost: number;
  qrcode: string;
  stock: number;
  createdat: string;
  updatedat: string;
  publishat: string;
  publish: string;
  promoinfo: string;
  featured: number;
  relproducts: string; // JSON array
  sellproducts: string; // JSON array
}

// Turso API response structure
export interface TursoApiResponse {
  baton: null;
  base_url: null;
  results: Array<{
    type: string;
    response: {
      type: string;
      result: {
        cols: Array<{
          name: string;
          decltype: string;
        }>;
        rows: Array<Array<{
          type: string;
          value: string;
        }>>;
        affected_row_count: number;
        last_insert_rowid: null;
        replication_index: null;
        rows_read: number;
        rows_written: number;
        query_duration_ms: number;
      };
    };
  }>;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  parentId?: string;
  subcategories?: Category[];
}

export interface Collection {
  id: number;
  name: string;
  image: string;
  notes: string;
  parent: number | null;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedOptions?: Record<string, ProductOption>;
  addedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  image?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping';
  value: number;
  code?: string;
  minPurchase?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
}

export interface Wishlist {
  id: string;
  userId: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

// Turso database order structure
export interface TursoOrder {
  id?: number;
  referid: string;
  customerid?: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  fulfill: string;
  currency: string;
  subtotal: number;
  total: number;
  tax: number;
  discount: number;
  shipping: number;
  shipaddrs: string;
  billaddrs: string;
  createdat?: string;
  updatedat?: string;
}

export interface TursoOrderItem {
  id?: number;
  orderid: number;
  title: string;
  varianttitle: string;
  sku: string;
  qty: number;
  price: number;
  total: number;
  taxrate: number;
  taxamt: number;
}
