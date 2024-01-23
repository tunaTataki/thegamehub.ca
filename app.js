// /var/www/html/bytebloom.tech/express/app.js

require("dotenv").config();                                             // Secret storage
const express = require("express");                                     // Express
const path = require("path");                                           // For path.join()
const fs = require("fs");                                               // Logging
const bcrypt = require("bcrypt");                                       // Signup and login password hashing
const bodyParser = require("body-parser");                              // URL and JSON parsing
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);   // Payment processing
const cookieParser = require("cookie-parser");                          // Sessions
const expressSession = require("express-session");                      // Sessions, yet unused
const { v4: uuidv4 } = require("uuid");                                 // Sessions, unique signed cookie user IDs
const { Client } = require("pg");                                       // Postgresql
// Our .env entires may need to be quoted differently

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static("public"));

// POST Routes

app.post("/check-cart", function(req, res) {
    // Check if user has existing cart storage
    const user_id = req.signedCookies["User-Session"];
    
    // Postgresql
    const pgClient = new Client();

    pgClient.connect()
        .then(function() {
            return pgClient.query('SELECT * FROM user_carts WHERE user_id = $1;', [user_id]);
        })
        .then(function(queryResult) {
            if(queryResult.rows.length > 0) {
                res.json(queryResult.rows[0]); 
            } else {
                res.json({ "Result: ": "No matching rows.", });
            }
        })
        .catch(function(error) {
            res.json({ "Result: ": "/check-cart error.", });
        })
        .finally(function() {
            pgClient.end();
    });
});

app.post("/update-cart", function(req, res) {

    // User ID cookie & cart info 
    const user_id = req.signedCookies["User-Session"];
    const cart_contents = JSON.stringify(req.body.cart);

    // Postgresql
    const pgClient = new Client();

    pgClient.connect()
        .then(function() {
            return pgClient.query('INSERT INTO user_carts (user_id, cart_contents) VALUES ($1, $2) ' +
                                  'ON CONFLICT (user_id) DO UPDATE SET cart_contents = EXCLUDED.cart_contents ' +
                                  'RETURNING *;', [user_id, cart_contents]);
        })
        .then(function(queryResult) {
            const resultRows = queryResult.rows;
            res.json({ "Result: ": resultRows, });
        })
        .catch(function(error) {
            res.json({ "Result: ": cart_contents, });
        })
        .finally(function() {
            pgClient.end();
    });
});

app.post("/signup-request", function requestHandler(req, res) {
    let obj = { "key": "/signupRequest works!", };
    res.json(obj);
});                                                

app.post("/login-request", function(req, res) {
    // Database interfacing with pgClient
});

app.post("/create-checkout-session", function(req, res) {
    // Implement
});

// GET Routes
app.get("/", function(req, res) {
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    }

/* This is somehow creating 502 bad gateway errors. No clue why, possibly due to the synchronicity? IDK man.
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- A cookie was created in the / GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    else {
        fs.appendFileSync("/var/www/html/bytebloom.tech/express/logs/cookie-logs", new Date() + ": --- Existing cookie in /store GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }
*/

    res.sendFile(path.join(__dirname, "views", "index.html"));
});                                                

app.get("/signup", function(req, res) { 
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    }

/* This is somehow creating 502 bad gateway errors. No clue why, possibly due to the synchronicity? IDK man.
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- A cookie was created in the /signup GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    } else {
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- Existing cookie in /signup GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }
*/

    res.sendFile(path.join(__dirname, "views", "signup.html"));
});                                                

app.get("/login", function(req, res) {
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    } 
    
/* This is somehow creating 502 bad gateway errors. No clue why, possibly due to the synchronicity? IDK man.
        fs.appendFileSync("logs/cookie-logs", new Date() + ": --- A cookie was created in the /login GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    else {
        fs.appendFileSync("/var/www/html/bytebloom.tech/express/logs/cookie-logs", new Date() + ": --- Existing cookie in /login GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }
*/

    res.sendFile(path.join(__dirname, "views", "login.html"));
});                                                

app.get("/store", function(req, res) {
    const userSessionCookie = req.signedCookies["User-Session"];

    if(!userSessionCookie) { // Create session cookie
        res.cookie("User-Session", uuidv4(), {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    } 
    
/* This is somehow creating 502 bad gateway errors. No clue why, possibly due to the synchronicity? IDK man.
        fs.appendFileSync("/var/www/html/bytebloom.tech/express/logs/cookie-logs", new Date() + ": --- A cookie was created in the /store GET route. ---\n\n"); // Log new session cookie, double newline delimiters
    else {
        fs.appendFileSync("/var/www/html/bytebloom.tech/express/logs/cookie-logs", new Date() + ": --- Existing cookie in /store GET route. ---\n" + userSessionCookie + "\n\n"); // Log existing session cookie
    }
*/

    res.sendFile(path.join(__dirname, "views", "store.html"));
});                                                

/* Catch-all route
    app.get("*", function(req, res) {
    });
*/

app.listen(port, function() {
    console.log("app.js running");
});
