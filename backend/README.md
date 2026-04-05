# Portfolio Location Tracker - Backend

Backend server for the portfolio website that captures and stores visitor location data.

## Project Structure

```
My-Portfolio/
├── frontend/                 # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── scripts.js
├── backend/                  # Backend Node.js server
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── .env                  # (Create this from .env.example)
│   ├── .gitignore
│   └── README.md
└── README.md                 # Main project README
```

## Features

✅ Location permission request on page load  
✅ Visitor geolocation capture (latitude, longitude)  
✅ IST timezone support (India Standard Time)  
✅ Browser detection (Chrome, Firefox, Safari, Edge, Opera, IE)  
✅ MySQL database storage  
✅ REST API endpoint  
✅ Environment variables management  
✅ CORS enabled for cross-origin requests  

## Database Schema

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

### Column Details
- `id` - Unique visitor record ID
- `latitude` - Visitor's latitude coordinate
- `longitude` - Visitor's longitude coordinate  
- `date` - Visit date in YYYY-MM-DD format (IST)
- `time` - Visit time in 12-hour format with AM/PM (IST)
- `browser` - Browser name and version (e.g., "Chrome 125")

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database (local or remote)
- Location tracking enabled in browser

## Installation

### 1. Clone the Repository

```bash
cd My-Portfolio/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
PORT=3000
NODE_ENV=development
```

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

Server will run on `http://localhost:3000`

## API Endpoints

### POST /api/location

Stores visitor location and browser information.

**Request Body:**
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

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing latitude/longitude)
- `500` - Server error

## Troubleshooting

### Issue: "Cannot find module 'dotenv'"
**Solution:** Run `npm install` to install all dependencies

### Issue: Database connection fails
**Solution:** Verify your `.env` file has correct database credentials:
```bash
DB_HOST=junction.proxy.rlwy.net
DB_PORT=46994
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

### Issue: "Unknown column 'date' in field list"
**Solution:** The table is automatically created on first server run. If you already have an older table, create a backup and drop it to let the server recreate it with correct columns.

### Issue: CORS errors
**Solution:** CORS is enabled in the server. Make sure your frontend is making requests to the correct API URL (`http://localhost:3000/api/location`).

### Issue: Location not capturing
**Solution:**
- Browser must have location permission enabled
- User must grant permission when prompted
- Check browser console for geolocation errors
- Some browsers require HTTPS for geolocation (localhost works for testing)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host/IP | `junction.proxy.rlwy.net` |
| `DB_PORT` | Database port | `46994` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `password123` |
| `DB_NAME` | Database name | `portfolio_db` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |

## Security Notes

⚠️ **Never commit `.env` file to version control**  
✅ `.env` is in `.gitignore` for protection  
✅ Use environment variables instead of hardcoding credentials  
✅ Sensitive data should never be in source code  

## Testing the API

### Using curl:

```bash
curl -X POST http://localhost:3000/api/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 18.607491,
    "longitude": 73.763145,
    "timestamp": "5/4/2026",
    "browser": "Chrome 146"
  }'
```

### Using Postman:

1. Create a new POST request
2. URL: `http://localhost:3000/api/location`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "latitude": 18.607491,
  "longitude": 73.763145,
  "timestamp": "5/4/2026",
  "browser": "Chrome 146"
}
```

## Browser Detection

Supported browsers:
- Google Chrome
- Firefox
- Safari
- Microsoft Edge
- Opera
- Internet Explorer

Version numbers are extracted from the User-Agent string.

## Frontend Integration

The frontend (`frontend/scripts.js`) handles:
1. Requesting location permission on page load
2. Capturing coordinates via Geolocation API
3. Detecting browser and version
4. Generating IST timestamps
5. Sending data to `/api/location` endpoint
6. Handling success/error states

## Common Ports

- **3000** - Default Node.js server port
- **3306** - Default MySQL port
- **5432** - Default PostgreSQL port

## Dependencies

```json
{
  "cors": "^2.8.6",              // Enable cross-origin requests
  "dotenv": "^16.0.3",           // Load environment variables
  "express": "^5.2.1",           // Web framework
  "mysql2": "^3.20.0"            // MySQL driver
}
```

## Running in Production

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "portfolio"
   ```
3. Use HTTPS in production
4. Store `.env` securely on the server (not in git)
5. Set up proper database backups
6. Monitor server logs and database performance

## Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [Node.js Best Practices](https://nodejs.org/en/docs)
- [dotenv Documentation](https://github.com/motdotla/dotenv)

## Support

For issues or questions, please check:
1. Server console for error messages
2. `.env` file configuration
3. Database connection status
4. Browser console for frontend errors
5. Network tab for API request/response details

## License

This project is part of a portfolio website. All rights reserved.
