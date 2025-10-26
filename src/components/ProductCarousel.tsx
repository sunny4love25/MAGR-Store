import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';

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

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product & { id: string } | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollPosition =
        direction === 'left'
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleQuickView = (product: Product) => {
    const productId = `${product.name}-${product.price}`.replace(/\s+/g, '-').toLowerCase();
    setSelectedProduct({ ...product, id: productId });
    setQuickViewOpen(true);
  };

  return (
    <div className="relative group">
      {/* Left Arrow - Hidden on small screens */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center opacity-80 hover:opacity-100 transition-all hover:scale-110 border-2 border-gray-200"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-7 h-7 text-gray-900" />
      </button>

      {/* Products Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, index) => (
          <div key={`${product.name}-${product.price}-${index}`} className="flex-none w-[160px] md:w-[280px]">
            <ProductCard
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviews={product.reviews}
              image={product.image}
              badge={product.badge}
              sold={product.sold}
              onQuickView={() => handleQuickView(product)}
            />
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
        product={selectedProduct}
      />

      {/* Right Arrow - Hidden on small screens */}
      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-xl items-center justify-center opacity-80 hover:opacity-100 transition-all hover:scale-110 border-2 border-gray-200"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-7 h-7 text-gray-900" />
      </button>
    </div>
  );
}
