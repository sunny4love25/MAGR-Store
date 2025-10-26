import { useState } from 'react';
import whatsappLogo from 'figma:asset/a38f2ab0c9879fd6f56a03b396b6bf2291ccf4cc.png';

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '2348089299224'; // +234 (Nigeria) + 8089299224

  const handleWhatsAppClick = () => {
    const defaultMessage = 'Hello! I would like to inquire about your products.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="fixed bottom-24 right-6 z-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap animate-in slide-in-from-right">
            <p className="text-sm font-medium">Chat on WhatsApp</p>
            <p className="text-xs text-gray-300">+234 808 929 9224</p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        )}

        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all group relative overflow-hidden"
          aria-label="Chat on WhatsApp"
        >
          <img 
            src={whatsappLogo} 
            alt="WhatsApp" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </button>

        {/* Ripple Effect */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
}
