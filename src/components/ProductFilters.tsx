import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Filter } from 'lucide-react';

interface ProductFiltersProps {
  category: string;
  setCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
}

export function ProductFilters({
  category,
  setCategory,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4" />
        <span>Filters</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="toys">Toys</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range: ${priceRange[0]} - ${priceRange[1]}</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={500}
            step={10}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
