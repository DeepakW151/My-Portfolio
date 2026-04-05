const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Note: Static file serving removed - Netlify handles frontend separately

// Database connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to DB
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to database');

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS visitor_locations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            date VARCHAR(20),
            time VARCHAR(20),
            browser VARCHAR(255)
        )
    `;

    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('❌ Error creating table:', err);
            return;
        }
        console.log('✅ Table ready');
    });
});

// API endpoint
app.post('/api/location', (req, res) => {
    const { latitude, longitude, browser } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const now = new Date();

    // ✅ IST Date (YYYY-MM-DD)
    const istDate = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now);

    // ✅ IST Time (12-hour format with AM/PM)
    const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(now);

    const query = `
        INSERT INTO visitor_locations 
        (latitude, longitude, date, time, browser) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [latitude, longitude, istDate, istTime, browser], (err, result) => {
        if (err) {
            console.error('❌ Error storing location:', err);
            return res.status(500).json({ error: 'Failed to store location' });
        }

        console.log(`✅ Stored:
ID: ${result.insertId}
Lat: ${latitude}, Lng: ${longitude}
Date: ${istDate}
Time: ${istTime}
Browser: ${browser || 'Unknown'}`);

        res.json({
            message: '✅ Location stored successfully',
            data: {
                id: result.insertId,
                latitude,
                longitude,
                date: istDate,
                time: istTime,
                browser: browser || 'Unknown'
            }
        });
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
