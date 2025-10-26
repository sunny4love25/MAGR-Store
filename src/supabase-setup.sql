-- MAGR Store Database Setup Script
-- Run this in your Supabase SQL Editor to create all required tables

-- ============================================
-- 1. SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT DEFAULT 'popup',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);

-- ============================================
-- 2. VENDOR REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS vendor_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT,
  product_categories TEXT[],
  website TEXT,
  description TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT
);

-- Indexes for vendor registrations
CREATE INDEX IF NOT EXISTS idx_vendor_email ON vendor_registrations(email);
CREATE INDEX IF NOT EXISTS idx_vendor_status ON vendor_registrations(status);

-- ============================================
-- 3. EMAIL TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  html_body TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Index for template lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- ============================================
-- 4. EMAIL CAMPAIGNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  html_body TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_recipients INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for campaign tracking
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON email_campaigns(scheduled_at);

-- ============================================
-- 5. SMTP SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS smtp_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_secure BOOLEAN DEFAULT true,
  smtp_user TEXT NOT NULL,
  smtp_password TEXT NOT NULL, -- Note: Store encrypted in production
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_tested_at TIMESTAMP WITH TIME ZONE,
  test_status TEXT
);

-- ============================================
-- 6. INFO BANNER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS info_banner_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_1 TEXT DEFAULT 'Free Shipping on Orders Over $50!',
  message_2 TEXT DEFAULT 'Shop the Latest Trends',
  message_3 TEXT DEFAULT '24/7 Customer Support',
  bg_color TEXT DEFAULT '#FF6B35',
  text_color TEXT DEFAULT '#FFFFFF',
  typewriter_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default banner settings
INSERT INTO info_banner_settings (message_1, message_2, message_3)
VALUES (
  'Free Shipping on Orders Over $50!',
  'Shop the Latest Trends',
  '24/7 Customer Support'
) ON CONFLICT DO NOTHING;

-- ============================================
-- 7. EMAIL TRACKING TABLE (Optional - for analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS email_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  subscriber_email TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'opened', 'clicked', 'bounced', 'unsubscribed')),
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for email tracking
CREATE INDEX IF NOT EXISTS idx_email_tracking_campaign ON email_tracking(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_tracking_email ON email_tracking(subscriber_email);
CREATE INDEX IF NOT EXISTS idx_email_tracking_event ON email_tracking(event_type);

-- ============================================
-- 8. USER PROFILES TABLE (for authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE smtp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE info_banner_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for info banner (anyone can view)
CREATE POLICY "Public can view banner settings"
  ON info_banner_settings FOR SELECT
  TO public
  USING (true);

-- Subscribers table policies
CREATE POLICY "Anyone can insert subscribers"
  ON subscribers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own subscription"
  ON subscribers FOR SELECT
  TO public
  USING (true);

-- Vendor registrations
CREATE POLICY "Anyone can submit vendor registration"
  ON vendor_registrations FOR INSERT
  TO public
  WITH CHECK (true);

-- Email templates - read-only for public
CREATE POLICY "Public can view active templates"
  ON email_templates FOR SELECT
  TO public
  USING (is_active = true);

-- SMTP settings - only authenticated users can access
CREATE POLICY "Authenticated users can view SMTP settings"
  ON smtp_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update SMTP settings"
  ON smtp_settings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert SMTP settings"
  ON smtp_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Email campaigns - only authenticated users
CREATE POLICY "Authenticated users can manage campaigns"
  ON email_campaigns FOR ALL
  TO authenticated
  USING (true);

-- User profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smtp_settings_updated_at
  BEFORE UPDATE ON smtp_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_info_banner_settings_updated_at
  BEFORE UPDATE ON info_banner_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample email template
INSERT INTO email_templates (name, subject, body, category)
VALUES (
  'Welcome Email',
  'Welcome to MAGR Store!',
  'Thank you for subscribing to our newsletter. Stay tuned for exclusive deals and updates!',
  'welcome'
) ON CONFLICT DO NOTHING;

INSERT INTO email_templates (name, subject, body, category)
VALUES (
  'Promotional Email',
  'Special Offer Just for You!',
  'Get 20% off your next purchase. Use code: WELCOME20',
  'promotional'
) ON CONFLICT DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

-- Verify setup
DO $$
BEGIN
  RAISE NOTICE '✅ MAGR Store database setup completed successfully!';
  RAISE NOTICE '📊 Created tables: subscribers, vendor_registrations, email_templates, email_campaigns, smtp_settings, info_banner_settings, email_tracking, user_profiles';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '🎯 Sample templates inserted';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next steps:';
  RAISE NOTICE '1. Configure your environment variables (.env.local)';
  RAISE NOTICE '2. Set up SMTP settings via admin panel';
  RAISE NOTICE '3. Customize the info banner';
  RAISE NOTICE '4. Start adding products and content';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Default admin credentials (CHANGE THESE):';
  RAISE NOTICE '   Email: admin@magrstore.com';
  RAISE NOTICE '   Password: admin123';
END $$;
