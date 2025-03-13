const express = require('express');
const app = express();
const port = 3000;

// Parse JSON request body
app.use(express.json());

// Mount the appointments router
const appointmentsRouter = require('./routes/appointments');
app.use('/api/appointments', appointmentsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server runs at http://localhost:${port}`);
});