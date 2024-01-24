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
app.post("/pull-cart", function(req, res) { // store.js auto check fetch()
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
                res.json({ "POST /pull-cart then(): ": "No matching user_id", });
            }
        })
        .catch(function(error) {
            res.json({ "POST /pull-cart catch(): ": "Error, catch()", });
        })
        .finally(function() {
            pgClient.end();
    });
});

app.post("/push-cart", function(req, res) { // Add-to-cart button fetch(), cart overlay delete button fetch()

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
            res.json({ "POST /push-cart then(), Updated DB row: ": resultRows, });
        })
        .catch(function(error) {
            res.json({ "POST /push-cart catch(): ": cart_contents, });
        })
        .finally(function() {
            pgClient.end();
    });
});

app.post("/signup-request", function requestHandler(req, res) {
    // signup.js makes fetch() request to this route inside button click event listener
});                                                

app.post("/login-request", function(req, res) {
    // login.js makes fetch() request to this route inside button click event listener
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
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    }

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
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    }

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
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    }

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
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 604800000,
            secure: true,
        });
    }
    
    res.sendFile(path.join(__dirname, "views", "store.html"));
}); 

/* Catch-all route
    app.get("*", function(req, res) {
    });
*/

app.listen(port, function() {
    // console.log("app.js running");
});

(function() {
    setInterval(function() {
        
    }, 604800000);
})();
