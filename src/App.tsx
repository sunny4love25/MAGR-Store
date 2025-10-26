import { useState, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { CategoryCard } from './components/CategoryCard';
import { ProductCard } from './components/ProductCard';
import { ProductCarousel } from './components/ProductCarousel';
import { SectionHeader } from './components/SectionHeader';
import { DealCard } from './components/DealCard';
import { CountdownTimer } from './components/CountdownTimer';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CompareProvider } from './contexts/CompareContext';
import { CartProvider } from './contexts/CartContext';
import { SubscriberProvider } from './contexts/SubscriberContext';
import { InfoBannerProvider } from './contexts/InfoBannerContext';
import { Toaster } from './components/ui/sonner';
import { TrendingUp, Zap, Package, Smartphone, Home, Tv, Sparkles } from 'lucide-react';

// Lazy load components for better initial load time
const Footer = lazy(() => import('./components/Footer').then(module => ({ default: module.Footer })));
const TestimonialCard = lazy(() => import('./components/TestimonialCard').then(module => ({ default: module.TestimonialCard })));
const ProductFilters = lazy(() => import('./components/ProductFilters').then(module => ({ default: module.ProductFilters })));
const SubscriptionPopup = lazy(() => import('./components/SubscriptionPopup').then(module => ({ default: module.SubscriptionPopup })));
const CookieConsent = lazy(() => import('./components/CookieConsent').then(module => ({ default: module.CookieConsent })));
const ChatWidget = lazy(() => import('./components/ChatWidget').then(module => ({ default: module.ChatWidget })));
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton').then(module => ({ default: module.WhatsAppButton })));
const QuickViewModal = lazy(() => import('./components/QuickViewModal').then(module => ({ default: module.QuickViewModal })));
const ViewAllModal = lazy(() => import('./components/ViewAllModal').then(module => ({ default: module.ViewAllModal })));
const ScrollToTopButton = lazy(() => import('./components/ScrollToTopButton').then(module => ({ default: module.ScrollToTopButton })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })));

const categories = [
  {
    name: 'Beauty',
    image: 'https://images.unsplash.com/photo-1598528738936-c50861cc75a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0c3xlbnwxfHx8fDE3NjA2NjgzMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    targetSection: 'beauty-section',
  },
  {
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1645684084216-b52ba9e12aaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHN8ZW58MXx8fHwxNzYwNjIxODgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    targetSection: 'electronics-section',
  },
  {
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYwNjA2NTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    targetSection: 'fashion-section',
  },
  {
    name: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1586777469064-00eca3156523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZ2FyZGVufGVufDF8fHx8MTc2MDcwMzAwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    targetSection: 'home-section',
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzYwNjU5OTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    targetSection: 'sports-section',
  },
  {
    name: 'Toys',
    image: 'https://images.unsplash.com/photo-1705334494891-61cd42dfe036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3lzJTIwa2lkc3xlbnwxfHx8fDE3NjA2OTI2OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    targetSection: 'toys-section',
  },
  {
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80',
    targetSection: 'laptops-section',
  },
  {
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
    targetSection: 'shoes-section',
  },
  {
    name: 'Food Items',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
    targetSection: 'food-section',
  },
  {
    name: 'Solar & Power',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80',
    targetSection: 'solar-section',
  },
  {
    name: 'Perfumes',
    image: 'https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    targetSection: 'perfume-section',
  },
  {
    name: 'Mobile Phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    targetSection: 'mobile-phones-section',
  },
  {
    name: 'Printers',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80',
    targetSection: 'printers-section',
  },
  {
    name: 'Printer Accessories',
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=400&q=80',
    targetSection: 'printer-accessories-section',
  },
  {
    name: 'Android TV Boxes',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80',
    targetSection: 'android-tv-section',
  },
  {
    name: 'Smart TVs',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
    targetSection: 'smart-tv-section',
  },
  {
    name: 'Lithium Batteries',
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400&q=80',
    targetSection: 'lithium-battery-section',
  },
  {
    name: 'Flash Drives',
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400&q=80',
    targetSection: 'flash-drive-section',
  },
];

const fashionProducts = [
  {
    name: 'Summer Dress Collection',
    price: 49.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop&q=80',
    badge: 'New',
  },
  {
    name: 'Casual T-Shirt Pack',
    price: 29.99,
    originalPrice: 49.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Denim Jeans',
    price: 59.99,
    originalPrice: 99.99,
    rating: 4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&q=80',
    badge: 'Sale',
  },
  {
    name: 'Designer Hoodie',
    price: 69.99,
    originalPrice: 119.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Leather Jacket',
    price: 149.99,
    originalPrice: 249.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Formal Blazer',
    price: 89.99,
    originalPrice: 159.99,
    rating: 5,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Cotton Polo Shirts',
    price: 34.99,
    originalPrice: 59.99,
    rating: 4,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Sneakers Collection',
    price: 79.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&q=80',
    badge: 'Trending',
  },
  {
    name: 'Yoga Pants',
    price: 44.99,
    originalPrice: 74.99,
    rating: 5,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Winter Coat',
    price: 129.99,
    originalPrice: 199.99,
    rating: 5,
    reviews: 765,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=500&fit=crop&q=80',
  },
];

