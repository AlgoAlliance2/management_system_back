const express = require('express');
const cors = require('cors');

// Import routes
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

module.exports = app;
