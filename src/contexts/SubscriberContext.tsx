import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: Date;
  source: 'popup' | 'footer' | 'checkout';
  preferences?: {
    productUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
}

interface SubscriberContextType {
  subscribers: Subscriber[];
  addSubscriber: (email: string, name?: string, source?: 'popup' | 'footer' | 'checkout') => Promise<boolean>;
  getSubscribers: () => Subscriber[];
  exportSubscribers: () => string;
  getTotalSubscribers: () => number;
}

const SubscriberContext = createContext<SubscriberContextType | undefined>(undefined);

export function SubscriberProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // Load subscribers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('emailSubscribers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSubscribers(parsed.map((s: any) => ({
          ...s,
          subscribedAt: new Date(s.subscribedAt),
        })));
      } catch (error) {
        console.error('Failed to load subscribers:', error);
      }
    }
  }, []);

  // Save subscribers to localStorage whenever they change
  useEffect(() => {
    if (subscribers.length > 0) {
      localStorage.setItem('emailSubscribers', JSON.stringify(subscribers));
    }
  }, [subscribers]);

  const addSubscriber = async (email: string, name?: string, source: 'popup' | 'footer' | 'checkout' = 'popup'): Promise<boolean> => {
    // Check if email already exists locally
    if (subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      toast.info('This email is already subscribed');
      return false;
    }

    try {
      // Send to backend database
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'Email already subscribed') {
          toast.info('This email is already subscribed');
        } else {
          throw new Error(data.error || 'Failed to subscribe');
        }
        return false;
      }

      // Also save locally for immediate feedback
      const newSubscriber: Subscriber = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        subscribedAt: new Date(),
        source,
        preferences: {
          productUpdates: true,
          promotions: true,
          newsletter: true,
        },
      };

      setSubscribers(prev => [...prev, newSubscriber]);
      return true;
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Failed to subscribe. Please try again.');
      return false;
    }
  };

  const getSubscribers = (): Subscriber[] => {
    return subscribers;
  };

  const exportSubscribers = (): string => {
    // Export as CSV format for email marketing tools
    const headers = 'Email,Name,Subscribed Date,Source\n';
    const rows = subscribers.map(s => 
      `${s.email},"${s.name || 'N/A'}",${s.subscribedAt.toISOString()},${s.source}`
    ).join('\n');
    
    return headers + rows;
  };

  const getTotalSubscribers = (): number => {
    return subscribers.length;
  };

  return (
    <SubscriberContext.Provider value={{ 
      subscribers, 
      addSubscriber, 
      getSubscribers, 
      exportSubscribers,
      getTotalSubscribers 
    }}>
      {children}
    </SubscriberContext.Provider>
  );
}

export function useSubscriber() {
  const context = useContext(SubscriberContext);
  if (!context) {
    throw new Error('useSubscriber must be used within a SubscriberProvider');
  }
  return context;
}
