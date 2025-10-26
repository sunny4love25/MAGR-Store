import { createContext, useContext, useState, ReactNode } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'NGN';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number) => number;
  getCurrencySymbol: () => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (base: USD)
const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1580,
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('NGN');

  const convertPrice = (price: number): number => {
    return price * exchangeRates[currency];
  };

  const getCurrencySymbol = (): string => {
    return currencySymbols[currency];
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, getCurrencySymbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
