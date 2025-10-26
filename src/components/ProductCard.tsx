import { Heart, Star, Eye, Scale, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCurrency } from '../contexts/CurrencyContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';
import { useState, memo } from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  sold?: number;
  onQuickView?: () => void;
}

export const ProductCard = memo(function ProductCard({
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  badge,
  sold,
  onQuickView,
}: ProductCardProps) {
  const { convertPrice, getCurrencySymbol } = useCurrency();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const displayPrice = convertPrice(price);
  const displayOriginalPrice = originalPrice ? convertPrice(originalPrice) : null;
  const symbol = getCurrencySymbol();
  const productId = `${name}-${price}`.replace(/\s+/g, '-').toLowerCase();
  const inWishlist = isInWishlist(productId);
  const inCompare = isInCompare(productId);

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-white">
        <img src={image} alt={name} className="w-full h-full object-contain p-2" loading="lazy" />
        
        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2 transition-opacity">
            <Button
              size="sm"
              variant="secondary"
              onClick={onQuickView}
              className="bg-white hover:bg-gray-100"
            >
              <Eye className="w-4 h-4 mr-1" />
              Quick View
            </Button>
          </div>
        )}
        
        {/* Badge */}
        {badge && (
          <Badge className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-500 text-white text-xs">
            {badge}
          </Badge>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-1 right-1 md:top-2 md:right-2 flex flex-col gap-1 md:gap-2 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToWishlist({ name, price, image, id: productId });
            }}
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
              inWishlist ? 'bg-red-500 scale-110' : 'bg-white hover:bg-red-50 hover:scale-105'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3 h-3 md:w-4 md:h-4 transition-all ${inWishlist ? 'fill-white text-white' : 'text-red-500'}`} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCompare({ name, price, image, rating, id: productId });
            }}
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
              inCompare ? 'bg-blue-500 scale-110' : 'bg-white hover:bg-blue-50 hover:scale-105'
            }`}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            <Scale className={`w-3 h-3 md:w-4 md:h-4 transition-all ${inCompare ? 'text-white' : 'text-blue-500'}`} />
          </button>
        </div>

        {/* Sold Badge */}
        {sold && (
          <Badge className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-blue-500 text-white text-xs">
            Sold {sold}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-2 md:p-3">
        <h3 className="text-xs md:text-sm mb-1 md:mb-2 line-clamp-2">{name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-1 md:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-2 h-2 md:w-3 md:h-3 ${
                i < Math.floor(rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-[10px] md:text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3">
          <span className="text-sm md:text-base text-orange-500">{symbol}{displayPrice.toFixed(2)}</span>
          {displayOriginalPrice && (
            <span className="text-[10px] md:text-xs text-gray-400 line-through">
              {symbol}{displayOriginalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          onClick={() => addToCart({ name, price, image, id: productId })}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white group h-8 md:h-10 text-xs md:text-sm"
        >
          <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 group-hover:scale-110 transition-transform" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
});
