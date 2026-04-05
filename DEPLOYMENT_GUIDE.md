# Deployment Guide: Netlify (Frontend) + Render (Backend)

Complete step-by-step guide to deploy your portfolio to production using Netlify for frontend and Render for backend.

## 📋 Overview

- **Frontend**: Netlify (free tier available)
- **Backend**: Render (free tier available)
- **Database**: Railway (you already have this set up)

---

## PART 1: PREPARE YOUR CODE FOR PRODUCTION

### Step 1.1: Update Frontend API Endpoint

**File**: `frontend/scripts.js`

Replace the hardcoded localhost URL with an environment-based URL:

```javascript
// OLD (Line ~210):
const response = await fetch('http://localhost:3000/api/location', {

// NEW:
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const response = await fetch(`${backendURL}/api/location`, {
```

**Complete Updated Section** (Lines 200-220):

```javascript
        const { latitude, longitude } = position.coords;

        // Get current IST time
        const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Get browser information
        const browser = detectBrowser();

        console.log('Sending location data:', { latitude, longitude, timestamp: istTime, browser });

        // Use backend URL from environment or default to localhost
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
        
        // Send location to server
        const response = await fetch(`${backendURL}/api/location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude, timestamp: istTime, browser }),
        });

        console.log('Response status:', response.status);
```

### Step 1.2: Update Backend Static File Serving

**File**: `backend/server.js`

Remove static file serving (no longer needed - Netlify serves frontend):

```javascript
// REMOVE THIS LINE:
app.use(express.static('../frontend'));
```

**Why?** Render will only run the backend API, not serve static files. Netlify will serve your frontend separately.

### Step 1.3: Create `.env.example` for Backend

**File**: `backend/.env.example`

Create a template for environment variables:

```env
# Database Configuration
DB_HOST=your_railway_host
DB_PORT=your_railway_port
DB_USER=root
DB_PASSWORD=your_railway_password
DB_NAME=railway

# Server Configuration
PORT=3000
NODE_ENV=production
```

### Step 1.4: Create Netlify Configuration File

**File**: `frontend/netlify.toml`

Create this file in the frontend directory:

```toml
# Netlify Configuration
[build]
  command = "# No build needed - static site"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 1.5: Create Render Configuration File

**File**: `backend/render.yaml`

Create this file in the backend directory:

```yaml
services:
  - type: web
    name: my-portfolio-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: DB_HOST
        scope: all
      - key: DB_PORT
        scope: all
      - key: DB_USER
        scope: all
      - key: DB_PASSWORD
        scope: all
      - key: DB_NAME
        scope: all
      - key: NODE_ENV
        value: production
```

---

## PART 2: GITHUB SETUP

### Step 2.1: Push to GitHub

```bash
cd d:\STUDY\Github_Projects\My-Portfolio

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for production deployment"

# Add remote (create repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/My-Portfolio.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 2.2: Ensure .gitignore is Correct

**File**: `backend/.gitignore`

Verify this file exists and contains:

```
.env
node_modules/
.vscode/
.idea/
logs/
*.log
dist/
build/
```

**Important**: `.env` should NOT be committed to GitHub (it contains secrets).

---

## PART 3: RENDER BACKEND DEPLOYMENT

### Step 3.1: Create Render Account

1. Go to https://render.com
2. Click "Sign Up" → Use GitHub account
3. Authorize Render to access your GitHub

### Step 3.2: Deploy Backend Service

1. Click "New +" → Select "Web Service"
2. Select your GitHub repository: `My-Portfolio`
3. Configure:
   - **Name**: `my-portfolio-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
   - **Plan**: `Free`

4. Click "Create Web Service" and wait for deployment

### Step 3.3: Add Environment Variables to Render

After service is created, go to "Environment":

Add these variables:

```
DB_HOST = junction.proxy.rlwy.net
DB_PORT = 42468
DB_USER = root
DB_PASSWORD = KkZzjnQRXxKOdDLRnLfjaBKVMRyLGcYE
DB_NAME = railway
PORT = 3000
NODE_ENV = production
```

⚠️ **Copy from your `.env` file - DON'T share these!**

### Step 3.4: Get Your Backend URL

Once deployment is complete, you'll get a URL like:

```
https://my-portfolio-api.onrender.com
```

**Copy this URL** - you'll need it for the frontend!

---

## PART 4: NETLIFY FRONTEND DEPLOYMENT

### Step 4.1: Create Netlify Account

1. Go to https://netlify.com
2. Click "Sign Up" → Use GitHub account
3. Authorize Netlify to access your GitHub

### Step 4.2: Deploy Frontend Site

