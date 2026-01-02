const express = require('express');
const cors = require('cors');

// Import routes
const eventRoutes = require("./routes/eventRoutes");
const authroutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const userController = require("./routes/userRoutes");



const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authroutes);
app.use("/api/users", userController);// Work in progres
//app.use("/api/notifications", );//Work in progres
app.use("/api/tickets", ticketRoutes);// experimental version, will need redoing

module.exports = app;