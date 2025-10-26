# Complete Setup Guide - MAGR Store

This guide will walk you through setting up the MAGR Store from scratch.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Running Locally](#running-locally)
7. [Admin Account Setup](#admin-account-setup)
8. [Email Configuration](#email-configuration)
9. [Testing](#testing)
10. [Production Build](#production-build)

## System Requirements

### Required
- **Node.js**: Version 18.0.0 or higher
  - Check: `node --version`
  - Download: https://nodejs.org/

- **npm**: Version 9.0.0 or higher (comes with Node.js)
  - Check: `npm --version`

### Recommended
- **Git**: For version control
- **VS Code**: Code editor with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

## Initial Setup

### 1. Extract the Package

```bash
# Extract the downloaded package
unzip magr-store-package.zip
cd magr-store
```

### 2. Install Dependencies

```bash
# Install all required packages
npm install
```

This will install:
- React and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Supabase client
- All UI components and utilities

**Installation time**: 2-5 minutes depending on internet speed

### 3. Verify Installation

```bash
# Check if installation was successful
npm list --depth=0
```

You should see all packages listed without errors.

## Supabase Configuration

### 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email
4. Verify your email address

### 2. Create a New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: MAGR Store (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

3. Click "Create new project"
4. Wait 2-3 minutes for project setup

### 3. Get Your Credentials

1. In your Supabase dashboard, click on "Settings" (gear icon)
2. Click on "API"
3. Copy these values:
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys)

**Keep these credentials safe!** You'll need them for the next step.

## Environment Variables

### 1. Create Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

### 2. Edit Environment Variables

Open `.env.local` in your code editor and add your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration (Optional)
VITE_APP_NAME=MAGR Store
VITE_APP_URL=http://localhost:5173

# Email Configuration (Optional - can be set later via admin panel)
VITE_SMTP_HOST=
VITE_SMTP_PORT=
VITE_SMTP_USER=
VITE_SMTP_PASS=
```

### 3. Verify Environment Setup

```bash
# Print environment variables (without sensitive data)
echo $VITE_SUPABASE_URL
```

## Database Setup

### 1. Access SQL Editor

1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New query"

### 2. Run Setup Script

Copy and paste this SQL script to create all required tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Vendor Registrations Table
CREATE TABLE IF NOT EXISTS vendor_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  website TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Info Banner Settings Table
CREATE TABLE IF NOT EXISTS info_banner_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  typewriter_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMTP Settings Table
CREATE TABLE IF NOT EXISTS smtp_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_user TEXT NOT NULL,
  smtp_pass TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  sent_count INTEGER DEFAULT 0,
  total_recipients INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Insert default info banner
INSERT INTO info_banner_settings (text, is_visible, typewriter_enabled)
VALUES ('Welcome to MAGR Store - Shop the best deals today! 🎉', true, true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_vendor_status ON vendor_registrations(status);
CREATE INDEX IF NOT EXISTS idx_campaign_status ON email_campaigns(status);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_banner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only for some tables)
CREATE POLICY "Public can read banner settings" ON info_banner_settings
  FOR SELECT USING (true);

CREATE POLICY "Public can insert newsletter subscriptions" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert vendor registrations" ON vendor_registrations
  FOR INSERT WITH CHECK (true);

-- Admin access (you can customize these based on your auth setup)
CREATE POLICY "Service role can do anything on subscribers" ON newsletter_subscribers
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do anything on vendors" ON vendor_registrations
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do anything on banner" ON info_banner_settings
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do anything on smtp" ON smtp_settings
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do anything on templates" ON email_templates
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do anything on campaigns" ON email_campaigns
  USING (true) WITH CHECK (true);
```

### 3. Verify Database Setup

1. Click "Run" to execute the script
2. You should see "Success. No rows returned"
3. Click on "Table Editor" in left sidebar
4. Verify all tables are created:
   - newsletter_subscribers
   - vendor_registrations
   - info_banner_settings
   - smtp_settings
   - email_templates
   - email_campaigns

## Running Locally

### 1. Start Development Server

```bash
npm run dev
```

You should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 2. Open in Browser

Open http://localhost:5173 in your browser

### 3. Verify Core Features

Test these features to ensure everything works:

- ✅ Homepage loads with products
- ✅ Click on a product to open Quick View
- ✅ Add product to cart
- ✅ View cart (top right icon)
- ✅ Change currency (top right selector)
- ✅ Subscribe to newsletter (popup or footer)
- ✅ Search for products

## Admin Account Setup

The admin panel is password-protected. Default credentials:

- **Username**: admin
- **Password**: admin123

### Change Admin Password

1. Open `/components/AdminPanel.tsx`
2. Find this line (around line 25):
```typescript
const validCredentials = { username: 'admin', password: 'admin123' };
```
3. Change to your desired credentials:
```typescript
const validCredentials = { username: 'yourusername', password: 'yourpassword' };
```
4. Save the file

**Important**: For production, implement proper authentication using Supabase Auth.

### Access Admin Panel

1. Click the settings icon (bottom-left corner)
2. Enter credentials
3. Explore admin features:
   - Banner Editor
   - Email CRM Dashboard
   - SMTP Configuration
   - Newsletter Subscribers
   - Vendor Registrations

## Email Configuration

### Option 1: Use Gmail (Easiest for Testing)

1. Create a Gmail account or use existing
2. Enable 2-factor authentication
3. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
4. In Admin Panel → SMTP Settings, enter:
   - Host: smtp.gmail.com
   - Port: 587
   - User: your-email@gmail.com
   - Password: your-app-password
   - From Email: your-email@gmail.com
   - From Name: MAGR Store

### Option 2: Use SendGrid (Production)

1. Sign up at sendgrid.com
2. Create API key
3. Configure in admin panel with SendGrid SMTP details

### Option 3: Other SMTP Providers

- **Mailgun**: mailgun.com
- **Amazon SES**: aws.amazon.com/ses
- **Postmark**: postmarkapp.com

See [Email Setup Guide](../QUICK_START_EMAIL_SETUP.md) for detailed instructions.

## Testing

### Test Checklist

#### Frontend Features
- [ ] All pages load without errors
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Wishlist functionality works
- [ ] Search works
- [ ] Filters work
- [ ] Currency conversion works
- [ ] Mobile responsive design works

#### Admin Features
- [ ] Can login to admin panel
- [ ] Can edit banner text
- [ ] Can view newsletter subscribers
- [ ] Can view vendor registrations
- [ ] SMTP settings save correctly
- [ ] Can send test email

#### Database
- [ ] Newsletter subscriptions save to database
- [ ] Vendor registrations save to database
- [ ] Banner updates persist
- [ ] SMTP settings persist

### Common Issues

**Issue**: "Supabase URL is not defined"
**Solution**: Check `.env.local` file exists and has correct Supabase URL

**Issue**: "Failed to fetch"
**Solution**: Verify Supabase project is active and credentials are correct

**Issue**: Email not sending
**Solution**: Check SMTP credentials and ensure firewall allows SMTP ports

## Production Build

### 1. Build the Application

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### 2. Preview Production Build

```bash
npm run preview
```

### 3. Test Production Build

- Verify all features work
- Check console for errors
- Test on multiple devices
- Verify loading speed

### 4. Deploy

See [Deployment Guide](./DEPLOYMENT_GUIDE.md) for platform-specific instructions.

## Next Steps

1. ✅ Customize branding (logo, colors, site name)
2. ✅ Add your products
3. ✅ Configure email settings
4. ✅ Test all features thoroughly
5. ✅ Deploy to production
6. ✅ Set up custom domain
7. ✅ Configure SSL certificate
8. ✅ Set up analytics
9. ✅ Launch your store!

## Support

If you encounter issues:

1. Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Verify all environment variables are set
3. Check Supabase dashboard for errors
4. Review browser console for errors
5. Check network tab for failed requests

---

**Congratulations!** Your MAGR Store is now set up and running locally. Ready to deploy? Check out the [Deployment Guide](./DEPLOYMENT_GUIDE.md).
