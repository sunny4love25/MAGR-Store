import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Gift } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useSubscriber } from '../contexts/SubscriberContext';

export function SubscriptionPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { addSubscriber } = useSubscriber();

  useEffect(() => {
    // Check if user has seen the popup before
    const hasSeenPopup = localStorage.getItem('hasSeenSubscriptionPopup');
    
    if (!hasSeenPopup) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addSubscriber(email, undefined, 'popup');
    if (success) {
      toast.success('Welcome! Check your email for your 15% discount code!');
      localStorage.setItem('hasSeenSubscriptionPopup', 'true');
      setOpen(false);
      setEmail('');
    }
  };

  const handleClose = () => {
    localStorage.setItem('hasSeenSubscriptionPopup', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Gift className="w-8 h-8 text-orange-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Get 15% OFF!</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600 mt-2">
            Subscribe to our newsletter and get 15% off your first purchase!
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
            Get My Discount
          </Button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            No thanks, I'll pay full price
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