const sportsProducts = [
  {
    name: 'Running Shoes Pro',
    price: 89.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80',
    badge: 'Best Seller',
  },
  {
    name: 'Yoga Mat Premium',
    price: 39.99,
    originalPrice: 69.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Gym Duffel Bag',
    price: 49.99,
    originalPrice: 79.99,
    rating: 4,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Resistance Bands Set',
    price: 24.99,
    originalPrice: 44.99,
    rating: 5,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Adjustable Dumbbells',
    price: 159.99,
    originalPrice: 249.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Fitness Tracker Watch',
    price: 99.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 2987,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop&q=80',
    badge: 'New',
  },
  {
    name: 'Cycling Helmet',
    price: 54.99,
    originalPrice: 89.99,
    rating: 4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1567058210378-6a2c90db98fa?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Basketball',
    price: 34.99,
    originalPrice: 54.99,
    rating: 5,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Tennis Racket Pro',
    price: 119.99,
    originalPrice: 189.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Swimming Goggles',
    price: 29.99,
    originalPrice: 49.99,
    rating: 4,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&h=500&fit=crop&q=80',
  },
];

const toysProducts = [
  {
    name: 'Educational Building Blocks',
    price: 34.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=500&fit=crop&q=80',
    badge: 'Top Rated',
  },
  {
    name: 'Remote Control Car',
    price: 79.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Stuffed Animal Collection',
    price: 19.99,
    originalPrice: 34.99,
    rating: 5,
    reviews: 3456,
    image: 'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=500&h=500&fit=crop&q=80',
    badge: 'Sale',
  },
  {
    name: 'Board Game Family Pack',
    price: 44.99,
    originalPrice: 69.99,
    rating: 4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'LEGO Creative Set',
    price: 89.99,
    originalPrice: 139.99,
    rating: 5,
    reviews: 4321,
    image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop&q=80',
    badge: 'Popular',
  },
  {
    name: 'Action Figure Set',
    price: 49.99,
    originalPrice: 79.99,
    rating: 5,
    reviews: 1987,
    image: 'https://images.unsplash.com/photo-1531676362848-e36bb76b6507?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Puzzle Collection',
    price: 24.99,
    originalPrice: 44.99,
    rating: 4,
    reviews: 1432,
    image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Art & Craft Set',
    price: 39.99,
    originalPrice: 64.99,
    rating: 5,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Educational Tablet Kids',
    price: 129.99,
    originalPrice: 199.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1588239034647-25783cbfcd74?w=500&h=500&fit=crop&q=80',
    badge: 'Best Gift',
  },
  {
    name: 'Musical Instruments Set',
    price: 59.99,
    originalPrice: 99.99,
    rating: 4,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop&q=80',
  },
];

const beautyProducts = [
  {
    name: 'Skincare Gift Set',
    price: 89.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&q=80',
    badge: 'Best Value',
  },
  {
    name: 'Makeup Palette Pro',
    price: 54.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 3456,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Hair Care Bundle',
    price: 39.99,
    originalPrice: 69.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop&q=80',
    badge: 'Popular',
  },
  {
    name: 'Nail Care Kit',
    price: 29.99,
    originalPrice: 49.99,
    rating: 4,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Perfume Collection',
    price: 119.99,
    originalPrice: 189.99,
    rating: 5,
    reviews: 1654,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop&q=80',
    badge: 'Luxury',
  },
  {
    name: 'Face Mask Set',
    price: 34.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 4321,
    image: 'https://images.unsplash.com/photo-1608241175281-172d67fdd9de?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Lipstick Collection',
    price: 44.99,
    originalPrice: 74.99,
    rating: 5,
    reviews: 2987,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Hair Dryer Professional',
    price: 79.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Manicure Set Deluxe',
    price: 49.99,
    originalPrice: 84.99,
    rating: 4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Bath Bomb Collection',
    price: 24.99,
    originalPrice: 44.99,
    rating: 5,
    reviews: 3210,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=500&fit=crop&q=80',
  },
];

const flashSaleProducts = [
  {
    name: 'Wireless Earbuds Pro',
    price: 49.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 3876,
  },
  {
    name: 'Smart Watch Series 5',
    price: 199.99,
    originalPrice: 299.99,
    rating: 5,
    reviews: 1023,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 2341,
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 59.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 3456,
  },
  {
    name: 'Makeup Brush Set',
    price: 34.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 678,
    image: 'https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 4567,
  },
  {
    name: '4K Action Camera',
    price: 149.99,
    originalPrice: 249.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 1234,
  },
  {
    name: 'Gaming Mouse RGB',
    price: 39.99,
    originalPrice: 69.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 5432,
  },
  {
    name: 'Mechanical Keyboard',
    price: 89.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 2987,
  },
  {
    name: 'Wireless Charger Stand',
    price: 29.99,
    originalPrice: 49.99,
    rating: 4,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1591290619762-c588f1d39e7d?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 6543,
  },
  {
    name: 'USB-C Hub Multi-Port',
    price: 44.99,
    originalPrice: 79.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 3210,
  },
  {
    name: 'Power Bank 20000mAh',
    price: 34.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 4321,
    image: 'https://images.unsplash.com/photo-1609592806003-c9c7ab31778d?w=500&h=500&fit=crop&q=80',
    badge: 'Flash Sale',
    sold: 7654,
  },
];

const phoneProducts = [
  {
    name: 'iPhone 15 Pro Max',
    price: 999.99,
    originalPrice: 1199.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop&q=80',
    badge: 'Hot Deal',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 899.99,
    originalPrice: 1099.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop&q=80',
    badge: 'Save Big',
  },
  {
    name: 'Google Pixel 8 Pro',
    price: 699.99,
    originalPrice: 899.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'OnePlus 12 5G',
    price: 649.99,
    originalPrice: 849.99,
    rating: 5,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Xiaomi 14 Pro',
    price: 599.99,
    originalPrice: 799.99,
    rating: 5,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'OPPO Find X6 Pro',
    price: 749.99,
    originalPrice: 949.99,
    rating: 4,
    reviews: 765,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Realme GT Neo 5',
    price: 449.99,
    originalPrice: 599.99,
    rating: 4,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Motorola Edge 40 Pro',
    price: 549.99,
    originalPrice: 699.99,
    rating: 4,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1592286927505-2fd0775bfb8a?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Sony Xperia 1 V',
    price: 849.99,
    originalPrice: 1049.99,
    rating: 5,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'ASUS ROG Phone 7',
    price: 799.99,
    originalPrice: 999.99,
    rating: 5,
    reviews: 1098,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop&q=80',
    badge: 'Gaming',
  },
];

