import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { OrderItem } from '@/types';

interface CartContextType {
  items: OrderItem[];
  addItem: (item: Omit<OrderItem, 'quantity' | 'subtotal'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart_items';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>(() => {
    // Cargar del localStorage al iniciar
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<OrderItem, 'quantity' | 'subtotal'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.productId === item.productId);

      if (existingItem) {
        // Si ya existe, incrementar cantidad
        return currentItems.map(i =>
          i.productId === item.productId
            ? {
                ...i,
                quantity: i.quantity + 1,
                subtotal: (i.quantity + 1) * i.price
              }
            : i
        );
      }

      // Si no existe, agregar nuevo
      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
          subtotal: item.price,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems(currentItems => currentItems.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.price
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}