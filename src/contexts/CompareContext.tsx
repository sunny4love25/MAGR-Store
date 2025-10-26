import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

interface CompareItem {
  name: string;
  price: number;
  image: string;
  rating: number;
  id: string;
}

interface CompareContextType {
  compareList: CompareItem[];
  addToCompare: (item: CompareItem) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);

  const addToCompare = (item: CompareItem) => {
    if (compareList.length >= 4) {
      toast.error('You can only compare up to 4 products');
      return;
    }
    setCompareList((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        toast.info('Already in comparison');
        return prev;
      }
      toast.success('Added to comparison');
      return [...prev, item];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (id: string) => {
    return compareList.some((item) => item.id === id);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
