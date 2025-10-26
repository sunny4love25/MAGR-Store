import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Star, Heart, ShoppingCart, Scale, Minus, Plus } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';

interface QuickViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    badge?: string;
    id: string;
    category?: string;
    sizes?: string[];
    colors?: string[];
  } | null;
}

export function QuickViewModal({ open, onOpenChange, product }: QuickViewModalProps) {
  const { convertPrice, getCurrencySymbol } = useCurrency();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Reset selections when product changes
  useEffect(() => {
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const symbol = getCurrencySymbol();
  const displayPrice = convertPrice(product.price);
  const displayOriginalPrice = product.originalPrice ? convertPrice(product.originalPrice) : null;

  // Determine available sizes and colors based on product category
  const getProductOptions = () => {
    if (!product.category && !product.sizes && !product.colors) {
      // Auto-detect from product name
      const productName = product.name.toLowerCase();
      
      // Clothing items
      if (productName.includes('shirt') || productName.includes('dress') || 
          productName.includes('hoodie') || productName.includes('jacket') || 
          productName.includes('blazer') || productName.includes('coat') ||
          productName.includes('polo') || productName.includes('pants') ||
          productName.includes('jeans')) {
        return {
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue']
        };
      }
      
      // Shoes
      if (productName.includes('shoe') || productName.includes('sneaker') || 
          productName.includes('boot') || productName.includes('sandal')) {
        return {
          sizes: ['7', '8', '9', '10', '11', '12'],
          colors: ['Black', 'White', 'Brown', 'Gray', 'Blue']
        };
      }

      // Electronics with color options
      if (productName.includes('phone') || productName.includes('tablet') || 
          productName.includes('watch') || productName.includes('headphone') ||
          productName.includes('earbuds')) {
        return {
          sizes: [],
          colors: ['Black', 'White', 'Silver', 'Gold', 'Blue']
        };
      }

      // Perfumes - size variations
      if (productName.includes('perfume') || productName.includes('cologne') || 
          productName.includes('fragrance')) {
        return {
          sizes: ['30ml', '50ml', '100ml', '150ml'],
          colors: []
        };
      }

      return { sizes: [], colors: [] };
    }

    return {
      sizes: product.sizes || [],
      colors: product.colors || []
    };
  };

  const options = getProductOptions();
  const availableSizes = options.sizes;
  const availableColors = options.colors;

  const handleAddToCart = () => {
    const cartItem: any = {
      name: product.name,
      price: product.price,
      image: product.image,
      id: product.id,
      quantity
    };

    if (selectedSize) cartItem.size = selectedSize;
    if (selectedColor) cartItem.color = selectedColor;

    // Add items based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({ ...cartItem, quantity: 1 });
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick View</DialogTitle>
          <DialogDescription>
            View product details and add to cart
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h3 className="text-xl mb-2">{product.name}</h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl text-orange-500">
                  {symbol}{displayPrice.toFixed(2)}
                </span>
                {displayOriginalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {symbol}{displayOriginalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {displayOriginalPrice && (
                <span className="text-sm text-green-600">
                  Save {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              High-quality product with excellent features. Perfect for everyday use. 
              Fast shipping available. Limited stock - order now!
            </p>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-4">
                <label className="text-sm mb-2 block">
                  Size: {selectedSize && <span className="text-orange-500">{selectedSize}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm transition-all ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="mb-4">
                <label className="text-sm mb-2 block">
                  Color: {selectedColor && <span className="text-orange-500">{selectedColor}</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm transition-all ${
                        selectedColor === color
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="text-sm mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  className="h-9 w-9"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg min-w-[40px] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  className="h-9 w-9"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => addToWishlist({ 
                  name: product.name, 
                  price: product.price, 
                  image: product.image,
                  id: product.id 
                })}
                className={isInWishlist(product.id) ? 'bg-red-50 border-red-500' : ''}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                onClick={() => addToCompare({
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  rating: product.rating,
                  id: product.id
                })}
                className={isInCompare(product.id) ? 'bg-blue-50 border-blue-500' : ''}
              >
                <Scale className="w-4 h-4" />
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className="text-green-600">In Stock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span>2-3 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warranty:</span>
                <span>1 Year</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
