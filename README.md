# My Portfolio - Location Tracking Website

A professional portfolio website that requests visitor location permission, captures geolocation data, and stores visitor information including coordinates, timestamps, and browser details.

## 🎯 Project Overview

This is a full-stack portfolio website with integrated location tracking. When visitors access the site, they're prompted to share their location. Upon permission:
- ✅ Browser captures coordinates (latitude/longitude)
- ✅ Browser type and version are detected
- ✅ IST timestamp is recorded
- ✅ All data is stored in MySQL database

If visitors decline permission, they see a dedicated error page.

## 📁 Project Structure

The project is organized into **frontend** and **backend** folders for clean separation:

```
My-Portfolio/
├── frontend/
│   ├── index.html          # Portfolio webpage
│   ├── styles.css          # Styling (Bootstrap + custom)
│   ├── scripts.js          # Location capture & browser detection
│   └── netlify.toml        # Netlify deployment config
│
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment template
│   ├── .env                # Actual credentials (create from .env.example)
│   ├── render.yaml         # Render deployment config
│   ├── .gitignore          # Prevent committing .env
│   └── README.md           # Backend documentation
│
├── DEPLOYMENT_STEPS.md     # 📖 START HERE for deployment!
├── DEPLOYMENT_GUIDE.md     # Complete deployment guide
├── QUICK_REFERENCE.md      # Quick cheat sheet
├── ARCHITECTURE.md         # System design diagrams
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm
- MySQL database (local or remote)

### Installation

#### 1. Backend Setup
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your database credentials:
```env
DB_HOST=your_host
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=3000
```

Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm start
```

Server runs on: `http://localhost:3000`

#### 2. Access Portfolio
Open `http://localhost:3000` in your browser

**Allow location permission when prompted!**

---

## 🌐 Deploy to Production

Ready to go live? Your project is configured for easy deployment!

### Deployment Platforms
- **Frontend**: Netlify (fast CDN, automatic deployments)
- **Backend**: Render (Node.js hosting, auto-scaling)
- **Database**: Railway (already configured)

### Deployment Documentation

Choose based on your needs:

1. **NEW TO DEPLOYMENT?** → Read [`DEPLOYMENT_STEPS.md`](./DEPLOYMENT_STEPS.md)
   - Visual step-by-step guide
   - Screenshots and clear instructions
   - Takes ~20 minutes total

2. **WANT FULL DETAILS?** → Read [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
   - Complete technical guide
   - All code changes explained
   - Troubleshooting included

3. **NEED QUICK REFERENCE?** → Read [`QUICK_REFERENCE.md`](./QUICK_REFERENCE.md)
   - One-page cheat sheet
   - Commands and URLs
   - Quick lookup

4. **UNDERSTAND THE ARCHITECTURE?** → Read [`ARCHITECTURE.md`](./ARCHITECTURE.md)
   - System design diagrams
   - Data flow explanation
   - Before/after comparison

### Quick Deployment Checklist

✅ **Code is Ready**
- Frontend API endpoint configured for both local and production
- Backend prepared with Render configuration
- Environment variables template created
- All files ready to push to GitHub

✅ **What You Need**
- GitHub account (free)
- Render account (sign up with GitHub)
- Netlify account (sign up with GitHub)
- Your Railway database credentials (you have this)

✅ **Deployment Time**
- 15-20 minutes to go live
- Fully automated (watch GitHub → Render and Netlify auto-deploy)

**👉 [Start with DEPLOYMENT_STEPS.md for easiest setup!](./DEPLOYMENT_STEPS.md)**

## 📊 Features

### Frontend
- ✅ Professional portfolio layout with Bootstrap 5
- ✅ Location permission popup on page load
- ✅ Full-page error interface for denied permission
- ✅ Geolocation API integration
- ✅ Browser detection (Chrome, Firefox, Safari, Edge, Opera, IE)
- ✅ IST timezone support
- ✅ Responsive design for all devices
- ✅ Smooth animations and transitions

### Backend
- ✅ Express.js REST API
- ✅ MySQL database integration
- ✅ Environment variables management
- ✅ CORS support
- ✅ Automatic table creation
- ✅ Error handling and logging
- ✅ Security best practices

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Bootstrap 5), JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Tools**: npm, dotenv, CORS

## 📋 How It Works

### User Flow
1. **Page Loads** → Location permission popup appears
2. **User Allows** → Browser captures coordinates → Browser detected → Data sent to API → Overlay fades → Portfolio shows
3. **User Declines** → Error page displays with "Retry" button
4. **User Clicks ×** → Same as declining

### Data Captured
- **Latitude** - Visitor's latitude coordinate
- **Longitude** - Visitor's longitude coordinate
- **Date** - Visit date (IST, YYYY-MM-DD format)
- **Time** - Visit time (IST, 12-hour format)
- **Browser** - Browser name and version (e.g., "Chrome 146")

## 🔧 Database

### Table: `visitor_locations`

```sql
CREATE TABLE visitor_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    date VARCHAR(20),
    time VARCHAR(20),
    browser VARCHAR(255)
);
```

## 📡 API Endpoints

### POST /api/location

**Request:**
```json
{
  "latitude": 18.607491,
  "longitude": 73.763145,
  "timestamp": "5/4/2026",
  "browser": "Chrome 146"
}
```

**Response:**
```json
{
  "message": "✅ Location stored successfully",
  "data": {
    "id": 1,
    "latitude": 18.607491,
    "longitude": 73.763145,
    "date": "2026-04-05",
    "time": "02:30:45 PM",
    "browser": "Chrome 146"
  }
}
```

## ⚠️ Troubleshooting

### Server won't start
```bash
# Ensure you're in the backend folder
cd backend

# Install dependencies
npm install

# Start server
npm start
```

### "Cannot find module" error
```bash
cd backend
npm install
```

### Database connection fails
- Verify `.env` file has correct credentials
- Check database is running and accessible
- Ensure user has proper permissions

### Location not being captured
- Check browser console (F12) for errors
- Verify browser location settings
- Ensure HTTPS (production) or localhost (development)
- Grant location permission when prompted
