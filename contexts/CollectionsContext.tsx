import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Collection } from '../types';
import { tursoApi } from '../services/tursoApi';

interface CollectionsState {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

interface CollectionsContextType extends CollectionsState {
  fetchCollections: () => Promise<void>;
  refreshCollections: () => Promise<void>;
}

type CollectionsAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Collection[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined);

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function collectionsReducer(state: CollectionsState, action: CollectionsAction): CollectionsState {
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
        collections: action.payload,
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

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(collectionsReducer, {
    collections: [],
    loading: false,
    error: null,
    lastFetch: null,
  });

  const shouldRefetch = () => {
    if (!state.lastFetch) return true;
    return Date.now() - state.lastFetch > CACHE_DURATION;
  };

  const fetchCollections = async () => {
    if (state.loading) return;
    
    try {
      dispatch({ type: 'FETCH_START' });
      const collections = await tursoApi.fetchCollections();
      dispatch({ type: 'FETCH_SUCCESS', payload: collections });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch collections';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  };

  const refreshCollections = async () => {
    await fetchCollections();
  };

  // Auto-fetch collections on mount if needed
  useEffect(() => {
    if (shouldRefetch()) {
      fetchCollections();
    }
  }, []);

  const value: CollectionsContextType = {
    ...state,
    fetchCollections,
    refreshCollections,
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);
  if (context === undefined) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}
