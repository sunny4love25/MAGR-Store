# Troubleshooting Guide - MAGR Store

Common issues and their solutions.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Build Errors](#build-errors)
3. [Runtime Errors](#runtime-errors)
4. [Database Issues](#database-issues)
5. [Email Issues](#email-issues)
6. [Deployment Issues](#deployment-issues)
7. [Performance Issues](#performance-issues)

## Installation Issues

### npm install fails

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Don't use sudo! Instead fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Then retry
npm install
```

### Node version incompatible

**Error**: `The engine "node" is incompatible`

**Solution**:
```bash
# Check your node version
node --version

# Should be 18.0.0 or higher
# If not, update Node.js

# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

## Build Errors

### Vite build fails

**Error**: `Module not found`

**Solution**:
```bash
# Ensure all dependencies are installed
npm install

# Check import paths are correct
# All imports should use relative paths: ./components/...

# Clear Vite cache
rm -rf .vite node_modules/.vite

# Retry build
npm run build
```

**Error**: `Out of memory`

**Solution**:
```bash
# Increase Node.js memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### TypeScript errors

**Error**: `Type 'X' is not assignable to type 'Y'`

**Solution**:
1. Check the error message carefully
2. Ensure types match expected interface
3. Add type assertions if needed: `as Type`
4. Check tsconfig.json settings

**Temporary Fix** (not recommended for production):
```bash
# Skip type checking during build
npm run build -- --mode production
```

### Tailwind CSS not working

**Error**: Styles not applying

**Solution**:
1. Check `styles/globals.css` is imported in App.tsx
2. Verify Tailwind classes are correct
3. Clear browser cache
4. Restart dev server

```bash
# Restart dev server
npm run dev
```

## Runtime Errors

### Blank white screen

**Check browser console** (F12 → Console)

**Common causes**:

1. **Supabase not configured**
```javascript
// Error: "Supabase URL is not defined"
// Solution: Check .env.local file exists and has correct values
```

2. **JavaScript error**
```javascript
// Check console for error stack trace
// Fix the specific error shown
```

3. **Missing dependencies**
```bash
npm install
npm run dev
```

### "Failed to fetch" errors

**Error**: Network requests failing

**Solution**:
1. Check internet connection
2. Verify Supabase project is active
3. Check environment variables:

```bash
# Print variables (bash/zsh)
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Windows PowerShell
echo $env:VITE_SUPABASE_URL
```

4. Verify Supabase credentials are correct
5. Check Supabase project status in dashboard

### Component not rendering

**Solutions**:

1. **Check imports**:
```typescript
// ✅ Correct
import { Button } from './components/ui/button';

// ❌ Wrong
import { Button } from 'components/ui/button';
```

2. **Check conditional rendering**:
```typescript
// Make sure conditions are true
{isVisible && <Component />}
```

3. **Check console for errors**:
```javascript
// Look for error messages
```

## Database Issues

### Connection failed

**Error**: "Could not connect to Supabase"

**Solutions**:

1. **Verify credentials**:
   - Go to Supabase dashboard
   - Settings → API
   - Copy URL and anon key again
   - Update .env.local

2. **Check project status**:
   - Go to Supabase dashboard
   - Check if project is active (not paused)
   - Free tier projects pause after 1 week of inactivity

3. **Restart dev server**:
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

### RLS policy errors

**Error**: "row-level security policy violation"

**Solution**:

1. Check RLS policies in Supabase dashboard
2. Ensure service role key is used for admin operations
3. Temporarily disable RLS for testing:

```sql
-- In Supabase SQL Editor
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Data not saving

**Solutions**:

1. **Check table structure**:
   - Verify table exists
   - Check column names match

2. **Check for errors**:
```typescript
const { data, error } = await supabase
  .from('table_name')
  .insert(values);

console.log('Error:', error); // Check this!
```

3. **Verify data format**:
```typescript
// Ensure data matches table schema
const data = {
  email: 'user@example.com', // TEXT
  subscribed_at: new Date(), // TIMESTAMP
  status: 'active' // Must be valid enum value
};
```

## Email Issues

### Emails not sending

**Error**: "SMTP connection failed"

**Solutions**:

1. **Verify SMTP settings**:
   - Check host, port, username, password
   - Test credentials with email client

2. **Check firewall**:
   - Ensure ports 587/465 are open
   - Check server firewall settings

3. **Gmail-specific**:
   - Enable 2FA
   - Use App Password (not account password)
   - Enable "Less secure apps" if needed

4. **Test connection**:
   - Use "Test Connection" in admin panel
   - Check error message details

### Emails going to spam

**Solutions**:

1. **Set up SPF record**:
```
v=spf1 include:_spf.google.com ~all
```

2. **Set up DKIM**:
   - Configure in email provider settings

3. **Use verified domain**:
   - Don't send from @gmail.com in production
   - Use custom domain

4. **Avoid spam triggers**:
   - Don't use ALL CAPS
   - Include unsubscribe link
   - Use reputable SMTP provider

### Template variables not working

**Error**: `{{variable}}` showing in email

**Solution**:

```typescript
// Ensure you're replacing variables
let content = template.content;
content = content.replace('{{name}}', userName);
content = content.replace('{{link}}', link);
```

## Deployment Issues

### Build fails on Vercel/Netlify

**Error**: "Build failed"

**Solutions**:

1. **Check build logs**:
   - Read error message carefully
   - Fix the specific error

2. **Verify environment variables**:
   - Check all variables are set
   - Variables must start with `VITE_`

3. **Check Node version**:
   - Set Node version in deployment settings
   - Use Node 18+

4. **Increase build timeout**:
   - In hosting platform settings
   - Increase to 10 minutes

### 404 on page refresh

**Error**: Page not found when refreshing

**Solution**:

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** - Create `public/_redirects`:
```
/*    /index.html   200
```

**Self-hosted nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Environment variables not working

**Error**: Variables undefined in production

**Solutions**:

1. **Check variable names**:
   - Must start with `VITE_`
   - Are case-sensitive

2. **Redeploy after adding**:
   - Environment changes require redeploy

3. **Check build logs**:
   - Verify variables are being used

## Performance Issues

### Slow page load

**Solutions**:

1. **Enable compression**:
   - Automatic on Vercel/Netlify
   - Configure on self-hosted server

2. **Optimize images**:
   - Use WebP format
   - Compress before upload
   - Use CDN (Unsplash images already optimized)

3. **Check bundle size**:
```bash
npm run build
# Check dist/ folder size
```

4. **Lazy load components**:
```typescript
// Already implemented for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### High memory usage

**Solutions**:

1. **Check for memory leaks**:
   - Clean up event listeners
   - Clear intervals/timeouts
   - Unsubscribe from subscriptions

2. **Optimize re-renders**:
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component code
});
```

3. **Clear cache**:
```bash
# Clear browser cache
# Hard reload: Ctrl+Shift+R (Cmd+Shift+R on Mac)
```

### Database slow queries

**Solutions**:

1. **Add indexes**:
```sql
CREATE INDEX idx_email ON newsletter_subscribers(email);
```

2. **Optimize queries**:
```typescript
// ❌ Fetch all then filter in JS
const all = await supabase.from('products').select('*');
const filtered = all.filter(p => p.active);

// ✅ Filter in database
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('active', true);
```

3. **Use pagination**:
```typescript
const { data } = await supabase
  .from('products')
  .select('*')
  .range(0, 9); // First 10 items
```

## Browser-Specific Issues

### Safari issues

**Problem**: Certain features not working in Safari

**Solutions**:
1. Clear Safari cache
2. Check console for errors
3. Update to latest Safari version
4. Test in private browsing mode

### Mobile browser issues

**Solutions**:
1. Test in mobile device (not just dev tools)
2. Check touch events work
3. Verify responsive design
4. Test on multiple devices

### Cookie consent not showing

**Solutions**:
1. Clear browser cookies
2. Check localStorage
3. Verify CookieConsent component is imported
4. Check browser console for errors

## Getting Help

### Before asking for help:

1. ✅ Check this troubleshooting guide
2. ✅ Read error message carefully
3. ✅ Check browser console for errors
4. ✅ Check network tab for failed requests
5. ✅ Try in incognito/private mode
6. ✅ Clear cache and restart

### What to include when reporting issues:

```
1. What you're trying to do
2. What's happening instead
3. Error messages (full text)
4. Browser and version
5. Node version (node --version)
6. Steps to reproduce
7. Screenshots if relevant
```

### Useful debugging commands:

```bash
# Check Node version
node --version

# Check npm version
npm --version

# View environment variables
printenv | grep VITE

# Check running processes
lsof -i :5173

# Clear all caches
rm -rf node_modules .vite dist
npm cache clean --force
npm install
```

## Still having issues?

1. Check Supabase status page: status.supabase.com
2. Review Supabase logs in dashboard
3. Check Vercel/Netlify deployment logs
4. Review the documentation again
5. Search for similar issues online

---

**Most issues are due to:**
- ❌ Missing environment variables
- ❌ Incorrect Supabase credentials  
- ❌ Not restarting dev server after changes
- ❌ Browser cache
- ❌ Node version too old

**Quick reset:**
```bash
rm -rf node_modules .env.local .vite dist
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```
