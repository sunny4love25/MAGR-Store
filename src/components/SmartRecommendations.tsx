import { useEffect, useState } from 'react';
import { ProductCarousel } from './ProductCarousel';
import { SectionHeader } from './SectionHeader';
import { Sparkles } from 'lucide-react';

interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  sold?: number;
}

interface SmartRecommendationsProps {
  allProducts: Product[];
  currentProduct?: Product | null;
  recentlyViewed?: Product[];
  onViewAll?: (title: string, products: Product[]) => void;
}

export function SmartRecommendations({ 
  allProducts, 
  currentProduct, 
  recentlyViewed = [],
  onViewAll 
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [personalizedProducts, setPersonalizedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate AI-powered recommendations
    generateRecommendations();
    generatePersonalizedRecommendations();
  }, [currentProduct, recentlyViewed, allProducts]);

  const generateRecommendations = () => {
    if (!allProducts.length) return;

    let recommended: Product[] = [];

    if (currentProduct) {
      // Similar products based on price range
      const priceRange = currentProduct.price * 0.3;
      recommended = allProducts.filter(p => 
        p.name !== currentProduct.name &&
        Math.abs(p.price - currentProduct.price) <= priceRange
      );
    } else if (recentlyViewed.length > 0) {
      // Based on recently viewed items
      const avgPrice = recentlyViewed.reduce((sum, p) => sum + p.price, 0) / recentlyViewed.length;
      recommended = allProducts.filter(p => 
        !recentlyViewed.find(rv => rv.name === p.name) &&
        Math.abs(p.price - avgPrice) <= avgPrice * 0.4
      );
    } else {
      // Popular items (high ratings and reviews)
      recommended = [...allProducts]
        .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
        .slice(0, 8);
    }

    // Shuffle and limit to 8 items
    setRecommendations(shuffleArray(recommended).slice(0, 8));
  };

  const generatePersonalizedRecommendations = () => {
    if (!allProducts.length) return;

    // Simulate personalization based on time of day, trending items, etc.
    const hour = new Date().getHours();
    let personalized: Product[] = [];

    if (hour >= 6 && hour < 12) {
      // Morning: Show beauty and fashion products
      personalized = allProducts.filter(p => 
        p.name.toLowerCase().includes('beauty') ||
        p.name.toLowerCase().includes('fashion') ||
        p.name.toLowerCase().includes('dress') ||
        p.name.toLowerCase().includes('perfume')
      );
    } else if (hour >= 12 && hour < 18) {
      // Afternoon: Show electronics and home items
      personalized = allProducts.filter(p => 
        p.name.toLowerCase().includes('laptop') ||
        p.name.toLowerCase().includes('phone') ||
        p.name.toLowerCase().includes('tv') ||
        p.name.toLowerCase().includes('speaker')
      );
    } else {
      // Evening: Show entertainment and relaxation items
      personalized = allProducts.filter(p => 
        p.name.toLowerCase().includes('toy') ||
        p.name.toLowerCase().includes('game') ||
        p.name.toLowerCase().includes('book') ||
        p.name.toLowerCase().includes('headphone')
      );
    }

    // If not enough personalized products, add popular items
    if (personalized.length < 8) {
      const popular = [...allProducts]
        .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        .filter(p => !personalized.find(pp => pp.name === p.name));
      personalized = [...personalized, ...popular];
    }

    setPersonalizedProducts(shuffleArray(personalized).slice(0, 8));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  if (recommendations.length === 0 && personalizedProducts.length === 0) {
    return null;
  }

  return (
    <>
      {/* Personalized Recommendations */}
      {personalizedProducts.length > 0 && (
        <section className="mt-6 md:mt-12">
          <SectionHeader
            icon={<Sparkles className="w-5 h-5 text-white" />}
            title="Picked Just for You"
            subtitle="AI-powered personalized recommendations based on your preferences"
            action={
              onViewAll && (
                <button 
                  onClick={() => onViewAll('Personalized for You', personalizedProducts)}
                  className="text-sm text-orange-500 hover:underline"
                >
                  View All →
                </button>
              )
            }
          />
          <ProductCarousel products={personalizedProducts} />
        </section>
      )}

      {/* Similar Products / You May Also Like */}
      {recommendations.length > 0 && (
        <section className="mt-6 md:mt-12">
          <SectionHeader
            title={currentProduct ? "You May Also Like" : "Recommended for You"}
            subtitle={currentProduct 
              ? "Products similar to what you're viewing" 
              : "Based on popular trends and your browsing history"
            }
            action={
              onViewAll && (
                <button 
                  onClick={() => onViewAll('Recommended Products', recommendations)}
                  className="text-sm text-orange-500 hover:underline"
                >
                  View All →
                </button>
              )
            }
          />
          <ProductCarousel products={recommendations} />
        </section>
      )}
    </>
  );
}
