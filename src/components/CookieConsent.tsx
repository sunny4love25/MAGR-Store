import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X, Cookie, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    setShowBanner(false);
  };

  const savePreferences = () => {
    const saved = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookieConsent', JSON.stringify(saved));
    setShowSettings(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-2xl animate-in slide-in-from-bottom">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg mb-1">We value your privacy</h3>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies.{' '}
                  <button 
                    onClick={() => {
                      setShowBanner(false);
                      // Trigger cookie policy from footer
                      const event = new CustomEvent('openCookiePolicy');
                      window.dispatchEvent(event);
                    }}
                    className="text-orange-500 hover:underline"
                  >
                    Read our Cookie Policy
                  </button>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
                className="flex-1 md:flex-none"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button
                variant="outline"
                onClick={acceptNecessary}
                className="flex-1 md:flex-none"
              >
                Necessary Only
              </Button>
              <Button
                onClick={acceptAll}
                className="bg-orange-500 hover:bg-orange-600 flex-1 md:flex-none"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie settings. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4>Necessary Cookies</h4>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">Always Active</span>
                </div>
                <p className="text-sm text-gray-600">
                  Essential for the website to function. Cannot be disabled.
                </p>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1 mr-4">
                <h4 className="mb-1">Analytics Cookies</h4>
                <p className="text-sm text-gray-600">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1 mr-4">
                <h4 className="mb-1">Marketing Cookies</h4>
                <p className="text-sm text-gray-600">
                  Used to track visitors and display relevant ads.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={savePreferences}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
