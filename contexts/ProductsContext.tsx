import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product } from '../types';
import { tursoApi } from '../services/tursoApi';

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

interface ProductsContextType extends ProductsState {
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  getProductById: (id: string) => Product | null;
  refreshProducts: () => Promise<void>;
}

type ProductsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_FEATURED_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_PRODUCTS_SUCCESS':
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      };
    case 'FETCH_FEATURED_SUCCESS':
      return {
        ...state,
        featuredProducts: action.payload,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, {
    products: [],
    featuredProducts: [],
    loading: false,
    error: null,
    lastFetch: null,
  });

  const shouldRefetch = () => {
    if (!state.lastFetch) return true;
    return Date.now() - state.lastFetch > CACHE_DURATION;
  };

  const fetchProducts = async () => {
    if (state.loading) return;
    
    try {
      dispatch({ type: 'FETCH_START' });
      const products = await tursoApi.fetchProducts();
      dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  };

  const fetchFeaturedProducts = async () => {
    if (state.loading) return;
    
    try {
      dispatch({ type: 'FETCH_START' });
      const featuredProducts = await tursoApi.fetchFeaturedProducts();
      dispatch({ type: 'FETCH_FEATURED_SUCCESS', payload: featuredProducts });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch featured products';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  };

  const getProductById = (id: string): Product | null => {
    return state.products.find(product => product.id === id) || null;
  };

  const refreshProducts = async () => {
    await Promise.all([
      fetchProducts(),
      fetchFeaturedProducts(),
    ]);
  };

  // Auto-fetch on mount and when cache expires
  useEffect(() => {
    if (shouldRefetch()) {
      refreshProducts();
    }
  }, []);

  const value: ProductsContextType = {
    ...state,
    fetchProducts,
    fetchFeaturedProducts,
    getProductById,
    refreshProducts,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}

// Hook for individual product fetching (when not in cache)
export function useProduct(id: string) {
  const { getProductById } = useProducts();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const cachedProduct = getProductById(id);
    if (cachedProduct) {
      setProduct(cachedProduct);
      return;
    }

    // Fetch individual product if not in cache
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedProduct = await tursoApi.fetchProductById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  return { product, loading, error };
}
