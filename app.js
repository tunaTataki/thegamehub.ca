// /home/nick/projects/theGameHub.Express/app.js

const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const stripe = require('stripe')("process.env.TEST_SECRET_KEY");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Temporary array stand-in for database
const users = [];

// Routes
app.post("/signupRequest", function(req, res) {
    const requestBody = req.body;
    // Left off here, need to implement a database
});                                                

app.post("/loginRequest", function(req, res) {
    // Implement
});

app.post("/create-checkout-session", function(req, res) {
    // Implement
});

app.listen(port, function() {
    console.log("app.js running");
});
