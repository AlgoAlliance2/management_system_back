require("dotenv").config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

const hostname = "0.0.0.0";
const port = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected22'))
    .catch(err => console.log(err));