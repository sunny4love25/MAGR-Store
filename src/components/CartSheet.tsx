import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from './ui/sheet';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { convertPrice, getCurrencySymbol } = useCurrency();
  const symbol = getCurrencySymbol();

  if (cart.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
            <SheetDescription>Your shopping cart is currently empty</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">Your cart is empty</p>
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
          <SheetTitle>Shopping Cart ({cart.length} items)</SheetTitle>
          <SheetDescription>Review and manage items in your cart</SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain bg-white rounded"
                />
                <div className="flex-1">
                  <h4 className="text-sm mb-2 line-clamp-2">{item.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500">
                      {symbol}
                      {convertPrice(item.price).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <SheetFooter className="flex-col gap-4">
          <div className="flex justify-between items-center py-4 border-t">
            <span className="text-lg">Total:</span>
            <span className="text-2xl text-orange-500">
              {symbol}
              {convertPrice(getCartTotal()).toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearCart}
              className="flex-1"
            >
              Clear Cart
            </Button>
            <Button
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={() => {
                onOpenChange(false);
                // Navigate to checkout
              }}
            >
              Checkout
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
