# My Portfolio - Location Tracking Website

This repository contains a professional portfolio website that requests visitor location permission, captures geolocation data, and stores visitor information such as coordinates, timestamps, and browser details.

## Overview

The project is split into a frontend and a backend:

- Frontend: a Bootstrap-based portfolio page with geolocation prompts and a graceful error experience
- Backend: an Express.js API that stores incoming visitor data in MySQL
- Database: MySQL table named visitor_locations

## Features

- Responsive portfolio layout
- Location permission prompt on first load
- Browser detection for Chrome, Firefox, Safari, Edge, Opera, and IE
- IST timestamp recording
- API endpoint for saving visitor data
- Deployment-ready structure for Netlify + Render

## Project Structure

```text
My-Portfolio/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── scripts.js
│   └── netlify.toml
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── render.yaml
│   └── .env.example
└── README.md
```

## Local Development

### Prerequisites

- Node.js 14+
- npm
- A MySQL database

### Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Create or update backend/.env with your database credentials:

```env
DB_HOST=your_host
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=3000
NODE_ENV=development
```

The backend will start on http://localhost:3000.

### Frontend access

Open the frontend in a browser, or serve the portfolio through the backend if desired. When the page loads, allow location access to continue.

## API Endpoint

### POST /api/location

Request body:

```json
{
  "latitude": 18.607491,
  "longitude": 73.763145,
  "timestamp": "5/4/2026",
  "browser": "Chrome 146"
}
```

The server stores the location data in the visitor_locations table.

## Deployment

### Recommended setup

- Frontend: Netlify
- Backend: Render
- Database: Railway or another MySQL provider

### Frontend configuration

Set the backend URL for production in the frontend environment. The frontend code expects a value such as:

```env
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

### Backend configuration

Ensure the backend receives the same database environment variables in production.

## Architecture Summary

1. The user visits the portfolio site.
2. The browser requests location permission.
3. If permission is granted, the frontend collects coordinates and browser details.
4. The frontend sends the information to the backend API.
5. The backend stores the data in MySQL.

## Troubleshooting

### Server does not start

```bash
cd backend
npm install
npm start
```

### Database connection fails

- Verify the values in backend/.env
- Confirm the MySQL service is reachable
- Ensure the database user has permission to create tables

### Location request fails

- Ensure the browser allows location permissions
- Reload the page and try again
- Check the browser console for error details

## Notes

This repository is intentionally organized so the frontend and backend can be deployed separately. The frontend can be hosted as a static site while the backend handles API requests and persistence.