const applianceProducts = [
  {
    name: 'Air Fryer 5L',
    price: 89.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80',
    badge: 'Best Seller',
  },
  {
    name: 'Coffee Maker Pro',
    price: 129.99,
    originalPrice: 199.99,
    rating: 5,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&q=80',
  },
  {
    name: 'Robot Vacuum Cleaner',
    price: 249.99,
    originalPrice: 399.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1558317374-067fb8f6650c?w=400&q=80',
    badge: 'Top Rated',
  },
  {
    name: 'Stand Mixer',
    price: 179.99,
    originalPrice: 279.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80',
  },
];

const homeProducts = [
  {
    name: 'Modern Sofa Set',
    price: 599.99,
    originalPrice: 899.99,
    rating: 5,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    badge: 'Save 33%',
  },
  {
    name: 'Dining Table Set',
    price: 449.99,
    originalPrice: 699.99,
    rating: 5,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80',
  },
  {
    name: 'Bed Frame Queen',
    price: 299.99,
    originalPrice: 499.99,
    rating: 4,
    reviews: 789,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80',
  },
  {
    name: 'Office Desk',
    price: 199.99,
    originalPrice: 349.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80',
  },
];

const tvAudioProducts = [
  {
    name: '55" 4K Smart TV',
    price: 499.99,
    originalPrice: 799.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80',
    badge: 'Limited Stock',
  },
  {
    name: 'Soundbar System',
    price: 299.99,
    originalPrice: 499.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&q=80',
  },
  {
    name: 'Home Theater System',
    price: 699.99,
    originalPrice: 999.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    badge: 'Hot Deal',
  },
  {
    name: 'Wireless Headphones',
    price: 149.99,
    originalPrice: 249.99,
    rating: 5,
    reviews: 3456,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
  },
];

const products = [
  {
    name: 'Wireless Earbuds Pro',
    price: 49.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYwNjkxODk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Sale',
    sold: 3876,
  },
  {
    name: 'Leather Handbag',
    price: 89.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmFnfGVufDF8fHx8MTc2MDY1MzE1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Sale',
    sold: 2341,
  },
  {
    name: 'Smart Home Hub',
    price: 129.99,
    originalPrice: 199.99,
    rating: 4,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1637640125496-31852f042a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBtZWNoYW5pYyUyMHRvb2xzfGVufDF8fHx8MTc2MDcwMjk5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Hot',
    sold: 1567,
  },
  {
    name: 'Casual Jacket Collection',
    price: 79.99,
    originalPrice: 119.99,
    rating: 5,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwamFja2V0fGVufDF8fHx8MTc2MDYwNjU3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Sale',
    sold: 3245,
  },
  {
    name: 'Smart Watch Series 5',
    price: 199.99,
    originalPrice: 299.99,
    rating: 5,
    reviews: 1023,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNofGVufDF8fHx8MTc2MDY5MTI2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    name: 'Makeup Brush Set',
    price: 34.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 678,
    image: 'https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWtldXAlMjBicnVzaGVzfGVufDF8fHx8MTc2MDcwMzAwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Hot',
    sold: 4567,
  },
  {
    name: 'Water Bottle Insulated',
    price: 24.99,
    originalPrice: 39.99,
    rating: 4,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NjA1OTIxNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Hot',
    sold: 2890,
  },
  {
    name: 'Portable Bluetooth Speaker',
    price: 59.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0YWJsZSUyMHNwZWFrZXJ8ZW58MXx8fHwxNzYwNzAzMDAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Sale',
    sold: 3456,
  },
];

const laptopProducts = [
  {
    name: 'Dell XPS 13 Laptop',
    price: 999.99,
    originalPrice: 1299.99,
    rating: 5,
    reviews: 1245,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop&q=80',
    badge: 'Popular',
  },
  {
    name: 'MacBook Air M2',
    price: 1199.99,
    originalPrice: 1499.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'HP Pavilion Gaming',
    price: 849.99,
    originalPrice: 1099.99,
    rating: 4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Lenovo ThinkPad',
    price: 899.99,
    originalPrice: 1199.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Asus ROG Gaming Laptop',
    price: 1499.99,
    originalPrice: 1899.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop&q=80',
    badge: 'Gaming',
  },
  {
    name: 'Microsoft Surface Laptop',
    price: 1099.99,
    originalPrice: 1399.99,
    rating: 5,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&q=80',
  },
];

const shoesProducts = [
  {
    name: 'Nike Air Max Sneakers',
    price: 129.99,
    originalPrice: 179.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Adidas Running Shoes',
    price: 99.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Women High Heels',
    price: 79.99,
    originalPrice: 119.99,
    rating: 4,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Kids School Shoes',
    price: 49.99,
    originalPrice: 79.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Men Formal Shoes',
    price: 89.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Women Sneakers',
    price: 69.99,
    originalPrice: 99.99,
    rating: 5,
    reviews: 765,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop&q=80',
    badge: 'New',
  },
  {
    name: 'Kids Sneakers',
    price: 39.99,
    originalPrice: 59.99,
    rating: 4,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Men Sandals',
    price: 29.99,
    originalPrice: 49.99,
    rating: 4,
    reviews: 321,
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop&q=80',
  },
];

