import React, { createContext, useContext, useState } from 'react';
import { tursoApi } from '../services/tursoApi';
import { useCart } from './CartContext';

interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface CheckoutState {
  isLoading: boolean;
  error: string | null;
  orderReference: string | null;
}

interface CheckoutContextType extends CheckoutState {
  placeOrder: (customerInfo: CustomerInfo) => Promise<boolean>;
  clearCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CheckoutState>({
    isLoading: false,
    error: null,
    orderReference: null,
  });

  const { items, clearCart } = useCart();

  const placeOrder = async (customerInfo: CustomerInfo): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Validate customer info
      if (!customerInfo.name || !customerInfo.email) {
        throw new Error('Name and email are required');
      }

      // Place order through API
      const orderReference = await tursoApi.placeOrder(items, customerInfo);

      if (!orderReference) {
        throw new Error('Failed to create order');
      }

      // Clear cart after successful order
      clearCart();

      setState(prev => ({
        ...prev,
        isLoading: false,
        orderReference,
        error: null,
      }));

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  };

  const clearCheckout = () => {
    setState({
      isLoading: false,
      error: null,
      orderReference: null,
    });
  };

  const value: CheckoutContextType = {
    ...state,
    placeOrder,
    clearCheckout,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