1. Click "Add new site" → "Import an existing project"
2. Select GitHub → Choose `My-Portfolio` repository
3. Configure:
   - **Owner**: Your GitHub username
   - **Repository**: `My-Portfolio`
   - **Branch to deploy**: `main`
   - **Build command**: `# No build`
   - **Publish directory**: `frontend`

4. Click "Deploy site"

### Step 4.3: Add Environment Variables to Netlify

1. Go to your Netlify site settings
2. Click "Build & Deploy" → "Environment"
3. Add new variable:
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: `https://my-portfolio-api.onrender.com` (from Step 3.4)

4. Trigger a redeploy:
   - Go to "Deploys"
   - Click "Trigger deploy" → "Deploy site"

### Step 4.4: Get Your Frontend URL

After deployment, Netlify will give you a URL like:

```
https://your-site-name.netlify.app
```

---

## PART 5: VERIFY EVERYTHING WORKS

### Step 5.1: Test Frontend

1. Open your Netlify URL in browser
2. Grant location permission when prompted
3. Check browser console (F12) for any errors

### Step 5.2: Test Backend

1. Open https://my-portfolio-api.onrender.com (you should see a blank page - that's OK)
2. Try the API endpoint with Postman:
   ```
   POST https://my-portfolio-api.onrender.com/api/location
   
   Body:
   {
     "latitude": 18.607491,
     "longitude": 73.763145,
     "browser": "Chrome 120"
   }
   ```

3. Check your database on Railway to see if data is stored

### Step 5.3: Check Database

1. Open https://railway.app
2. Click your project
3. Click "Data" → Connect to MySQL
4. Run query:
   ```sql
   SELECT * FROM visitor_locations ORDER BY id DESC;
   ```

---

## PART 6: CUSTOM DOMAIN (OPTIONAL)

### Frontend Custom Domain

1. Go to Netlify site settings
2. Click "Domain management"
3. Click "Add custom domain"
4. Enter your domain (e.g., `deepak15.dev`)
5. Point DNS to Netlify nameservers

### Backend Custom Domain

1. Go to Render service settings
2. Click "Custom Domains"
3. Add domain
4. Update DNS records

---

## TROUBLESHOOTING

### Issue: "Cannot POST /api/location"

**Solution**: 
- Check backend URL in frontend `.env` variable
- Verify Render backend is running (check Render dashboard)
- Check CORS is enabled in backend

### Issue: "CORS error" in browser console

**Solution**:
Add to `backend/server.js` (if not already there):

```javascript
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false
}));
```

### Issue: Database connection fails on Render

**Solution**:
- Verify environment variables are correct in Render dashboard
- Check Railway database is still running
- Ensure IP whitelist is set correctly on Railway

### Issue: Location data not saving

**Solution**:
- Check browser console for JavaScript errors
- Check Render logs for backend errors
- Verify database permissions

---

## QUICK REFERENCE: CODE CHANGES NEEDED

### 1. `frontend/scripts.js` (Line ~210)

```javascript
// Change from:
const response = await fetch('http://localhost:3000/api/location', {

// To:
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';
const response = await fetch(`${backendURL}/api/location`, {
```

### 2. `backend/server.js` (Remove Line)

```javascript
// DELETE THIS LINE:
app.use(express.static('../frontend'));
```

### 3. Create `backend/.env.example`

```env
DB_HOST=your_railway_host
DB_PORT=your_railway_port
DB_USER=root
DB_PASSWORD=your_railway_password
DB_NAME=railway
PORT=3000
NODE_ENV=production
```

### 4. Create `frontend/netlify.toml`

```toml
[build]
  command = "# No build needed - static site"
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 5. Create `backend/render.yaml`

```yaml
services:
  - type: web
    name: my-portfolio-api
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
```

---

## DEPLOYMENT CHECKLIST

✅ Update frontend API endpoint
✅ Remove static file serving from backend
✅ Create `.env.example` in backend
✅ Create `netlify.toml` in frontend
✅ Create `render.yaml` in backend
✅ Push code to GitHub
✅ Deploy backend to Render
✅ Deploy frontend to Netlify
✅ Add environment variables to both platforms
✅ Test location permission flow
✅ Verify database receives data

---

## MONITORING

### Render Logs
- Go to Render dashboard
- Click service
- Check "Logs" for errors

### Netlify Logs
- Go to Netlify dashboard
- Click site
- Check "Deploys" for build errors

### Database
- Check Railway dashboard
- Query `visitor_locations` table
- Verify data is being stored

---

## NEXT STEPS

1. Make the 5 code changes listed above
2. Push to GitHub
3. Follow the Render and Netlify deployment steps
4. Test the complete flow
5. Monitor logs for errors

Good luck! 🚀
