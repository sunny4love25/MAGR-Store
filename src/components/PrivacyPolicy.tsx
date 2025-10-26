import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface PrivacyPolicyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrivacyPolicy({ open, onOpenChange }: PrivacyPolicyProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: January 2025
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg mb-2">1. Introduction</h3>
              <p className="text-gray-600 leading-relaxed">
                Welcome to MAGR Store. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our 
                website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">2. Information We Collect</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                We may collect, use, store and transfer different kinds of personal data about you:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li><strong>Identity Data:</strong> first name, last name, username</li>
                <li><strong>Contact Data:</strong> email address, telephone numbers, billing and delivery addresses</li>
                <li><strong>Financial Data:</strong> payment card details</li>
                <li><strong>Transaction Data:</strong> details about payments and products you have purchased</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                <li><strong>Usage Data:</strong> how you use our website, products and services</li>
                <li><strong>Marketing Data:</strong> your preferences in receiving marketing from us</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">3. How We Use Your Information</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>To process and deliver your orders</li>
                <li>To manage your account and provide customer support</li>
                <li>To send you important updates about your orders</li>
                <li>To improve our website and services</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To detect and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">4. Cookies and Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and store certain 
                information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
                being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">5. Data Security</h3>
              <p className="text-gray-600 leading-relaxed">
                We have implemented appropriate security measures to prevent your personal data from being accidentally 
                lost, used, altered, disclosed, or accessed without authorization. We limit access to your personal data 
                to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">6. Your Rights</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Right to access your personal data</li>
                <li>Right to correction of inaccurate data</li>
                <li>Right to erasure of your data</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Rights related to automated decision-making</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">7. Third-Party Links</h3>
              <p className="text-gray-600 leading-relaxed">
                Our website may include links to third-party websites, plug-ins and applications. Clicking on those 
                links or enabling those connections may allow third parties to collect or share data about you. We do 
                not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">8. Data Retention</h3>
              <p className="text-gray-600 leading-relaxed">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected 
                it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">9. Contact Us</h3>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-2 text-gray-600">
                <p>Email: privacy@magrstore.com</p>
                <p>Phone: +234 808 929 9224</p>
                <p>Address: Canaan Land, Ota, Ogun State, Nigeria</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg mb-2">10. Changes to This Policy</h3>
              <p className="text-gray-600 leading-relaxed">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the 
                new privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
