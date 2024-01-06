// /var/www/html/bytebloom.tech/express/app.js

require("dotenv").config();
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const stripe = require('stripe')("process.env.TEST_SECRET_KEY");
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const app = express();
const port = 7321;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
}));

// Temporary array stand-in for database
const users = [];

// Routes
app.post("/signupRequest", function(req, res) {
    const requestBody = req.body;
    // Left off here, need to implement a database (kill me)
});                                                

app.post("/loginRequest", function(req, res) {
    // Implement
});

app.post("/create-checkout-session", function(req, res) {
    // Implement
});

app.get("*", function(req, res) {
    // Implement
});

app.listen(port, function() {
    console.log("app.js running");
});
