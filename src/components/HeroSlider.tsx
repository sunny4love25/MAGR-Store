import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

const slides = [
  {
    title: 'Super Flash Sale',
    subtitle: 'Up to 80% OFF on Electronics',
    buttonText: 'Shop Electronics',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&h=600&fit=crop&q=80',
    targetSection: 'electronics-section',
  },
  {
    title: 'Laptop Deals',
    subtitle: 'Powerful Laptops at Unbeatable Prices',
    buttonText: 'Shop Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&h=600&fit=crop&q=80',
    targetSection: 'laptops-section',
  },
  {
    title: 'Solar Power Solutions',
    subtitle: 'Go Green with Solar Panels & Inverters',
    buttonText: 'Explore Solar',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&h=600&fit=crop&q=80',
    targetSection: 'solar-section',
  },
  {
    title: 'Fashion Week',
    subtitle: 'New Arrivals - Fresh Styles',
    buttonText: 'Shop Fashion',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&h=600&fit=crop&q=80',
    targetSection: 'fashion-section',
  },
  {
    title: 'Footwear Paradise',
    subtitle: 'Shoes for Everyone - Men, Women & Kids',
    buttonText: 'Shop Shoes',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1600&h=600&fit=crop&q=80',
    targetSection: 'shoes-section',
  },
  {
    title: 'Grocery Essentials',
    subtitle: 'Stock Up on Semo, Noodles, Pasta & More',
    buttonText: 'Shop Food',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&h=600&fit=crop&q=80',
    targetSection: 'food-section',
  },
  {
    title: 'Home & Living',
    subtitle: 'Transform Your Space',
    buttonText: 'Explore Collection',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&h=600&fit=crop&q=80',
    targetSection: 'home-section',
  },
  {
    title: 'Fitness Goals 2025',
    subtitle: 'Gear Up for Success',
    buttonText: 'Shop Sports',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=600&fit=crop&q=80',
    targetSection: 'sports-section',
  },
  {
    title: 'Beauty Essentials',
    subtitle: 'Look & Feel Your Best',
    buttonText: 'Shop Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&h=600&fit=crop&q=80',
    targetSection: 'beauty-section',
  },
  {
    title: 'Signature Scents',
    subtitle: 'Discover Your Perfect Fragrance',
    buttonText: 'Shop Perfumes',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600&h=600&fit=crop&q=80',
    targetSection: 'perfume-section',
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (targetSection: string) => {
    const element = document.getElementById(targetSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative w-full h-[250px] md:h-[400px] bg-gray-900 rounded-lg md:rounded-xl overflow-hidden group">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => handleSlideClick(slide.targetSection)}
          >
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12">
              <h2 className="text-white text-2xl md:text-5xl mb-1 md:mb-2">{slide.title}</h2>
              <p className="text-white text-sm md:text-xl mb-3 md:mb-6 flex items-center gap-2">
                <span className="w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full"></span>
                {slide.subtitle}
              </p>
              <div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideClick(slide.targetSection);
                  }}
                  className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-4 md:px-6 text-sm md:text-base h-8 md:h-10"
                >
                  {slide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 text-gray-900" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6 text-gray-900" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-4 md:w-6' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
