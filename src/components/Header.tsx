import { ShoppingCart, Heart, User, ChevronDown, Scale, Menu, X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { CurrencySelector } from './CurrencySelector';
import { SearchBar } from './SearchBar';
import { CartSheet } from './CartSheet';
import { WishlistSheet } from './WishlistSheet';
import { InfoBanner } from './InfoBanner';
import { useState } from 'react';
import { AuthDialog } from './AuthDialog';
import { ProfileDialog } from './ProfileDialog';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps = {}) {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { compareList } = useCompare();
  const { getCartCount } = useCart();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Bar - Hide on mobile */}
          <div className="hidden md:flex items-start justify-between gap-4 min-h-10 py-2 border-b border-gray-100">
            <InfoBanner />
            <div className="flex-shrink-0">
              <CurrencySelector />
            </div>
          </div>

          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-700 hover:text-orange-500"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 bg-orange-500 rounded"></div>
              <span className="text-orange-500">MAGR Store</span>
            </button>

          {/* Search Bar - Desktop only */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={onSearch} />
          </div>

          {/* Mobile Search Button */}
          <button 
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden text-gray-700 hover:text-orange-500"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-gray-700 hover:text-orange-500">
                    <User className="w-5 h-5" />
                    <span className="text-sm hidden md:inline">{user.name}</span>
                    <ChevronDown className="w-4 h-4 hidden md:inline" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>My Orders</DropdownMenuItem>
                  <DropdownMenuItem>Wishlist</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button 
                onClick={() => setAuthDialogOpen(true)}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-500"
              >
                <User className="w-5 h-5" />
                <span className="text-sm hidden md:inline">Sign In</span>
              </button>
            )}
            <button 
              onClick={() => setWishlistOpen(true)}
              className="text-gray-700 hover:text-orange-500 relative"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button className="hidden md:flex text-gray-700 hover:text-orange-500 relative">
              <Scale className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="text-gray-700 hover:text-orange-500 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation - Horizontal scroll on mobile */}
        <nav className="flex items-center gap-3 md:gap-6 py-3 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3 md:px-4 py-1.5 bg-orange-500 text-white rounded-full whitespace-nowrap hover:bg-orange-600 transition-colors text-sm"
          >
            All Category
          </button>
          <button 
            onClick={() => document.getElementById('beauty-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-orange-500 whitespace-nowrap transition-colors text-sm"
          >
            Beauty
          </button>
          <button 
            onClick={() => document.getElementById('electronics-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-orange-500 whitespace-nowrap transition-colors text-sm"
          >
            Electronics
          </button>
          <button 
            onClick={() => document.getElementById('fashion-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-orange-500 whitespace-nowrap transition-colors text-sm"
          >
            Fashion
          </button>
          <button 
            onClick={() => document.getElementById('home-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-orange-500 whitespace-nowrap transition-colors text-sm"
          >
            Home & Garden
          </button>
          <button 
            onClick={() => document.getElementById('sports-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-orange-500 whitespace-nowrap transition-colors text-sm"
          >
            Sports
          </button>
          <button 
            onClick={() => document.getElementById('toys-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-700 hover:text-orange-500 whitespace-nowrap transition-colors text-sm"
          >
            Toys
          </button>
        </nav>
      </div>
    </header>
    
      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Navigate through categories and options</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-6">
            <CurrencySelector />
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 text-gray-900">Categories</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  All Category
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('beauty-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  Beauty
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('electronics-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  Electronics
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('fashion-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  Fashion
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('home-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  Home & Garden
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('sports-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  Sports
                </button>
                <button 
                  onClick={() => {
                    document.getElementById('toys-section')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  Toys
                </button>
              </div>
            </div>
            {user && (
              <div className="border-t pt-4">
                <button 
                  onClick={() => {
                    setProfileDialogOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  My Profile
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors"
                >
                  My Orders
                </button>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Search Sheet */}
      <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <SheetContent side="top" className="h-auto">
          <SheetHeader>
            <SheetTitle>Search Products</SheetTitle>
            <SheetDescription>Search for products in our store</SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <SearchBar onSearch={(query) => {
              if (onSearch) onSearch(query);
              setMobileSearchOpen(false);
            }} />
          </div>
        </SheetContent>
      </Sheet>
    
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <ProfileDialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
      <WishlistSheet open={wishlistOpen} onOpenChange={setWishlistOpen} />
    </>
  );
}
