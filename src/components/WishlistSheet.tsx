import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner@2.0.3';

interface WishlistSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WishlistSheet({ open, onOpenChange }: WishlistSheetProps) {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { convertPrice, getCurrencySymbol } = useCurrency();
  const symbol = getCurrencySymbol();

  const handleAddToCart = (item: any) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item);
    });
    wishlist.forEach((item) => {
      removeFromWishlist(item.id);
    });
    toast.success('All items added to cart');
  };

  if (wishlist.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>My Wishlist</SheetTitle>
            <SheetDescription>Your wishlist is currently empty</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Heart className="w-24 h-24 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">Your wishlist is empty</p>
            <p className="text-sm text-gray-400 text-center mb-4">
              Save items you love by clicking the heart icon
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>My Wishlist ({wishlist.length} items)</SheetTitle>
          <SheetDescription>Manage your favorite items</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {wishlist.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain bg-white rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm mb-2 line-clamp-2">{item.name}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-orange-500">
                      {symbol}
                      {convertPrice(item.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-orange-500 hover:bg-orange-600"
                    >
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add to Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="flex-col gap-2">
          <Button
            onClick={handleAddAllToCart}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add All to Cart
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Continue Shopping
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