const foodProducts = [
  {
    name: 'Semo (Semovita) 10kg',
    price: 24.99,
    originalPrice: 34.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Indomie Noodles Carton',
    price: 19.99,
    originalPrice: 29.99,
    rating: 5,
    reviews: 3456,
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Spaghetti Pasta 5kg',
    price: 15.99,
    originalPrice: 24.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Macaroni Pasta 5kg',
    price: 16.99,
    originalPrice: 25.99,
    rating: 4,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Rice 50kg Bag',
    price: 89.99,
    originalPrice: 119.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Garri 10kg',
    price: 22.99,
    originalPrice: 32.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Instant Noodles Pack',
    price: 12.99,
    originalPrice: 19.99,
    rating: 4,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Cooking Oil 5L',
    price: 29.99,
    originalPrice: 39.99,
    rating: 5,
    reviews: 765,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop&q=80',
  },
];

const solarProducts = [
  {
    name: 'Solar Panel 300W',
    price: 299.99,
    originalPrice: 449.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop&q=80',
    badge: 'Popular',
  },
  {
    name: 'Inverter 5000W',
    price: 499.99,
    originalPrice: 699.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Solar Battery 200Ah',
    price: 399.99,
    originalPrice: 549.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Complete Solar Kit',
    price: 1299.99,
    originalPrice: 1799.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop&q=80',
    badge: 'Bundle',
  },
  {
    name: 'Inverter 3000W',
    price: 349.99,
    originalPrice: 499.99,
    rating: 4,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Solar Charge Controller',
    price: 79.99,
    originalPrice: 119.99,
    rating: 5,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Portable Solar Generator',
    price: 599.99,
    originalPrice: 849.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&h=500&fit=crop&q=80',
    badge: 'New',
  },
  {
    name: 'Solar LED Street Light',
    price: 149.99,
    originalPrice: 219.99,
    rating: 4,
    reviews: 321,
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=500&h=500&fit=crop&q=80',
  },
];

const mobilePhoneProducts = [
  {
    name: 'iPhone 15 Pro Max',
    price: 1199.99,
    originalPrice: 1399.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 1099.99,
    originalPrice: 1299.99,
    rating: 5,
    reviews: 2876,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Google Pixel 8 Pro',
    price: 899.99,
    originalPrice: 1099.99,
    rating: 5,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'OnePlus 12',
    price: 749.99,
    originalPrice: 949.99,
    rating: 4,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Xiaomi 14 Pro',
    price: 699.99,
    originalPrice: 899.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1592286927505-2fd0775bfb8a?w=500&h=500&fit=crop&q=80',
    badge: 'New',
  },
  {
    name: 'Motorola Edge 40 Pro',
    price: 649.99,
    originalPrice: 849.99,
    rating: 4,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=500&h=500&fit=crop&q=80',
  },
];

const printerProducts = [
  {
    name: 'HP LaserJet Pro M404dn',
    price: 349.99,
    originalPrice: 499.99,
    rating: 5,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Canon PIXMA G6020',
    price: 279.99,
    originalPrice: 399.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Epson EcoTank ET-2850',
    price: 299.99,
    originalPrice: 449.99,
    rating: 5,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Brother HL-L2350DW',
    price: 199.99,
    originalPrice: 299.99,
    rating: 4,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'HP OfficeJet Pro 9015e',
    price: 249.99,
    originalPrice: 379.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Canon imageCLASS MF445dw',
    price: 399.99,
    originalPrice: 549.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=500&h=500&fit=crop&q=80',
    badge: 'New',
  },
];

const printerAccessoriesProducts = [
  {
    name: 'HP 305A Black Toner Cartridge',
    price: 79.99,
    originalPrice: 119.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Canon PG-245XL Black Ink',
    price: 39.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 2876,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Epson 252 Ink Cartridge Set',
    price: 89.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 1987,
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Brother TN-760 High Yield Toner',
    price: 69.99,
    originalPrice: 99.99,
    rating: 4,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'HP 63 Tri-Color Ink Combo',
    price: 54.99,
    originalPrice: 79.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'A4 Premium Copy Paper (5 Reams)',
    price: 49.99,
    originalPrice: 69.99,
    rating: 5,
    reviews: 4567,
    image: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=500&h=500&fit=crop&q=80',
    badge: 'Sale',
  },
  {
    name: 'USB Printer Cable 6ft',
    price: 12.99,
    originalPrice: 19.99,
    rating: 4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Printer Maintenance Kit',
    price: 59.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=500&h=500&fit=crop&q=80',
  },
];

