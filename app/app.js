const express = require('express');
const cors = require('cors');

// Import routes
const eventRoutes = require("./routes/eventRoutes");
const authroutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRouter = require("./routes/notificationRoutes");


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authroutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRouter);

module.exports = app;