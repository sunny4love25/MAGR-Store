import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface TermsOfServiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsOfService({ open, onOpenChange }: TermsOfServiceProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Terms of Service</DialogTitle>
          <DialogDescription>
            Last updated: January 2025
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg mb-2">1. Agreement to Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using MAGR Store, you accept and agree to be bound by the terms and provision of 
                this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">2. Use License</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                Permission is granted to temporarily download one copy of the materials on MAGR Store for personal, 
                non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and 
                under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or public display</li>
                <li>Attempt to reverse engineer any software on MAGR Store</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">3. Account Registration</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                When you create an account with us, you must provide accurate, complete, and current information. 
                Failure to do so constitutes a breach of these Terms. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Maintaining the confidentiality of your account and password</li>
                <li>Restricting access to your computer and account</li>
                <li>All activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">4. Product Information and Pricing</h3>
              <p className="text-gray-600 leading-relaxed">
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product 
                descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. We 
                reserve the right to correct any errors, inaccuracies, or omissions and to change or update information 
                at any time without prior notice.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">5. Orders and Payment</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                By placing an order, you represent that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>You are legally capable of entering into binding contracts</li>
                <li>You are at least 18 years of age</li>
                <li>The information you provide is truthful and accurate</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                We reserve the right to refuse or cancel any order for any reason, including product availability, 
                errors in pricing or product information, or suspected fraud.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">6. Shipping and Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Shipping times and costs vary based on location and shipping method selected. We are not responsible 
                for delays caused by customs, weather, or carrier issues. Risk of loss and title for items pass to 
                you upon delivery to the carrier.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">7. Returns and Refunds</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                We accept returns within 30 days of delivery. Items must be:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Unused and in original condition</li>
                <li>In original packaging</li>
                <li>Accompanied by proof of purchase</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-2">
                Refunds will be processed to the original payment method within 7-10 business days after we receive 
                the returned item.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">8. Prohibited Uses</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                You may not use our website for any unlawful purpose or to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                <li>Infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>Harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>Submit false or misleading information</li>
                <li>Upload viruses or malicious code</li>
                <li>Collect or track personal information of others</li>
                <li>Spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg mb-2">9. Intellectual Property</h3>
              <p className="text-gray-600 leading-relaxed">
                The website and its original content, features, and functionality are owned by MAGR Store and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual property 
                or proprietary rights laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">10. Limitation of Liability</h3>
              <p className="text-gray-600 leading-relaxed">
                In no event shall MAGR Store, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential or punitive damages, including without 
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">11. Disclaimer</h3>
              <p className="text-gray-600 leading-relaxed">
                Your use of our service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" 
                basis without any warranty or condition, express, implied or statutory.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">12. Governing Law</h3>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of the State of New York, 
                United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">13. Changes to Terms</h3>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will 
                provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h3 className="text-lg mb-2">14. Contact Information</h3>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-2 text-gray-600">
                <p>Email: legal@magrstore.com</p>
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
