# Deployment Guide - MAGR Store

This guide covers deploying your MAGR Store to various hosting platforms.

## Table of Contents

1. [Vercel Deployment (Recommended)](#vercel-deployment)
2. [Netlify Deployment](#netlify-deployment)
3. [Self-Hosting (VPS/Dedicated Server)](#self-hosting)
4. [Environment Variables for Production](#environment-variables-for-production)
5. [Custom Domain Setup](#custom-domain-setup)
6. [SSL Certificate](#ssl-certificate)
7. [Post-Deployment Checklist](#post-deployment-checklist)

## Vercel Deployment

Vercel is the recommended platform - it's made by the creators of Next.js and offers excellent performance.

### Prerequisites
- GitHub account
- Vercel account (free - sign up at vercel.com)
- Your code pushed to GitHub

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/magr-store.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add these variables:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site will be live at `your-project.vercel.app`

### Automatic Deployments

Every push to `main` branch will automatically deploy!

### Custom Domain on Vercel

1. Go to "Settings" → "Domains"
2. Add your domain
3. Follow DNS configuration instructions
4. SSL is automatic!

---

## Netlify Deployment

Netlify is another excellent option with generous free tier.

### Step 1: Push to GitHub

Same as Vercel - ensure your code is on GitHub.

### Step 2: Import to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 3: Add Environment Variables

1. Go to "Site settings" → "Environment variables"
2. Add:

```
VITE_SUPABASE_URL = your_supabase_url
VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
```

### Step 4: Deploy

1. Click "Deploy site"
2. Wait 2-3 minutes
3. Your site will be live at `your-site.netlify.app`

### Custom Domain on Netlify

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS instructions
4. SSL is automatic!

### Netlify Configuration File

Create `netlify.toml` in your root directory:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## Self-Hosting

Deploy to your own VPS or dedicated server.

### Prerequisites
- VPS with Ubuntu 20.04+ (DigitalOcean, AWS EC2, Linode, etc.)
- Domain name pointed to your server
- SSH access to server

### Step 1: Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install nginx
sudo apt install nginx -y

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Clone and Build

```bash
# Create directory
mkdir -p /var/www/magr-store
cd /var/www/magr-store

# Clone your repository
git clone https://github.com/yourusername/magr-store.git .

# Install dependencies
npm install

# Create .env.local
nano .env.local
```

Add your environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Build the application
npm run build
```

### Step 3: Nginx Configuration

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/magr-store
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    root /var/www/magr-store/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/magr-store /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 4: SSL Certificate with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is automatic with certbot
```

### Step 5: Firewall Setup

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Updating Your Deployment

```bash
cd /var/www/magr-store
git pull
npm install
npm run build
sudo systemctl restart nginx
```

---

## Environment Variables for Production

### Required Variables

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration (Optional but recommended)
VITE_APP_NAME=MAGR Store
VITE_APP_URL=https://your-domain.com
```

### Optional Variables

```env
# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_CHAT=true
VITE_ENABLE_NEWSLETTER=true
```

### Security Best Practices

1. **Never commit `.env` files** to git
2. **Use different keys** for development and production
3. **Rotate keys regularly** (every 90 days)
4. **Use Supabase's RLS** (Row Level Security) for data protection
5. **Enable HTTPS only** in production

---

## Custom Domain Setup

### DNS Configuration

Point your domain to your hosting:

#### For Vercel/Netlify
1. Get the DNS records from hosting provider
2. Add to your domain registrar:
   - **Type**: A or CNAME
   - **Name**: @ or www
   - **Value**: (provided by host)

#### For Self-Hosted
Add these records:

```
Type: A
Name: @
Value: your-server-ip

Type: A
Name: www
Value: your-server-ip
```

### Verification

```bash
# Check DNS propagation
nslookup your-domain.com

# Or use online tool
https://dnschecker.org
```

DNS propagation can take 24-48 hours.

---

## SSL Certificate

### Automatic SSL (Vercel/Netlify)
SSL is automatic and free with Vercel and Netlify!

### Manual SSL (Self-Hosted)
Use Let's Encrypt (covered in self-hosting section)

### Verify SSL

1. Visit `https://your-domain.com`
2. Click padlock icon in browser
3. Check certificate validity

---

## Post-Deployment Checklist

### Functionality Tests
- [ ] Homepage loads correctly
- [ ] All product sections work
- [ ] Cart functionality works
- [ ] Search works
- [ ] Newsletter signup works
- [ ] Admin panel accessible
- [ ] Database connections work
- [ ] Email sending works (if configured)

### Performance Tests
- [ ] Run Lighthouse audit (aim for 90+ score)
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Check loading speed (should be < 3s)
- [ ] Verify images load properly

### Security Tests
- [ ] HTTPS working (green padlock)
- [ ] Environment variables not exposed
- [ ] Admin panel password protected
- [ ] Supabase RLS policies active
- [ ] No sensitive data in console logs

### SEO Setup
- [ ] Add Google Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Add meta descriptions
- [ ] Verify social sharing previews
- [ ] Check robots.txt

### Monitoring Setup
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Set up analytics (Google Analytics)
- [ ] Configure Supabase monitoring

### Backups
- [ ] Enable Supabase backups
- [ ] Create git repository backup
- [ ] Document deployment process
- [ ] Save all credentials securely

---

## Platform Comparison

| Feature | Vercel | Netlify | Self-Hosted |
|---------|--------|---------|-------------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Free Tier** | Yes | Yes | No (VPS cost) |
| **Auto SSL** | Yes | Yes | Manual |
| **Auto Deploy** | Yes | Yes | Manual |
| **Custom Domain** | Free | Free | Free |
| **Build Minutes** | 6000/month | 300/month | Unlimited |
| **Bandwidth** | 100GB/month | 100GB/month | Unlimited |
| **Best For** | Most users | Most users | Advanced users |

### Recommendation

- **For most users**: Use **Vercel** (easiest, best performance)
- **For budget-conscious**: Use **Netlify** (generous free tier)
- **For full control**: Use **Self-Hosting** (requires technical knowledge)

---

## Troubleshooting Deployment

### Build Fails

**Error**: "Module not found"
**Solution**: 
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error**: "Out of memory"
**Solution**: Increase Node memory:
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Environment Variables Not Working

**Solution**: 
- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check variable names (case-sensitive)

### 404 Errors on Refresh

**Solution**: Add redirect rules:

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** - Create `_redirects` in `public/`:
```
/*    /index.html   200
```

---

## Production Optimization

### 1. Enable Caching

Headers for static assets:
```
Cache-Control: public, max-age=31536000, immutable
```

### 2. Enable Compression

Gzip/Brotli compression (automatic on Vercel/Netlify)

### 3. Image Optimization

- Use WebP format when possible
- Compress images before upload
- Use Unsplash for stock images (already optimized)

### 4. Code Splitting

Already implemented via React lazy loading!

### 5. CDN

Automatic with Vercel/Netlify (100+ edge locations)

---

## Next Steps After Deployment

1. ✅ Set up monitoring
2. ✅ Configure analytics
3. ✅ Set up automated backups
4. ✅ Create deployment documentation
5. ✅ Train team on updates
6. ✅ Plan marketing launch
7. ✅ Set up customer support
8. ✅ Create content calendar
9. ✅ Launch! 🚀

---

**Your store is now live!** 🎉

Remember to monitor performance and user feedback, and iterate based on data.
