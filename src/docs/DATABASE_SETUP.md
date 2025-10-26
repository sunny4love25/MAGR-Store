# Database Setup Guide - MAGR Store

Complete guide for setting up and managing your Supabase database.

## Table of Contents

1. [Quick Setup](#quick-setup)
2. [Detailed Table Schemas](#detailed-table-schemas)
3. [Row Level Security](#row-level-security)
4. [Sample Data](#sample-data)
5. [Backup and Restore](#backup-and-restore)
6. [Database Maintenance](#database-maintenance)

## Quick Setup

### Complete SQL Setup Script

Run this in Supabase SQL Editor to create all tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT DEFAULT 'website',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- VENDOR REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vendor_registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  notes TEXT
);

-- =====================================================
-- INFO BANNER SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS info_banner_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  typewriter_enabled BOOLEAN DEFAULT true,
  background_color TEXT DEFAULT '#000000',
  text_color TEXT DEFAULT '#ffffff',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT
);

-- =====================================================
-- SMTP SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS smtp_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_secure BOOLEAN DEFAULT false,
  smtp_user TEXT NOT NULL,
  smtp_pass TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  reply_to TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EMAIL TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_type TEXT CHECK (template_type IN ('marketing', 'transactional', 'notification')),
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EMAIL CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed', 'paused')),
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  total_recipients INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- EMAIL LOGS TABLE (for tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  status TEXT CHECK (status IN ('sent', 'failed', 'bounced', 'opened', 'clicked')),
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- PRODUCTS TABLE (for future use)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  subcategory TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ORDERS TABLE (for future use)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  shipping_address JSONB,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_vendor_status ON vendor_registrations(status);
CREATE INDEX IF NOT EXISTS idx_vendor_email ON vendor_registrations(email);
CREATE INDEX IF NOT EXISTS idx_campaign_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign ON email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert default banner
INSERT INTO info_banner_settings (text, is_visible, typewriter_enabled)
VALUES ('Welcome to MAGR Store - Shop the best deals today! 🎉 Free shipping on orders over $50!', true, true)
ON CONFLICT DO NOTHING;

-- Insert sample email templates
INSERT INTO email_templates (name, subject, content, template_type) VALUES
('welcome', 'Welcome to MAGR Store!', 
'<h1>Welcome {{name}}!</h1><p>Thank you for subscribing to our newsletter. Get ready for amazing deals!</p>', 
'marketing'),
('order_confirmation', 'Order Confirmation - {{order_number}}',
'<h1>Thank you for your order!</h1><p>Your order {{order_number}} has been confirmed.</p>',
'transactional'),
('shipping_notification', 'Your order has been shipped!',
'<h1>Good news!</h1><p>Your order is on its way. Track it here: {{tracking_link}}</p>',
'notification')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_banner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC ACCESS POLICIES
-- =====================================================

-- Anyone can read banner settings
CREATE POLICY "Anyone can read banner settings" ON info_banner_settings
  FOR SELECT USING (true);

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Anyone can register as vendor
CREATE POLICY "Anyone can register as vendor" ON vendor_registrations
  FOR INSERT WITH CHECK (true);

-- Anyone can read active products
CREATE POLICY "Anyone can read active products" ON products
  FOR SELECT USING (is_active = true);

-- =====================================================
-- ADMIN/SERVICE ROLE POLICIES
-- =====================================================

-- These policies allow full access when using service role key
-- In production, replace with proper authentication-based policies

CREATE POLICY "Service role full access newsletters" ON newsletter_subscribers
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access vendors" ON vendor_registrations
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access banner" ON info_banner_settings
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access smtp" ON smtp_settings
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access templates" ON email_templates
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access campaigns" ON email_campaigns
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access logs" ON email_logs
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access products" ON products
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access orders" ON orders
  USING (true) WITH CHECK (true);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_info_banner_updated_at BEFORE UPDATE ON info_banner_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smtp_updated_at BEFORE UPDATE ON smtp_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Detailed Table Schemas

### Newsletter Subscribers

Stores email addresses of newsletter subscribers.

**Fields:**
- `id` - Unique identifier (UUID)
- `email` - Subscriber email (unique, required)
- `subscribed_at` - Subscription timestamp
- `status` - active | unsubscribed
- `source` - Where they subscribed from
- `metadata` - Additional data (JSON)

**Usage:**
```javascript
// Subscribe
const { data, error } = await supabase
  .from('newsletter_subscribers')
  .insert({ email: 'user@example.com', source: 'footer' });

// Get all active subscribers
const { data } = await supabase
  .from('newsletter_subscribers')
  .select('*')
  .eq('status', 'active');
```

### Vendor Registrations

Stores vendor/seller registration applications.

**Fields:**
- `id` - Unique identifier
- `business_name` - Company/business name
- `contact_name` - Contact person
- `email` - Contact email
- `phone` - Contact phone
- `business_type` - Type of business
- `description` - Business description
- `website` - Business website
- `status` - pending | approved | rejected | under_review
- `submitted_at` - Submission timestamp

**Usage:**
```javascript
// Get pending applications
const { data } = await supabase
  .from('vendor_registrations')
  .select('*')
  .eq('status', 'pending')
  .order('submitted_at', { ascending: false });

// Approve vendor
const { data, error } = await supabase
  .from('vendor_registrations')
  .update({ 
    status: 'approved',
    reviewed_at: new Date(),
    reviewed_by: 'admin'
  })
  .eq('id', vendorId);
```

### Email Campaigns

Stores email marketing campaigns.

**Fields:**
- `id` - Unique identifier
- `name` - Campaign name
- `subject` - Email subject
- `content` - Email body (HTML)
- `status` - draft | scheduled | sending | sent | failed
- `sent_count` - Number of emails sent
- `total_recipients` - Total recipients
- `opened_count` - Tracking opens
- `clicked_count` - Tracking clicks

**Usage:**
```javascript
// Create campaign
const { data } = await supabase
  .from('email_campaigns')
  .insert({
    name: 'Summer Sale 2024',
    subject: 'Up to 50% Off Summer Items!',
    content: '<html>...</html>',
    status: 'draft'
  });

// Get campaign stats
const { data } = await supabase
  .from('email_campaigns')
  .select('*')
  .eq('id', campaignId)
  .single();
```

## Row Level Security

### Understanding RLS

Row Level Security ensures users can only access data they're authorized to see.

### Current Policies

1. **Public Read Access:**
   - Banner settings
   - Active products

2. **Public Write Access:**
   - Newsletter subscriptions
   - Vendor registrations

3. **Admin Access:**
   - Full access to all tables
   - Uses service role key

### Adding Authentication-Based Policies

For production, implement user authentication:

```sql
-- Example: Users can only see their own orders
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT
  USING (auth.uid()::text = customer_id);

-- Admins can see all orders
CREATE POLICY "Admins see all orders" ON orders
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

## Sample Data

### Add Sample Newsletter Subscribers

```sql
INSERT INTO newsletter_subscribers (email, source) VALUES
('customer1@example.com', 'popup'),
('customer2@example.com', 'footer'),
('customer3@example.com', 'checkout')
ON CONFLICT (email) DO NOTHING;
```

### Add Sample Vendors

```sql
INSERT INTO vendor_registrations (
  business_name, contact_name, email, phone, business_type, description
) VALUES
('TechGear Solutions', 'John Doe', 'john@techgear.com', '+1234567890', 'Electronics', 'Premium electronics retailer'),
('Fashion Hub', 'Jane Smith', 'jane@fashionhub.com', '+0987654321', 'Fashion', 'Trendy fashion boutique')
ON CONFLICT DO NOTHING;
```

### Add Sample Products

```sql
INSERT INTO products (name, description, price, original_price, category, image_url, stock, sku) VALUES
('Wireless Headphones', 'High-quality Bluetooth headphones', 79.99, 129.99, 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 50, 'WH-001'),
('Cotton T-Shirt', 'Comfortable cotton t-shirt', 19.99, 29.99, 'Fashion', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 100, 'TS-001'),
('Running Shoes', 'Professional running shoes', 89.99, 149.99, 'Sports', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 30, 'RS-001')
ON CONFLICT (sku) DO NOTHING;
```

## Backup and Restore

### Automated Backups

Supabase automatically backs up your database daily.

**Access Backups:**
1. Go to Supabase Dashboard
2. Click "Database" → "Backups"
3. View available backups
4. Click "Restore" to restore from backup

### Manual Backup

```bash
# Using pg_dump (requires postgres client)
pg_dump -h db.yourproject.supabase.co -U postgres -d postgres > backup.sql

# Restore
psql -h db.yourproject.supabase.co -U postgres -d postgres < backup.sql
```

### Export Data to CSV

In Supabase Dashboard:
1. Go to Table Editor
2. Select table
3. Click "..." → "Export to CSV"

## Database Maintenance

### Monitor Database Size

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Clean Old Data

```sql
-- Delete old email logs (older than 90 days)
DELETE FROM email_logs
WHERE sent_at < NOW() - INTERVAL '90 days';

-- Archive old orders
INSERT INTO orders_archive
SELECT * FROM orders
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM orders
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Optimize Performance

```sql
-- Analyze tables for better query planning
ANALYZE newsletter_subscribers;
ANALYZE vendor_registrations;
ANALYZE email_campaigns;
ANALYZE products;
ANALYZE orders;

-- Vacuum to reclaim space
VACUUM FULL newsletter_subscribers;
```

### Monitor Queries

In Supabase Dashboard:
1. Go to "Database" → "Query Performance"
2. View slow queries
3. Optimize based on insights

## Troubleshooting

### Connection Issues

**Error**: "Could not connect to database"
**Solution**: Check Supabase project status and credentials

### Permission Errors

**Error**: "Permission denied for table"
**Solution**: Check RLS policies and service role key

### Slow Queries

**Solution**: Add indexes on frequently queried columns

```sql
CREATE INDEX idx_custom ON table_name(column_name);
```

### Storage Limits

Free tier: 500MB
**Solution**: Upgrade plan or clean old data

## Best Practices

1. ✅ Always use parameterized queries (prevents SQL injection)
2. ✅ Enable RLS on all tables
3. ✅ Create backups before major changes
4. ✅ Monitor database size regularly
5. ✅ Use indexes on frequently queried columns
6. ✅ Clean up old data periodically
7. ✅ Use transactions for related operations
8. ✅ Document schema changes
9. ✅ Test queries in development first
10. ✅ Monitor query performance

## Next Steps

- ✅ Set up automated backups
- ✅ Configure monitoring alerts
- ✅ Implement user authentication
- ✅ Create custom RLS policies
- ✅ Set up replication (for production)
- ✅ Document your schema

---

**Your database is now set up!** For more information, see the [Supabase Documentation](https://supabase.com/docs).
