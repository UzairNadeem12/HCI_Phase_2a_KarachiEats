import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserGroup = 'student' | 'senior' | 'lowLiteracy' | 'disability' | null;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  image?: string;
  deliveryFee?: number;
}

export interface UserInfo {
  email: string;
  name: string;
  phone: string;
  locations: string[];
}

export interface AppSettings {
  language: 'en' | 'ur';
  largeText: boolean;
}

interface AppContextType {
  userGroup: UserGroup;
  setUserGroup: (group: UserGroup) => void;
  location: string;
  setLocation: (location: string) => void;
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userGroup, setUserGroup] = useState<UserGroup>(null);
  const [location, setLocation] = useState<string>('Karachi, Pakistan');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    language: 'en',
    largeText: false,
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AppContext.Provider value={{
      userGroup,
      setUserGroup,
      location,
      setLocation,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      settings,
      updateSettings,
      userInfo,
      setUserInfo,
      isLoggedIn,
      setIsLoggedIn,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
