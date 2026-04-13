const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');

dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
require('./db/conn');

// ✅ CORS FIX (IMPORTANT)
app.use(cors({
    origin: "https://codo-file.vercel.app", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ✅ Extra headers (for safety)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://codo-file.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// Middleware
app.use(express.json());

// Routes
app.use(require('./router/auth'));

// ✅ Correct logging (no localhost in production)
const consoleURL = (req, res, next) => {
    console.log(`User at URL: ${req.headers.host}${req.url}`);
    next();
};

// Home route
app.get('/', consoleURL, (req, res) => {
    res.send('Hello world');
});

// 404 route
app.get('*', consoleURL, (req, res) => {
    res.status(404).send(`
        <center>
            <h1>404</h1>
            <h3>The Page you are Looking for is Not Found</h3>
        </center>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
