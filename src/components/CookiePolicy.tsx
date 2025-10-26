import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface CookiePolicyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookiePolicy({ open, onOpenChange }: CookiePolicyProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cookie Policy</DialogTitle>
          <DialogDescription>
            Last updated: January 2025
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg mb-2">1. What Are Cookies</h3>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently, provide a better user experience, and to 
                provide information to the owners of the website.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">2. How We Use Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                We use cookies for several reasons:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>To enable certain functions of the website</li>
                <li>To provide analytics and improve our services</li>
                <li>To store your preferences</li>
                <li>To enable advertisements delivery, including behavioral advertising</li>
                <li>To remember items in your shopping cart</li>
                <li>To keep you signed in to your account</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">3. Types of Cookies We Use</h3>
              
              <div className="space-y-4 mt-3">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold mb-1">Necessary Cookies</h4>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies are essential for you to browse the website and use its features, such as accessing 
                    secure areas of the site. Without these cookies, services you have asked for cannot be provided.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Duration: Session or up to 1 year</p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold mb-1">Analytics Cookies</h4>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies collect information about how visitors use our website, such as which pages visitors 
                    go to most often. This data helps us optimize our website and make it easier for customers to navigate.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Examples: Google Analytics, Hotjar</p>
                  <p className="text-sm text-gray-500">Duration: Up to 2 years</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold mb-1">Functionality Cookies</h4>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies allow the website to remember choices you make (such as your language or currency) 
                    and provide enhanced, more personal features.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Duration: Up to 1 year</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold mb-1">Marketing/Advertising Cookies</h4>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies are used to deliver advertisements more relevant to you and your interests. They are 
                    also used to limit the number of times you see an advertisement and help measure the effectiveness 
                    of advertising campaigns.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Examples: Facebook Pixel, Google Ads</p>
                  <p className="text-sm text-gray-500">Duration: Up to 1 year</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg mb-2">4. Third-Party Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics 
                of the website and deliver advertisements on and through the website. These include:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li><strong>Google Analytics:</strong> For website analytics and visitor tracking</li>
                <li><strong>Facebook Pixel:</strong> For advertising and conversion tracking</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Social Media Plugins:</strong> For social sharing functionality</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">5. Managing Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences 
                in several ways:
              </p>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold mb-1">Cookie Consent Tool</h4>
                  <p className="text-gray-600 text-sm">
                    You can set your cookie preferences using our cookie consent banner when you first visit our website.
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold mb-1">Browser Settings</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Most web browsers allow you to control cookies through their settings. To find out more about cookies, 
                    including how to see what cookies have been set and how to manage and delete them:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600 text-sm">
                    <li>Chrome: Settings → Privacy and security → Cookies</li>
                    <li>Firefox: Options → Privacy & Security → Cookies</li>
                    <li>Safari: Preferences → Privacy → Cookies</li>
                    <li>Edge: Settings → Privacy → Cookies</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-semibold mb-1">Third-Party Opt-Out</h4>
                  <p className="text-gray-600 text-sm">
                    You can opt-out of targeted advertising by visiting:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-600 text-sm mt-1">
                    <li>Digital Advertising Alliance: www.aboutads.info/choices</li>
                    <li>Network Advertising Initiative: www.networkadvertising.org/choices</li>
                    <li>European Interactive Digital Advertising Alliance: www.youronlinechoices.eu</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg mb-2">6. Impact of Disabling Cookies</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                If you choose to disable cookies, some features of our website may not function properly. For example:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>You may not be able to stay logged in to your account</li>
                <li>Your shopping cart may not save items</li>
                <li>Personalized content and recommendations may not work</li>
                <li>Some pages may not display correctly</li>
                <li>Forms may not function properly</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">7. Updates to This Policy</h3>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for other 
                operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed 
                about our use of cookies.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">8. More Information</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                For more information about how we use cookies and process your data, please see our Privacy Policy.
              </p>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="mt-2 text-gray-600">
                <p>Email: privacy@magrstore.com</p>
                <p>Phone: +234 808 929 9224</p>
                <p>Address: Canaan Land, Ota, Ogun State, Nigeria</p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
