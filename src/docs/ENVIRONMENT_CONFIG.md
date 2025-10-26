# Environment Configuration Guide - MAGR Store

Complete guide to configuring environment variables for MAGR Store.

## Table of Contents

1. [Overview](#overview)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [Platform-Specific Setup](#platform-specific-setup)
5. [Security Best Practices](#security-best-practices)
6. [Testing Configuration](#testing-configuration)

## Overview

MAGR Store uses environment variables for configuration. This approach:
- ✅ Keeps sensitive data secure
- ✅ Allows different settings per environment
- ✅ Makes deployment flexible
- ✅ Follows 12-factor app principles

### Important Notes

1. All Vite environment variables **must** start with `VITE_`
2. Variables are embedded at build time
3. Changes require rebuilding the app
4. Never commit `.env.local` to git

## Required Variables

### Supabase Configuration

These are **required** for the application to work.

#### VITE_SUPABASE_URL

Your Supabase project URL.

**Where to find**: Supabase Dashboard → Settings → API → Project URL

**Format**: `https://xxxxxxxxxxxxx.supabase.co`

**Example**:
```env
VITE_SUPABASE_URL=https://abcdefghijklmno.supabase.co
```

#### VITE_SUPABASE_ANON_KEY

Your Supabase anonymous/public key.

**Where to find**: Supabase Dashboard → Settings → API → Project API keys → anon public

**Format**: Long JWT string starting with `eyJ`

**Example**:
```env
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb2plY3RpZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4ODg4ODg4LCJleHAiOjE5OTQ0NjQ4ODh9.signature
```

**Security Note**: This key is safe to expose in client-side code (hence "public"). Row Level Security (RLS) protects your data.

## Optional Variables

### Application Settings

#### VITE_APP_NAME

Your store name. Used in:
- Page titles
- Email signatures
- Social sharing
- Header/footer

**Default**: "MAGR Store"

**Example**:
```env
VITE_APP_NAME=My Awesome Store
```

#### VITE_APP_URL

Your application URL. Used for:
- Email links
- Social sharing
- Sitemaps
- Canonical URLs

**Development**:
```env
VITE_APP_URL=http://localhost:5173
```

**Production**:
```env
VITE_APP_URL=https://yourdomain.com
```

#### VITE_SUPPORT_EMAIL

Customer support email address.

**Example**:
```env
VITE_SUPPORT_EMAIL=support@yourstore.com
```

### Email/SMTP Configuration

**Note**: These can also be configured via the Admin Panel UI. If set in environment, they serve as defaults.

#### VITE_SMTP_HOST

SMTP server hostname.

**Common values**:
- Gmail: `smtp.gmail.com`
- SendGrid: `smtp.sendgrid.net`
- Mailgun: `smtp.mailgun.org`
- AWS SES: `email-smtp.us-east-1.amazonaws.com`

**Example**:
```env
VITE_SMTP_HOST=smtp.gmail.com
```

#### VITE_SMTP_PORT

SMTP server port.

**Common values**:
- `587` - TLS (recommended)
- `465` - SSL
- `25` - Unencrypted (not recommended)

**Example**:
```env
VITE_SMTP_PORT=587
```

#### VITE_SMTP_USER

SMTP username (usually your email address).

**Example**:
```env
VITE_SMTP_USER=noreply@yourstore.com
```

#### VITE_SMTP_PASS

SMTP password.

**For Gmail**:
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password (not account password)

**Example**:
```env
VITE_SMTP_PASS=your-app-password-here
```

⚠️ **Security**: Never commit this to git!

#### VITE_SMTP_FROM_EMAIL

Email address to send from.

**Example**:
```env
VITE_SMTP_FROM_EMAIL=noreply@yourstore.com
```

#### VITE_SMTP_FROM_NAME

Name to display as sender.

**Example**:
```env
VITE_SMTP_FROM_NAME=MAGR Store
```

### Feature Flags

Control which features are enabled.

#### VITE_ENABLE_CHAT

Enable/disable chat widget.

**Values**: `true` | `false`

**Default**: `true`

```env
VITE_ENABLE_CHAT=true
```

#### VITE_ENABLE_NEWSLETTER_POPUP

Enable/disable newsletter popup.

**Values**: `true` | `false`

**Default**: `true`

```env
VITE_ENABLE_NEWSLETTER_POPUP=true
```

#### VITE_ENABLE_COOKIE_CONSENT

Enable/disable cookie consent banner.

**Values**: `true` | `false`

**Default**: `true`

```env
VITE_ENABLE_COOKIE_CONSENT=true
```

### Analytics

#### VITE_GOOGLE_ANALYTICS_ID

Google Analytics measurement ID.

**Where to find**: Google Analytics → Admin → Data Streams

**Format**: `G-XXXXXXXXXX`

**Example**:
```env
VITE_GOOGLE_ANALYTICS_ID=G-ABC123XYZ
```

**Implementation**:
```typescript
// Add to index.html <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123XYZ');
</script>
```

#### VITE_FACEBOOK_PIXEL_ID

Facebook Pixel ID for tracking.

**Example**:
```env
VITE_FACEBOOK_PIXEL_ID=123456789012345
```

### Payment Gateways

#### VITE_STRIPE_PUBLIC_KEY

Stripe publishable key (for future payment integration).

**Where to find**: Stripe Dashboard → Developers → API keys

**Format**: Starts with `pk_`

**Test**:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_51ABC...
```

**Live**:
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_51ABC...
```

#### VITE_PAYPAL_CLIENT_ID

PayPal Client ID.

**Where to find**: PayPal Developer Dashboard

**Example**:
```env
VITE_PAYPAL_CLIENT_ID=AaBbCcDd123456
```

### Social Media

#### VITE_WHATSAPP_NUMBER

WhatsApp number for customer support.

**Format**: Country code + number (no spaces, dashes, or +)

**Example**:
```env
VITE_WHATSAPP_NUMBER=1234567890
```

**Usage**: `https://wa.me/${VITE_WHATSAPP_NUMBER}`

#### VITE_FACEBOOK_URL

Your Facebook page URL.

**Example**:
```env
VITE_FACEBOOK_URL=https://facebook.com/yourstore
```

#### VITE_TWITTER_URL

Your Twitter/X profile URL.

**Example**:
```env
VITE_TWITTER_URL=https://twitter.com/yourstore
```

#### VITE_INSTAGRAM_URL

Your Instagram profile URL.

**Example**:
```env
VITE_INSTAGRAM_URL=https://instagram.com/yourstore
```

### Development Settings

#### VITE_DEBUG_MODE

Enable additional console logging.

**Values**: `true` | `false`

**Default**: `false`

**Development**:
```env
VITE_DEBUG_MODE=true
```

**Production**:
```env
VITE_DEBUG_MODE=false
```

#### VITE_USE_MOCK_DATA

Use mock data instead of real database (for testing).

**Values**: `true` | `false`

**Default**: `false`

```env
VITE_USE_MOCK_DATA=false
```

## Platform-Specific Setup

### Local Development

**File**: `.env.local` (create from `.env.example`)

```bash
# Copy example
cp .env.example .env.local

# Edit with your values
nano .env.local  # or use your editor
```

**Restart required**: Yes, restart dev server after changes

```bash
# Stop server: Ctrl+C
npm run dev
```

### Vercel

**Location**: Project Settings → Environment Variables

**Steps**:
1. Go to Vercel dashboard
2. Select your project
3. Click "Settings"
4. Click "Environment Variables"
5. Add each variable:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: Your Supabase URL
   - **Environment**: Production, Preview, Development (select all)
6. Repeat for all variables
7. Redeploy project

**Redeploy**:
```bash
# In Deployments tab, click "..." → "Redeploy"
```

### Netlify

**Location**: Site settings → Environment variables

**Steps**:
1. Go to Netlify dashboard
2. Select your site
3. Click "Site settings"
4. Click "Environment variables"
5. Click "Add a variable"
6. Add each variable
7. Trigger new deploy

**Deploy**:
```bash
# In Deploys tab, click "Trigger deploy" → "Deploy site"
```

### Self-Hosted (Linux)

**File**: `/var/www/magr-store/.env.local`

```bash
# SSH into server
ssh user@yourserver.com

# Navigate to app directory
cd /var/www/magr-store

# Create .env.local
nano .env.local

# Add variables (paste from template)
# Save: Ctrl+X, Y, Enter

# Rebuild application
npm run build

# Restart nginx
sudo systemctl restart nginx
```

## Security Best Practices

### ✅ Do's

1. **Use `.env.local` for local development**
   ```bash
   # This file is in .gitignore
   .env.local
   ```

2. **Use different values per environment**
   ```env
   # Development
   VITE_APP_URL=http://localhost:5173
   
   # Production
   VITE_APP_URL=https://yourstore.com
   ```

3. **Rotate sensitive credentials regularly**
   - Change passwords every 90 days
   - Regenerate API keys quarterly
   - Update Supabase keys if compromised

4. **Use environment-specific keys**
   - Test Stripe key in development
   - Live Stripe key in production

5. **Minimize exposed variables**
   - Only use VITE_ prefix for client-safe values
   - Keep server-side secrets on server

### ❌ Don'ts

1. **Never commit `.env.local`**
   ```bash
   # .gitignore should contain:
   .env.local
   ```

2. **Never put sensitive data in `.env.example`**
   ```env
   # ❌ Bad
   VITE_SMTP_PASS=actual-password
   
   # ✅ Good
   VITE_SMTP_PASS=
   ```

3. **Never use production keys in development**

4. **Never share `.env.local` files**
   - Use secure channels for sharing
   - Use password managers
   - Use 1Password, LastPass, etc.

5. **Never hardcode secrets in code**
   ```typescript
   // ❌ Bad
   const apiKey = 'abc123';
   
   // ✅ Good
   const apiKey = import.meta.env.VITE_API_KEY;
   ```

## Testing Configuration

### Verify Variables Are Set

**In code**:
```typescript
// utils/checkEnv.ts
export function checkEnvVariables() {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = required.filter(
    key => !import.meta.env[key]
  );
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
    return false;
  }
  
  return true;
}
```

**In browser console**:
```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### Test Email Configuration

Use the "Test Connection" button in Admin Panel → SMTP Settings.

### Test Database Connection

```typescript
// In browser console
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .select('count');
  
console.log('Database connected:', !error);
```

## Troubleshooting

### Variables Not Working

**Symptoms**: `undefined` when accessing variables

**Solutions**:

1. **Check variable name**:
   ```typescript
   // ✅ Correct
   const url = import.meta.env.VITE_SUPABASE_URL;
   
   // ❌ Wrong - no VITE_ prefix
   const url = import.meta.env.SUPABASE_URL;
   ```

2. **Restart dev server**:
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

3. **Check file exists**:
   ```bash
   ls -la .env.local
   ```

4. **Check file content**:
   ```bash
   cat .env.local
   ```

### Variables Not Working in Production

**Solutions**:

1. **Check hosting platform settings**
2. **Verify variable names** (case-sensitive)
3. **Redeploy** after adding variables
4. **Check build logs** for errors

### "Supabase URL is not defined"

**Solution**:
```bash
# 1. Verify .env.local exists
cat .env.local

# 2. Check content
# Should have: VITE_SUPABASE_URL=https://...

# 3. Restart dev server
npm run dev
```

## Example Configurations

### Minimal (Development)

```env
# .env.local
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Full (Production)

```env
# Production environment variables

# Required
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# App
VITE_APP_NAME=My Store
VITE_APP_URL=https://mystore.com
VITE_SUPPORT_EMAIL=support@mystore.com

# Email
VITE_SMTP_HOST=smtp.sendgrid.net
VITE_SMTP_PORT=587
VITE_SMTP_USER=apikey
VITE_SMTP_PASS=SG.xxx
VITE_SMTP_FROM_EMAIL=noreply@mystore.com
VITE_SMTP_FROM_NAME=My Store

# Features
VITE_ENABLE_CHAT=true
VITE_ENABLE_NEWSLETTER_POPUP=true
VITE_ENABLE_COOKIE_CONSENT=true

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Social
VITE_WHATSAPP_NUMBER=1234567890
VITE_FACEBOOK_URL=https://facebook.com/mystore
VITE_INSTAGRAM_URL=https://instagram.com/mystore
```

## Next Steps

1. ✅ Copy `.env.example` to `.env.local`
2. ✅ Fill in required Supabase credentials
3. ✅ Add optional variables as needed
4. ✅ Test configuration locally
5. ✅ Set up production variables in hosting platform
6. ✅ Document your configuration
7. ✅ Store credentials securely

---

**Remember**: Environment variables are your first line of defense for keeping sensitive data secure. Handle them with care!
