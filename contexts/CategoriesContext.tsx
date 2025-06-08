import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { tursoApi } from '../services/tursoApi';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at?: string;
}

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

interface CategoriesContextType extends CategoriesState {
  fetchCategories: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

type CategoriesAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Category[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function categoriesReducer(state: CategoriesState, action: CategoriesAction): CategoriesState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        categories: action.payload,
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

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(categoriesReducer, {
    categories: [],
    loading: false,
    error: null,
    lastFetch: null,
  });

  const shouldRefetch = () => {
    if (!state.lastFetch) return true;
    return Date.now() - state.lastFetch > CACHE_DURATION;
  };

  const fetchCategories = async () => {
    if (state.loading) return;
    
    try {
      dispatch({ type: 'FETCH_START' });
      const categories = await tursoApi.fetchCategories();
      dispatch({ type: 'FETCH_SUCCESS', payload: categories });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  // Auto-fetch categories on mount if needed
  useEffect(() => {
    if (shouldRefetch()) {
      fetchCategories();
    }
  }, []);

  const value: CategoriesContextType = {
    ...state,
    fetchCategories,
    refreshCategories,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}
