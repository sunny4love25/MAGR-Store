import { createContext, useContext, useState, ReactNode } from 'react';

interface InfoBannerContent {
  title: string;
  description: string;
}

interface InfoBannerContextType {
  bannerMessages: InfoBannerContent[];
  updateBannerMessages: (messages: InfoBannerContent[]) => void;
  addBannerMessage: (message: InfoBannerContent) => void;
  updateBannerMessage: (index: number, message: InfoBannerContent) => void;
  deleteBannerMessage: (index: number) => void;
}

const InfoBannerContext = createContext<InfoBannerContextType | undefined>(undefined);

export function InfoBannerProvider({ children }: { children: ReactNode }) {
  const [bannerMessages, setBannerMessages] = useState<InfoBannerContent[]>([
    {
      title: 'Hot Deals & Trending Collections',
      description: 'Discover the latest arrivals, exclusive offers, and must-have picks that define smart shopping at MAGR Store.'
    },
    {
      title: 'Digital Trends & Storefront Insights',
      description: 'Explore innovation, creativity, and technology redefining how we shop, connect, and experience the MAGR Store world.'
    },
    {
      title: 'Join Our Growing Team',
      description: 'We\'re hiring passionate individuals to help shape the future of online shopping. Check out our career opportunities today!'
    },
    {
      title: 'Latest Stories & Market Highlights',
      description: 'Stay ahead with trending updates, insightful features, and innovations shaping the MAGR Store experience. Please note that due to exchange rate fluctuations, actual product prices may vary — confirm the final price before purchase.'
    }
  ]);

  const updateBannerMessages = (messages: InfoBannerContent[]) => {
    setBannerMessages(messages);
  };

  const addBannerMessage = (message: InfoBannerContent) => {
    setBannerMessages([...bannerMessages, message]);
  };

  const updateBannerMessage = (index: number, message: InfoBannerContent) => {
    const updated = [...bannerMessages];
    updated[index] = message;
    setBannerMessages(updated);
  };

  const deleteBannerMessage = (index: number) => {
    setBannerMessages(bannerMessages.filter((_, i) => i !== index));
  };

  return (
    <InfoBannerContext.Provider value={{ 
      bannerMessages, 
      updateBannerMessages,
      addBannerMessage,
      updateBannerMessage,
      deleteBannerMessage
    }}>
      {children}
    </InfoBannerContext.Provider>
  );
}

export function useInfoBanner() {
  const context = useContext(InfoBannerContext);
  if (!context) {
    throw new Error('useInfoBanner must be used within an InfoBannerProvider');
  }
  return context;
}
