import { useState } from 'react';
import { Store, Package, TrendingUp, DollarSign, X, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface VendorFormData {
  businessName: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  website?: string;
  address?: string;
}

interface VendorRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VendorRegistration({ isOpen, onClose }: VendorRegistrationProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    businessName: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    website: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const categories = [
    'Electronics',
    'Fashion & Clothing',
    'Home & Garden',
    'Sports & Outdoors',
    'Toys & Games',
    'Health & Beauty',
    'Automotive',
    'Books & Media',
    'Food & Beverage',
    'Other'
  ];

  const handleChange = (field: keyof VendorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.businessName || !formData.email || !formData.phone || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dee56b5b/vendor/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setApplicationId(data.applicationId);
      setShowSuccess(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting vendor application:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      businessName: '',
      email: '',
      phone: '',
      category: '',
      description: '',
      website: '',
      address: ''
    });
    setShowSuccess(false);
    setApplicationId('');
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-xl">
          <DialogDescription className="sr-only">
            Application submitted successfully
          </DialogDescription>
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for your interest in selling on MAGR Store. We've received your application and will review it shortly.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Your Application ID:</p>
              <p className="text-lg text-orange-600">{applicationId}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              We'll contact you at {formData.email} within 2-3 business days.
            </p>
            <Button onClick={handleClose} className="bg-orange-500 hover:bg-orange-600">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Store className="w-6 h-6 text-orange-500" />
            Sell on MAGR Store
          </DialogTitle>
          <DialogDescription>
            Join thousands of sellers and grow your business with us
          </DialogDescription>
        </DialogHeader>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="text-sm">Easy Product Listing</h4>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="text-sm">Grow Your Sales</h4>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <h4 className="text-sm">Competitive Fees</h4>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                placeholder="Your Business Name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="business@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+234 800 000 0000"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Product Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Business Address (Optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="123 Street, City, State"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Business Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell us about your business and the products you plan to sell..."
              rows={4}
              required
            />
          </div>

          {/* Terms */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-xs text-gray-600">
              By submitting this application, you agree to our seller terms and conditions. 
              We will review your application within 2-3 business days.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
