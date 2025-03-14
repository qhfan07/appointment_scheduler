const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Get port and frontend origin from .env
const port = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Configure CORS to allow requests from http://localhost:5173
app.use(cors({
  origin: FRONTEND_ORIGIN, // Allow frontend's address
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
}));

// Parse JSON request body
app.use(express.json());

// Mount the appointments router
const appointmentsRouter = require('./routes/appointments');
app.use('/api/appointments', appointmentsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server runs at http://localhost:${port}`);
});