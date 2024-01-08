// /var/www/html/bytebloom.tech/express/app.js

require("dotenv").config();                                             // Secret storage
const express = require("express");                                     // Express
const path = require("path");                                           // For path.join()
const fs = require("fs");                                               // Logging
const bcrypt = require("bcrypt");                                       // Signup and login password hashing
const bodyParser = require("body-parser");                              // URL and JSON parsing
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);   // Payment processing
const cookieParser = require("cookie-parser");                          // Sessions
const expressSession = require("express-session");                      // Sessions
const { v4: uuidv4 } = require("uuid");                                 // Sessions, unique signed cookie user IDs
const { Client } = require("pg");                                       // Postgresql

// Our .env entires may need to be quoted differently

const app = express();
const port = process.env.PORT;
const pgClient = new Client();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
}));

app.use(express.static("public"));

// GET Routes
app.get("/", function(req, res) {
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 86400000,
        });
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- A cookie was created in the / GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    } else {
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- Existing cookie in / GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }

    res.sendFile(path.join(__dirname, "views", "index.html"));
});                                                

app.get("/signup", function(req, res) { 
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 86400000,
        });
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- A cookie was created in the /signup GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    } else {
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- Existing cookie in /signup GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }

    res.sendFile(path.join(__dirname, "views", "signup.html"));
});                                                

app.get("/login", function(req, res) {
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 86400000,
        });
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- A cookie was created in the /login GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    } else {
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- Existing cookie in /login GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }

    res.sendFile(path.join(__dirname, "views", "login.html"));
});                                                

app.get("/store", function(req, res) {
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 86400000,
        });
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- A cookie was created in the /store GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    } else {
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- Existing cookie in /store GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }

    res.sendFile(path.join(__dirname, "views", "store.html"));
    // Implement session logic
});                                                

// POST Routes
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
    // Implement?
});

app.listen(port, function() {
    console.log("app.js running");
});
