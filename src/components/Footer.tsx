import { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail, Send, Smartphone } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { PrivacyPolicy } from './PrivacyPolicy';
import { TermsOfService } from './TermsOfService';
import { CookiePolicy } from './CookiePolicy';
import { VendorRegistration } from './VendorRegistration';
import { toast } from 'sonner@2.0.3';
import { useSubscriber } from '../contexts/SubscriberContext';

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [vendorRegOpen, setVendorRegOpen] = useState(false);
  const { addSubscriber } = useSubscriber();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await addSubscriber(newsletterEmail, undefined, 'footer');
    if (success) {
      toast.success('Successfully subscribed to our newsletter!');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Newsletter Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="mb-1">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-gray-400">Get the latest deals and exclusive offers!</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 md:w-64"
                required
              />
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded"></div>
              <span className="text-orange-500">MAGR Store</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop shop for quality products at unbeatable prices. Shop with confidence!
            </p>
            <div className="flex gap-3">
              <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700">
                <Youtube className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Track Order</a></li>
              <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="mb-4">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li>
                <button 
                  onClick={() => setVendorRegOpen(true)}
                  className="hover:text-white transition-colors"
                >
                  Sell on MAGR Store
                </button>
              </li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Press</a></li>
              <li><a href="#" className="hover:text-white">Affiliates</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5" />
                <span>+234 808 929 9224</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5" />
                <span>support@magrstore.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Canaan Land, Ota,<br />Ogun State, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Download App Section */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="mb-1">Download Our App</h3>
                <p className="text-sm text-gray-400">Shop on the go with exclusive mobile deals</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="https://play.google.com/store" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-900 hover:bg-black px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">GET IT ON</div>
                  <div className="text-sm">Google Play</div>
                </div>
              </a>
              <a 
                href="https://www.apple.com/app-store/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-900 hover:bg-black px-4 py-2.5 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-sm">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2025 MAGR Store. All rights reserved.</p>
          <div className="flex gap-6">
            <button 
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setTermsOpen(true)}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setCookieOpen(true)}
              className="hover:text-white transition-colors"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>

      <PrivacyPolicy open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <TermsOfService open={termsOpen} onOpenChange={setTermsOpen} />
      <CookiePolicy open={cookieOpen} onOpenChange={setCookieOpen} />
      <VendorRegistration isOpen={vendorRegOpen} onClose={() => setVendorRegOpen(false)} />
    </footer>
  );
}
