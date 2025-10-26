# 🚀 MAGR Store - 5-Minute Quick Start

Get your store running in 5 minutes!

## Step 1: Install Node.js (if not installed)
Download from: https://nodejs.org/ (Choose LTS version)

## Step 2: Extract and Open Project
1. Extract all files to a folder
2. Open terminal/command prompt in that folder

## Step 3: Install Dependencies
```bash
npm install
```
Wait 1-2 minutes for installation to complete.

## Step 4: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up (free)
4. Create a new project (choose any name)
5. Wait 2-3 minutes for setup

## Step 5: Get Supabase Credentials
In Supabase dashboard:
1. Click on your project
2. Go to Settings (gear icon) > API
3. Copy:
   - `Project URL`
   - `anon/public key`

## Step 6: Setup Database
1. In Supabase, go to SQL Editor
2. Click "New Query"
3. Copy entire content from `supabase-setup.sql` file
4. Paste and click "Run"
5. You should see "✅ Setup completed successfully!"

## Step 7: Configure Environment
1. Create a file named `.env.local` in the project root
2. Add these lines (paste your actual values):

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 8: Run the Store
```bash
npm run dev
```

Open browser and go to: http://localhost:5173

## 🎉 You're Done!

### What's Next?

**1. Change Admin Password**
- Click Settings icon (bottom-left)
- Login: `admin@magrstore.com` / `admin123`
- Go to Profile > Change Password
- **IMPORTANT: Change this immediately!**

**2. Setup Email (SMTP)**
- In admin panel, click "Email Settings"
- Add your SMTP details (see DEPLOYMENT_PACKAGE.md for provider recommendations)
- Test connection

**3. Customize Your Store**
- Edit Info Banner from admin panel
- Add/edit products in `App.tsx`
- Change colors in `styles/globals.css`

**4. Deploy to Production**
- See DEPLOYMENT_PACKAGE.md for detailed deployment options
- Recommended: Netlify (easiest) or Vercel

## 🆘 Having Issues?

### Can't install packages?
```bash
npm cache clean --force
npm install
```

### Port 5173 already in use?
Edit `vite.config.ts` and change port to 5174

### Database connection error?
- Check your `.env.local` file
- Ensure Supabase credentials are correct
- Verify Supabase project is active

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Full Documentation
See `DEPLOYMENT_PACKAGE.md` for complete documentation.

## 🎯 Key Files to Know

- `App.tsx` - Main application, edit products here
- `styles/globals.css` - Change colors and styling
- `.env.local` - Environment variables (don't commit this!)
- `components/` - All React components
- `supabase-setup.sql` - Database schema

---

**Need help?** Check the `/docs` folder for detailed guides.