const perfumeProducts = [
  {
    name: 'Luxury Rose Eau de Parfum',
    price: 89.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
    badge: 'Bestseller',
  },
  {
    name: 'Designer Night Fragrance',
    price: 129.99,
    originalPrice: 199.99,
    rating: 5,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1624798956425-ef88fc12b540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
    badge: 'New',
  },
  {
    name: 'Floral Spring Perfume',
    price: 79.99,
    originalPrice: 119.99,
    rating: 4,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1569744566205-8775c29261c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
  {
    name: 'Mens Executive Cologne',
    price: 99.99,
    originalPrice: 159.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1570933714411-d3184fb7ef01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
    badge: 'Hot',
  },
  {
    name: 'Oriental Spice Cologne',
    price: 94.99,
    originalPrice: 149.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1644958307902-2d0347086a38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
  {
    name: 'Signature Collection Set',
    price: 249.99,
    originalPrice: 399.99,
    rating: 5,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1659450013573-b2d6b39f916a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
    badge: 'Sale',
  },
  {
    name: 'Fresh Citrus Eau de Toilette',
    price: 69.99,
    originalPrice: 99.99,
    rating: 4,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1719175936556-dbd05e415913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
  {
    name: 'Romantic Vanilla Parfum',
    price: 84.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 765,
    image: 'https://images.unsplash.com/photo-1624798956425-ef88fc12b540?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=500',
  },
];

const androidTvBoxProducts = [
  {
    name: 'Xiaomi Mi TV Stick 4K',
    price: 59.99,
    originalPrice: 89.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Amazon Fire TV Stick 4K Max',
    price: 54.99,
    originalPrice: 79.99,
    rating: 5,
    reviews: 4567,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'NVIDIA Shield TV Pro',
    price: 199.99,
    originalPrice: 249.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop&q=80',
    badge: 'Premium',
  },
  {
    name: 'Roku Streaming Stick 4K',
    price: 49.99,
    originalPrice: 69.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Google Chromecast with Google TV',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Apple TV 4K (64GB)',
    price: 179.99,
    originalPrice: 229.99,
    rating: 5,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Premium',
  },
  {
    name: 'Mecool KM2 Plus Android TV Box',
    price: 69.99,
    originalPrice: 99.99,
    rating: 4,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Formuler Z10 Pro Max',
    price: 279.99,
    originalPrice: 349.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Professional',
  },
];

const smartTvProducts = [
  {
    name: 'Samsung 55" QLED 4K Smart TV',
    price: 799.99,
    originalPrice: 1199.99,
    rating: 5,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'LG 65" OLED 4K Smart TV',
    price: 1499.99,
    originalPrice: 2199.99,
    rating: 5,
    reviews: 2876,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Premium',
  },
  {
    name: 'Sony 55" Bravia XR OLED TV',
    price: 1399.99,
    originalPrice: 1899.99,
    rating: 5,
    reviews: 1987,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'TCL 50" 4K UHD Smart TV',
    price: 349.99,
    originalPrice: 499.99,
    rating: 4,
    reviews: 4567,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Value',
  },
  {
    name: 'Hisense 43" 4K Smart TV',
    price: 279.99,
    originalPrice: 399.99,
    rating: 4,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Samsung 75" Neo QLED 8K TV',
    price: 2999.99,
    originalPrice: 4499.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
    badge: 'Luxury',
  },
  {
    name: 'LG 48" OLED C3 Smart TV',
    price: 999.99,
    originalPrice: 1399.99,
    rating: 5,
    reviews: 1543,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Vizio 55" M-Series 4K TV',
    price: 449.99,
    originalPrice: 649.99,
    rating: 4,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&q=80',
  },
];

const lithiumBatteryProducts = [
  {
    name: 'Felicity 5.1kWh Lithium Battery',
    price: 1299.99,
    originalPrice: 1799.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Felicity 7.68kWh Solar Battery',
    price: 1799.99,
    originalPrice: 2499.99,
    rating: 5,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
    badge: 'Popular',
  },
  {
    name: 'Felicity 10.24kWh Lithium Inverter',
    price: 2499.99,
    originalPrice: 3299.99,
    rating: 5,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
    badge: 'Premium',
  },
  {
    name: 'Pylontech US3000C 3.5kWh Battery',
    price: 899.99,
    originalPrice: 1199.99,
    rating: 5,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'BYD Battery-Box Premium LVS 4.0',
    price: 1199.99,
    originalPrice: 1599.99,
    rating: 4,
    reviews: 765,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Growatt ARK-2.5H-A1 Battery',
    price: 799.99,
    originalPrice: 1099.99,
    rating: 5,
    reviews: 321,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Felicity 15.36kWh Home Battery',
    price: 3499.99,
    originalPrice: 4699.99,
    rating: 5,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
    badge: 'High Capacity',
  },
  {
    name: 'Huawei LUNA2000 5kWh Module',
    price: 1399.99,
    originalPrice: 1899.99,
    rating: 5,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=500&h=500&fit=crop&q=80',
  },
];

const flashDriveProducts = [
  {
    name: 'SanDisk Ultra 128GB USB 3.0',
    price: 19.99,
    originalPrice: 34.99,
    rating: 5,
    reviews: 8765,
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=500&h=500&fit=crop&q=80',
    badge: 'Bestseller',
  },
  {
    name: 'Samsung BAR Plus 256GB USB 3.1',
    price: 34.99,
    originalPrice: 54.99,
    rating: 5,
    reviews: 5432,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&q=80',
    badge: 'Hot',
  },
  {
    name: 'Kingston DataTraveler 64GB',
    price: 12.99,
    originalPrice: 19.99,
    rating: 4,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Transcend JetFlash 920 256GB',
    price: 39.99,
    originalPrice: 59.99,
    rating: 5,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'SanDisk Extreme Pro 512GB USB 3.2',
    price: 89.99,
    originalPrice: 129.99,
    rating: 5,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=500&h=500&fit=crop&q=80',
    badge: 'Premium',
  },
  {
    name: 'HP x796w 32GB Metal Flash Drive',
    price: 9.99,
    originalPrice: 14.99,
    rating: 4,
    reviews: 4567,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&q=80',
  },
  {
    name: 'Corsair Flash Voyager GTX 1TB',
    price: 199.99,
    originalPrice: 279.99,
    rating: 5,
    reviews: 654,
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=500&h=500&fit=crop&q=80',
    badge: 'High Capacity',
  },
  {
    name: 'PNY Turbo 128GB USB 3.0',
    price: 17.99,
    originalPrice: 29.99,
    rating: 4,
    reviews: 2876,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop&q=80',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing quality and fast shipping! I absolutely love the products. The prices are unbeatable and customer service is excellent.',
  },
  {
    name: 'Michael Chen',
    rating: 5,
    comment: 'Best online store I\'ve used! Great selection of products and the checkout process was smooth and the checkout process was smooth.',
  },
  {
    name: 'Emma Williams',
    rating: 5,
    comment: 'I have been shopping here for months now and I am always impressed. Great quality products, and excellent customer support!',
  },
];

export default function App() {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [viewAllProducts, setViewAllProducts] = useState<any[]>([]);
  const [viewAllTitle, setViewAllTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllSections, setShowAllSections] = useState(false);

  const flashSaleEndTime = new Date();
  flashSaleEndTime.setHours(flashSaleEndTime.getHours() + 2);
  flashSaleEndTime.setMinutes(flashSaleEndTime.getMinutes() + 34);

  // All products combined
  const allProducts = [
    ...fashionProducts,
    ...sportsProducts,
    ...toysProducts,
    ...beautyProducts,
    ...phoneProducts,
    ...applianceProducts,
    ...homeProducts,
    ...tvAudioProducts,
    ...laptopProducts,
    ...shoesProducts,
    ...foodProducts,
    ...solarProducts,
    ...perfumeProducts,
    ...flashSaleProducts,
    ...mobilePhoneProducts,
    ...printerProducts,
    ...printerAccessoriesProducts,
    ...androidTvBoxProducts,
    ...smartTvProducts,
    ...lithiumBatteryProducts,
    ...flashDriveProducts,
  ];

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      // Search filter
      if (searchQuery) {
        return product.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      // Category filter
      if (category !== 'all') {
        return product.name.toLowerCase().includes(category);
      }
      return true;
    })
    .filter((product) => {
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCategory('all'); // Reset category when searching
  };

  const handleQuickView = (product: any) => {
    setQuickViewProduct({ ...product, id: `${product.name}-${product.price}`.replace(/\s+/g, '-').toLowerCase() });
    setQuickViewOpen(true);
  };

  const handleViewAll = (title: string, products: any[]) => {
    setViewAllTitle(title);
    setViewAllProducts(products);
    setViewAllOpen(true);
  };

  return (
    <CurrencyProvider>
      <AuthProvider>
        <InfoBannerProvider>
          <WishlistProvider>
            <CompareProvider>
              <CartProvider>
                <SubscriberProvider>
                  <div className="min-h-screen bg-gray-50">
                  <Header onSearch={handleSearch} />
                <Suspense fallback={null}>
                  <SubscriptionPopup />
                  <CookieConsent />
                  <QuickViewModal 
                    open={quickViewOpen} 
                    onOpenChange={setQuickViewOpen}
                    product={quickViewProduct}
                  />
                  <ViewAllModal
                    open={viewAllOpen}
                    onOpenChange={setViewAllOpen}
                    title={viewAllTitle}
                    products={viewAllProducts}
                    onQuickView={handleQuickView}
                  />
                </Suspense>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 md:px-4 py-3 md:py-6">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Shop by Category */}
        <section className="mt-6 md:mt-12">
          <SectionHeader
            title="Shop by Category"
            subtitle="Browse all range of products"
            action={
              <button 
                onClick={() => handleViewAll('All Categories', [...fashionProducts, ...sportsProducts, ...toysProducts, ...beautyProducts])}
                className="text-sm text-orange-500 hover:underline"
              >
                Show All →
              </button>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.name}
                name={category.name}
                image={category.image}
                targetSection={category.targetSection}
              />
            ))}
          </div>
        </section>

        {/* Just For You - Personalized */}
        <section className="mt-6 md:mt-12">
          <SectionHeader
            icon={<Sparkles className="w-5 h-5 text-white" />}
            title="Just For You"
            subtitle="Personalized recommendations based on your browsing"
          />
          <ProductCarousel products={flashSaleProducts} />
        </section>

        {/* Flash Sales */}
        <section className="mt-6 md:mt-12" id="flash-sales">
          <SectionHeader
            icon={<Zap className="w-5 h-5 text-white" />}
            title="Flash Sales"
            subtitle="Deals ending soon - grab them while you can!"
            action={<CountdownTimer endTime={flashSaleEndTime} />}
          />
          <ProductCarousel products={flashSaleProducts} />
        </section>

        {/* Limited Stock Deals */}
        <section className="mt-6 md:mt-12">
          <SectionHeader
            icon={<Package className="w-5 h-5 text-white" />}
            title="Limited Stock Deals"
            subtitle="Hurry! Only a few items left"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <DealCard
              title="Gaming Laptops"
              discount="Up to 40% OFF"
              image="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80"
              badge="Limited"
              timeLeft="2 items left"
            />
            <DealCard
              title="Designer Watches"
              discount="Save $200+"
              image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
              badge="Almost Gone"
              timeLeft="5 items left"
            />
            <DealCard
              title="Professional Cameras"
              discount="Up to 35% OFF"
              image="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&q=80"
              badge="Limited"
              timeLeft="3 items left"
            />
            <DealCard
              title="Premium Sneakers"
              discount="Up to 50% OFF"
              image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
              badge="Last Chance"
              timeLeft="8 items left"
            />
          </div>
        </section>

        {/* Save Big On Phone Deals */}
        <section className="mt-6 md:mt-12" id="electronics-section">
          <SectionHeader
            icon={<Smartphone className="w-5 h-5 text-white" />}
            title="Save Big On Phone Deals"
            subtitle="Latest smartphones at unbeatable prices"
            action={
              <button 
                onClick={() => handleViewAll('Phone Deals', phoneProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Phones →
              </button>
            }
          />
          <ProductCarousel products={phoneProducts} />
        </section>

        {/* Appliances Deals */}
        <section className="mt-6 md:mt-12">
          <SectionHeader
            title="Appliances Deals"
            subtitle="Upgrade your kitchen and home"
            action={
              <button 
                onClick={() => handleViewAll('Appliances', applianceProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Appliances →
              </button>
            }
          />
          <ProductCarousel products={applianceProducts} />
        </section>

        {/* Upgrade Your Home */}
        <section className="mt-6 md:mt-12" id="home-section">
          <SectionHeader
            icon={<Home className="w-5 h-5 text-white" />}
            title="Upgrade Your Home"
            subtitle="Transform your living space with style"
            action={
              <button 
                onClick={() => handleViewAll('Home & Furniture', homeProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Furniture →
              </button>
            }
          />
          <ProductCarousel products={homeProducts} />
        </section>

        {/* Television and Audio */}
        <section className="mt-6 md:mt-12">
          <SectionHeader
            icon={<Tv className="w-5 h-5 text-white" />}
            title="Television and Audio"
            subtitle="Premium entertainment for your home"
            action={
              <button 
                onClick={() => handleViewAll('TV & Audio', tvAudioProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Electronics →
              </button>
            }
          />
          <ProductCarousel products={tvAudioProducts} />
        </section>

        {/* Product Filters */}
        <section className="mt-6 md:mt-12">
          <Suspense fallback={<div className="h-20 bg-gray-100 rounded-lg animate-pulse" />}>
            <ProductFilters
              category={category}
              setCategory={setCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </Suspense>
        </section>

        {/* Trending Now / Search Results */}
        <section className="mt-6" id="trending-section">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-xl">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Now'}
              </h2>
              <p className="text-xs md:text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategory('all');
                }}
                className="ml-auto text-sm text-orange-500 hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={`${product.name}-${product.price}-${index}`}
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
            ))}
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your filters.</p>
            </div>
          )}
        </section>

        {/* Fashion Section */}
        <section className="mt-6 md:mt-12" id="fashion-section">
          <SectionHeader
            title="Fashion Trends"
            subtitle="Discover the latest styles and fashion essentials"
            action={
              <button 
                onClick={() => handleViewAll('Fashion', fashionProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Fashion →
              </button>
            }
          />
          <ProductCarousel products={fashionProducts} />
        </section>

        {/* Sports Section */}
        <section className="mt-6 md:mt-12" id="sports-section">
          <SectionHeader
            title="Sports & Fitness"
            subtitle="Gear up for your active lifestyle"
            action={
              <button 
                onClick={() => handleViewAll('Sports & Fitness', sportsProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Sports →
              </button>
            }
          />
          <ProductCarousel products={sportsProducts} />
        </section>

        {/* Toys Section */}
        <section className="mt-6 md:mt-12" id="toys-section">
          <SectionHeader
            title="Toys & Games"
            subtitle="Fun and learning for all ages"
            action={
              <button 
                onClick={() => handleViewAll('Toys & Games', toysProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Toys →
              </button>
            }
          />
          <ProductCarousel products={toysProducts} />
        </section>

        {/* Beauty Section */}
        <section className="mt-6 md:mt-12" id="beauty-section">
          <SectionHeader
            title="Beauty & Personal Care"
            subtitle="Look and feel your best"
            action={
              <button 
                onClick={() => handleViewAll('Beauty & Care', beautyProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Beauty →
              </button>
            }
          />
          <ProductCarousel products={beautyProducts} />
        </section>

        {/* Laptops Section */}
        <section className="mt-6 md:mt-12" id="laptops-section">
          <SectionHeader
            title="Laptops & Computers"
            subtitle="Power up your productivity"
            action={
              <button 
                onClick={() => handleViewAll('Laptops', laptopProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Laptops →
              </button>
            }
          />
          <ProductCarousel products={laptopProducts} />
        </section>

        {/* Shoes Section */}
        <section className="mt-6 md:mt-12" id="shoes-section">
          <SectionHeader
            title="Shoes & Footwear"
            subtitle="Step out in style for men, women, and kids"
            action={
              <button 
                onClick={() => handleViewAll('Shoes', shoesProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Shoes →
              </button>
            }
          />
          <ProductCarousel products={shoesProducts} />
        </section>

        {showAllSections && (
          <>
        {/* Food Items Section */}
        <section className="mt-6 md:mt-12" id="food-section">
          <SectionHeader
            title="Food & Groceries"
            subtitle="Stock up on essentials - Semo, Noodles, Pasta & More"
            action={
              <button 
                onClick={() => handleViewAll('Food Items', foodProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Food →
              </button>
            }
          />
          <ProductCarousel products={foodProducts} />
        </section>

        {/* Solar & Power Section */}
        <section className="mt-6 md:mt-12" id="solar-section">
          <SectionHeader
            title="Solar Panels & Inverters"
            subtitle="Power your home with clean energy"
            action={
              <button 
                onClick={() => handleViewAll('Solar & Power', solarProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Solar →
              </button>
            }
          />
          <ProductCarousel products={solarProducts} />
        </section>

        {/* Perfume Section */}
        <section className="mt-6 md:mt-12" id="perfume-section">
          <SectionHeader
            icon={<Sparkles className="w-5 h-5 text-white" />}
            title="Perfumes & Fragrances"
            subtitle="Discover your signature scent"
            action={
              <button 
                onClick={() => handleViewAll('Perfumes', perfumeProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Perfumes →
              </button>
            }
          />
          <ProductCarousel products={perfumeProducts} />
        </section>

        {/* Mobile Phones Section */}
        <section className="mt-6 md:mt-12" id="mobile-phones-section">
          <SectionHeader
            icon={<Smartphone className="w-5 h-5 text-white" />}
            title="Mobile Phones"
            subtitle="Latest smartphones from top brands"
            action={
              <button 
                onClick={() => handleViewAll('Mobile Phones', mobilePhoneProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Phones →
              </button>
            }
          />
          <ProductCarousel products={mobilePhoneProducts} />
        </section>

        {/* Printers Section */}
        <section className="mt-6 md:mt-12" id="printers-section">
          <SectionHeader
            title="Printers & Scanners"
            subtitle="Professional printing solutions for home and office"
            action={
              <button 
                onClick={() => handleViewAll('Printers', printerProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Printers →
              </button>
            }
          />
          <ProductCarousel products={printerProducts} />
        </section>

        {/* Printer Accessories Section */}
        <section className="mt-6 md:mt-12" id="printer-accessories-section">
          <SectionHeader
            title="Printer Accessories"
            subtitle="Toner, ink cartridges, paper & more"
            action={
              <button 
                onClick={() => handleViewAll('Printer Accessories', printerAccessoriesProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Accessories →
              </button>
            }
          />
          <ProductCarousel products={printerAccessoriesProducts} />
        </section>

        {/* Android TV Boxes Section */}
        <section className="mt-6 md:mt-12" id="android-tv-section">
          <SectionHeader
            icon={<Tv className="w-5 h-5 text-white" />}
            title="Android TV Boxes"
            subtitle="Stream your favorite content in 4K"
            action={
              <button 
                onClick={() => handleViewAll('Android TV Boxes', androidTvBoxProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All TV Boxes →
              </button>
            }
          />
          <ProductCarousel products={androidTvBoxProducts} />
        </section>

        {/* Smart TVs Section */}
        <section className="mt-6 md:mt-12" id="smart-tv-section">
          <SectionHeader
            icon={<Tv className="w-5 h-5 text-white" />}
            title="Smart TVs"
            subtitle="Ultra HD displays for immersive entertainment"
            action={
              <button 
                onClick={() => handleViewAll('Smart TVs', smartTvProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All TVs →
              </button>
            }
          />
          <ProductCarousel products={smartTvProducts} />
        </section>

        {/* Lithium Battery Section */}
        <section className="mt-6 md:mt-12" id="lithium-battery-section">
          <SectionHeader
            icon={<Zap className="w-5 h-5 text-white" />}
            title="Lithium Inverter Batteries"
            subtitle="Reliable power storage - Felicity & more"
            action={
              <button 
                onClick={() => handleViewAll('Lithium Batteries', lithiumBatteryProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Batteries →
              </button>
            }
          />
          <ProductCarousel products={lithiumBatteryProducts} />
        </section>

        {/* Flash Drives Section */}
        <section className="mt-6 md:mt-12" id="flash-drive-section">
          <SectionHeader
            icon={<Package className="w-5 h-5 text-white" />}
            title="Flash Drives & Storage"
            subtitle="Portable storage solutions from 32GB to 1TB"
            action={
              <button 
                onClick={() => handleViewAll('Flash Drives', flashDriveProducts)}
                className="text-sm text-orange-500 hover:underline"
              >
                View All Drives →
              </button>
            }
          />
          <ProductCarousel products={flashDriveProducts} />
        </section>
          </>
        )}

        {/* Load More Button */}
        {!showAllSections && (
          <section className="mt-8 md:mt-12 mb-8 text-center">
            <button
              onClick={() => {
                setShowAllSections(true);
                setTimeout(() => {
                  window.scrollBy({ top: 400, behavior: 'smooth' });
                }, 100);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Package className="w-5 h-5" />
              <span>Load More Products</span>
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Discover more amazing deals and product categories
            </p>
          </section>
        )}

        {/* Testimonials */}
        <section className="mt-6 md:mt-12 bg-orange-50 -mx-2 md:-mx-4 px-2 md:px-4 py-8 md:py-12 md:mx-0 md:rounded-xl">
          <div className="text-center mb-6 md:mb-8">
            <h2>What Our Customers Say</h2>
            <p className="text-sm text-gray-600">Don't take our word for it - here's what our customers say</p>
          </div>
          <Suspense fallback={<div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"><div className="h-32 bg-white rounded-lg animate-pulse" /><div className="h-32 bg-white rounded-lg animate-pulse" /><div className="h-32 bg-white rounded-lg animate-pulse" /></div>}>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.name}
                  name={testimonial.name}
                  rating={testimonial.rating}
                  comment={testimonial.comment}
                />
              ))}
            </div>
          </Suspense>
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-orange-500 text-xl md:text-3xl mb-1">10,000+</div>
              <div className="text-xs md:text-sm text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-orange-500 text-xl md:text-3xl mb-1">4.8/5</div>
              <div className="text-xs md:text-sm text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-orange-500 text-xl md:text-3xl mb-1">50,000+</div>
              <div className="text-xs md:text-sm text-gray-600">Products Sold</div>
            </div>
          </div>
        </section>
      </main>

                  <Suspense fallback={null}>
                    <Footer />
                    <ChatWidget />
                    <WhatsAppButton />
                    <ScrollToTopButton />
                    <AdminPanel />
                  </Suspense>
                  <Toaster />
                </div>
              </SubscriberProvider>
            </CartProvider>
          </CompareProvider>
        </WishlistProvider>
      </InfoBannerProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}
