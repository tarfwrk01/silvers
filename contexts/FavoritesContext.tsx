import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@silvers_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavoritesFromStorage();
  }, []);

  // Save favorites to storage whenever they change
  useEffect(() => {
    saveFavoritesToStorage();
  }, [favorites]);

  const loadFavoritesFromStorage = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesData) {
        const parsedFavorites = JSON.parse(favoritesData);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Failed to load favorites from storage:', error);
    }
  };

  const saveFavoritesToStorage = async () => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to storage:', error);
    }
  };

  const addToFavorites = (product: Product) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === product.id)) {
        return prev; // Already in favorites
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(product => product.id !== productId));
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some(product => product.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
