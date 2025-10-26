# 🎨 MAGR Store Customization Guide

Complete guide to customizing your store.

## 📝 Table of Contents
1. [Branding & Colors](#branding--colors)
2. [Adding/Editing Products](#addingediting-products)
3. [Category Management](#category-management)
4. [Info Banner](#info-banner)
5. [Email Templates](#email-templates)
6. [WhatsApp Integration](#whatsapp-integration)
7. [Payment Integration](#payment-integration)

---

## 🎨 Branding & Colors

### Change Site Name
Search and replace "MAGR Store" across all files:
```bash
# In terminal (Mac/Linux)
grep -r "MAGR Store" . --exclude-dir=node_modules

# Manually search in your code editor
```

Update in these key files:
- `index.html` - Page title and meta tags
- `components/Header.tsx` - Logo and header
- `components/Footer.tsx` - Footer branding
- `package.json` - Project name

### Change Colors
Edit `styles/globals.css`:

```css
:root {
  /* Primary color (Orange by default) */
  --primary: 255 107 53; /* RGB values */
  
  /* Background colors */
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  
  /* Accent colors */
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
}
```

**Common color changes:**

Orange → Blue:
```css
--primary: 59 130 246; /* Tailwind blue-500 */
```

Orange → Green:
```css
--primary: 34 197 94; /* Tailwind green-500 */
```

Orange → Purple:
```css
--primary: 168 85 247; /* Tailwind purple-500 */
```

### Change Fonts
In `styles/globals.css`, update font-family:

```css
body {
  font-family: 'Your Font', system-ui, sans-serif;
}
```

Add Google Fonts in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 🛍️ Adding/Editing Products

### Location
All products are in `App.tsx`

### Add New Product Section

1. Create product array:
```typescript
const myNewProducts = [
  {
    name: 'Product Name',
    price: 99.99,
    originalPrice: 149.99, // Optional (for sale badge)
    rating: 5,
    reviews: 100,
    image: 'https://your-image-url.com/image.jpg',
    badge: 'New', // Optional: 'New', 'Sale', 'Hot', etc.
    id: 'unique-product-id',
    // Optional: For Quick View
    sizes: ['S', 'M', 'L', 'XL'], // For clothing
    colors: ['Black', 'White', 'Blue'], // Available colors
  },
  // Add more products...
];
```

2. Add to visible sections array (around line 1800):
```typescript
const visibleSections = [
  // ... existing sections
  {
    id: 'my-new-section',
    title: 'My New Products',
    products: myNewProducts,
  },
];
```

3. Add category card (around line 40):
```typescript
const categories = [
  // ... existing categories
  {
    name: 'My Category',
    image: 'https://image-url.com/category.jpg',
    targetSection: 'my-new-section',
  },
];
```

### Edit Existing Products

Find the product array (e.g., `fashionProducts`, `electronicsProducts`) and modify:

```typescript
const fashionProducts = [
  {
    name: 'New Product Name', // Change name
    price: 79.99, // Update price
    originalPrice: 99.99, // Update original price
    rating: 5, // 1-5
    reviews: 500, // Number of reviews
    image: 'new-image-url.jpg', // Update image
    badge: 'Sale', // Add/remove badge
    id: 'product-id', // Keep unique
  },
];
```

### Product Images
**Recommended:**
- Size: 500x500px minimum
- Format: JPG or WebP
- Quality: 80-90%
- Use Unsplash for free stock photos: https://unsplash.com

---

## 📂 Category Management

### Add New Category

In `App.tsx`, find the `categories` array (around line 30):

```typescript
const categories = [
  {
    name: 'Electronics',
    image: 'https://image-url.com/electronics.jpg',
    targetSection: 'electronics-section', // Must match section ID
  },
  // Add new:
  {
    name: 'Your New Category',
    image: 'https://image-url.com/new-category.jpg',
    targetSection: 'your-section-id',
  },
];
```

### Remove Category
Simply delete or comment out the category object.

---

## 📢 Info Banner

### Admin Panel Method (Recommended)
1. Click Settings icon (bottom-left)
2. Login with admin credentials
3. Edit banner messages, colors, and typewriter effect
4. Save changes

### Code Method
Edit `components/InfoBanner.tsx` or database directly.

Default messages stored in Supabase `info_banner_settings` table.

---

## 📧 Email Templates

### Via Admin Panel
1. Open admin panel
2. Go to Email CRM Dashboard
3. Click "Templates" tab
4. Create/edit templates

### Database Method
Edit `email_templates` table in Supabase:
```sql
INSERT INTO email_templates (name, subject, body, category)
VALUES (
  'Welcome Email',
  'Welcome to Our Store!',
  'Thank you for subscribing...',
  'welcome'
);
```

### Template Variables
Use these in your email body:
- `{{customer_name}}` - Customer's name
- `{{product_name}}` - Product name
- `{{order_id}}` - Order ID
- `{{discount_code}}` - Discount code

---

## 💬 WhatsApp Integration

### Update WhatsApp Number
Edit `components/WhatsAppButton.tsx`:

```typescript
const whatsappNumber = '1234567890'; // Your number (no + or spaces)
```

Or set in `.env.local`:
```env
VITE_WHATSAPP_NUMBER=1234567890
```

### Customize Message
In `components/WhatsAppButton.tsx`:
```typescript
const message = encodeURIComponent(
  'Hi! I would like to know more about your products.'
);
```

### Change Position
Edit positioning in `WhatsAppButton.tsx`:
```typescript
className="fixed bottom-4 right-4 z-50" // Bottom right
// Change to:
className="fixed bottom-4 left-4 z-50" // Bottom left
```

---

## 💳 Payment Integration

This package includes frontend only. To add payments:

### Stripe (Recommended)

1. Install Stripe:
```bash
npm install @stripe/stripe-js
```

2. Create checkout component:
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_publishable_key');

const handleCheckout = async () => {
  const stripe = await stripePromise;
  // Implement checkout logic
};
```

3. Add Stripe Elements for payment form
4. Connect to backend for payment processing

**Resources:**
- Stripe React Guide: https://stripe.com/docs/stripe-js/react
- Example implementation: https://github.com/stripe-samples/react-elements-card-payment

### PayPal

1. Install PayPal SDK:
```bash
npm install @paypal/react-paypal-js
```

2. Wrap app with PayPalScriptProvider:
```typescript
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

<PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
  <PayPalButtons />
</PayPalScriptProvider>
```

**Resources:**
- PayPal React Guide: https://developer.paypal.com/sdk/js/reference/

### Other Payment Gateways
- **Razorpay** (India): https://razorpay.com/docs/
- **Square**: https://developer.squareup.com/
- **Authorize.Net**: https://developer.authorize.net/

---

## 🔧 Advanced Customizations

### Change Layout
Edit component files in `/components`:
- `Header.tsx` - Top navigation
- `Footer.tsx` - Footer section
- `ProductCard.tsx` - Product card design
- `CategoryCard.tsx` - Category card design

### Add New Pages
1. Create component in `/components`:
```typescript
// components/AboutPage.tsx
export function AboutPage() {
  return <div>About Us Content</div>;
}
```

2. Add route logic in `App.tsx`

### Modify Search Behavior
Edit `components/IntelligentSearch.tsx`

### Change Currency Options
Edit `contexts/CurrencyContext.tsx`:
```typescript
const currencies = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.85 },
  { code: 'GBP', symbol: '£', rate: 0.73 },
  // Add more currencies
];
```

### Add Language Support
1. Install i18n:
```bash
npm install react-i18next i18next
```

2. Create translation files
3. Wrap app with I18nextProvider

---

## 🎯 Performance Optimization

### Image Optimization
1. Use WebP format
2. Compress images: https://tinypng.com
3. Use CDN for images (Cloudinary, Imgix)

### Code Splitting
Already implemented with dynamic imports in product sections.

### Lazy Loading
Already implemented for images and components.

---

## 📱 Mobile Customization

### Responsive Breakpoints
Tailwind CSS breakpoints used:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>
```

### Mobile-Specific Styling
```typescript
<Button className="w-full md:w-auto">
  {/* Full width on mobile, auto on desktop */}
</Button>
```

---

## 🆘 Need Help?

- Check `/docs` folder for more guides
- Review `DEPLOYMENT_PACKAGE.md` for deployment info
- Check `TROUBLESHOOTING.md` for common issues

---

**Happy Customizing! 🎉**
