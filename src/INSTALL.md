# 💻 MAGR Store - Installation Instructions

## Choose Your Operating System

- [Windows](#windows-installation)
- [macOS](#macos-installation)
- [Linux](#linux-installation)

---

## Windows Installation

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/
2. Choose "LTS" version (recommended)
3. Run the installer
4. Accept all defaults
5. Restart your computer

**Verify installation:**
- Press `Win + R`
- Type `cmd` and press Enter
- Type: `node --version`
- Should show: `v18.x.x` or higher

### Step 2: Extract Files

1. Right-click the downloaded ZIP file
2. Choose "Extract All"
3. Select a location (e.g., `C:\magr-store`)
4. Click "Extract"

### Step 3: Open Command Prompt

1. Open the extracted folder
2. Hold `Shift` and right-click in empty space
3. Choose "Open PowerShell window here" or "Open command window here"

### Step 4: Install Dependencies

In the command prompt, type:
```bash
npm install
```

Wait 2-3 minutes for installation to complete.

### Step 5: Setup Supabase

1. Go to https://supabase.com
2. Create account (free)
3. Create new project
4. Wait 2-3 minutes for setup
5. Go to Settings → API
6. Copy your:
   - Project URL
   - anon public key

### Step 6: Create Environment File

1. In your project folder, create a file named `.env.local`
2. Right-click → New → Text Document
3. Rename to `.env.local` (remove .txt extension)
4. Open with Notepad
5. Add these lines (paste your values):

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

6. Save and close

### Step 7: Setup Database

1. In Supabase, click "SQL Editor"
2. Click "New Query"
3. Open `supabase-setup.sql` file in Notepad
4. Copy all content
5. Paste in Supabase SQL Editor
6. Click "Run"

### Step 8: Start Development Server

In command prompt:
```bash
npm run dev
```

Open browser and go to: http://localhost:5173

### 🎉 Done!

---

## macOS Installation

### Step 1: Install Node.js

**Option A: Using Installer**
1. Download from https://nodejs.org/
2. Choose "LTS" version
3. Open the .pkg file
4. Follow installation wizard

**Option B: Using Homebrew (if installed)**
```bash
brew install node
```

**Verify installation:**
Open Terminal (Cmd + Space, type "Terminal"):
```bash
node --version
```

### Step 2: Extract Files

1. Double-click the downloaded ZIP file
2. Move extracted folder to your preferred location
3. Example: `/Users/yourname/magr-store`

### Step 3: Open Terminal

1. Open Terminal (Cmd + Space, type "Terminal")
2. Navigate to project folder:
```bash
cd /Users/yourname/magr-store
```

Or:
1. In Finder, right-click the folder
2. Services → New Terminal at Folder

### Step 4: Install Dependencies

```bash
npm install
```

Wait 2-3 minutes.

### Step 5: Setup Supabase

1. Go to https://supabase.com
2. Create account (free)
3. Create new project
4. Wait 2-3 minutes
5. Go to Settings → API
6. Copy Project URL and anon key

### Step 6: Create Environment File

In Terminal:
```bash
touch .env.local
open -a TextEdit .env.local
```

Add these lines:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Save (Cmd + S) and close.

### Step 7: Setup Database

1. In Supabase, click "SQL Editor"
2. Click "New Query"
3. In Terminal:
```bash
cat supabase-setup.sql | pbcopy
```
This copies the SQL to clipboard
4. Paste in Supabase SQL Editor (Cmd + V)
5. Click "Run"

### Step 8: Start Development Server

```bash
npm run dev
```

Open browser: http://localhost:5173

### 🎉 Done!

---

## Linux Installation

### Step 1: Install Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Fedora/RHEL/CentOS:**
```bash
sudo dnf install nodejs
```

**Arch Linux:**
```bash
sudo pacman -S nodejs npm
```

**Verify installation:**
```bash
node --version
npm --version
```

### Step 2: Extract Files

```bash
unzip magr-store.zip -d ~/magr-store
cd ~/magr-store
```

Or use your desktop's file manager.

### Step 3: Install Dependencies

```bash
cd ~/magr-store
npm install
```

### Step 4: Setup Supabase

1. Go to https://supabase.com
2. Create account (free)
3. Create new project
4. Wait 2-3 minutes
5. Go to Settings → API
6. Copy Project URL and anon key

### Step 5: Create Environment File

```bash
nano .env.local
```

Or use your preferred text editor (vim, gedit, etc.)

Add these lines:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Save:
- nano: `Ctrl + X`, then `Y`, then `Enter`
- vim: `Esc`, then `:wq`, then `Enter`

### Step 6: Setup Database

```bash
cat supabase-setup.sql
```

Copy the output.

1. In Supabase, click "SQL Editor"
2. Click "New Query"
3. Paste the copied SQL
4. Click "Run"

### Step 7: Start Development Server

```bash
npm run dev
```

Open browser: http://localhost:5173

### 🎉 Done!

---

## 🐛 Common Installation Issues

### "npm: command not found"
**Solution:** Node.js not installed or not in PATH
- Reinstall Node.js
- Restart terminal/computer
- Verify: `node --version`

### "Permission denied" (Linux/macOS)
**Solution:** Use sudo or fix npm permissions
```bash
sudo npm install
```

Or fix permissions:
```bash
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER .
```

### Port 5173 already in use
**Solution:** Kill process or change port

Kill process:
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

Or change port in `vite.config.ts`

### Module not found errors
**Solution:** Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

Windows:
```bash
rmdir /s node_modules
del package-lock.json
npm install
```

### Build fails
**Solution:** Check Node.js version
```bash
node --version
```
Should be v16 or higher. If not, update Node.js.

### TypeScript errors
**Solution:** Ensure TypeScript is installed
```bash
npm install --save-dev typescript
```

---

## 📞 Need Help?

### Before Asking for Help:
1. Check error message carefully
2. Try restarting terminal
3. Try reinstalling dependencies
4. Check Node.js version

### Help Resources:
- `TROUBLESHOOTING.md` - Common problems
- `QUICK_START.md` - Setup guide
- `README.md` - Full documentation

### Still Stuck?
- Check your Supabase credentials
- Verify `.env.local` file exists and has correct values
- Make sure port 5173 is not blocked by firewall
- Try in a different browser

---

## ✅ Installation Checklist

- [ ] Node.js installed (v16+)
- [ ] Project files extracted
- [ ] Terminal opened in project folder
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Database setup (ran SQL script)
- [ ] `.env.local` file created
- [ ] Environment variables added
- [ ] Development server starts (`npm run dev`)
- [ ] Site opens in browser

---

## 🚀 What's Next?

After successful installation:

1. **Change Admin Password**
   - Click Settings (bottom-left)
   - Login: `admin@magrstore.com` / `admin123`
   - Change password immediately

2. **Setup SMTP for Emails**
   - Admin Panel → Email Settings
   - Add SMTP credentials
   - Test connection

3. **Customize Your Store**
   - See `CUSTOMIZATION_GUIDE.md`
   - Edit products in `App.tsx`
   - Change colors in `styles/globals.css`

4. **Deploy to Production**
   - See `DEPLOYMENT_PACKAGE.md`
   - Choose hosting platform
   - Follow deployment guide

---

## 🎉 Congratulations!

Your MAGR Store is installed and running locally!

**Next Steps:**
- Explore the admin panel
- Test all features
- Customize branding
- Add your products
- Deploy to production

**Happy Selling! 🛍️**
