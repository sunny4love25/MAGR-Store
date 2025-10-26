import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ProductCard } from './ProductCard';
import { X } from 'lucide-react';
import { useState } from 'react';

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

interface ViewAllModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  products: Product[];
  onQuickView: (product: Product) => void;
}

export function ViewAllModal({ open, onOpenChange, title, products, onQuickView }: ViewAllModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription>
            Browse all {products.length} products in this category
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviews={product.reviews}
              image={product.image}
              badge={product.badge}
              sold={product.sold}
              onQuickView={() => onQuickView(product)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
