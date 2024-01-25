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
const cron = require("node-cron");                                      // Clear old carts from database
// Our .env entires may need to be quoted differently

const app = express();
const port = process.env.PORT;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static("public"));

async function stripeAPICalls() {
    let obj = {};

    try {
        // First API call
        const stripePrices = await stripe.prices.list({ limit: 100 });
        obj.stripePrices = stripePrices;
    } catch (error) {
        obj.stripePrices = { "error": "Error fetching Stripe prices" };
    }

    try {
        // Second API call
        const stripeProducts = await stripe.products.list({ limit: 100 });
        obj.stripeProducts = stripeProducts;
    } catch (error) {
        obj.stripeProducts = { "error": "Error fetching Stripe products" };
    }

    return obj;
}

// POST Routes
app.post("/pull-cart", async function(req, res) { // store.js, stripe & postgres
    // Check if user has existing cart storage
    const user_id = req.signedCookies["User-Session"];

    // Stripe
    const finalResponse = await stripeAPICalls();
    
    // Postgresql
    const pgClient = new Client();

    try {
        await pgClient.connect();
        const queryResult = await pgClient.query('SELECT * FROM user_carts WHERE user_id = $1;', [user_id]);

        if (queryResult.rows.length > 0) {
            finalResponse.postgresResult = queryResult.rows[0];
        } else {
            finalResponse.postgresResult = { "POST /pull-cart: ": "No matching user_id, in else clause" };
        }
    } catch (error) {
        finalResponse.postgresResult = { "POST /pull-cart: ": "Error, in catch" };
    } finally {
        pgClient.end();
        res.json(finalResponse);
    }
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
            maxAge: 2629746000,
            secure: true,
        });
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 2629746000,
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
            maxAge: 2629746000,
            secure: true,
        });
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 2629746000,
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
            maxAge: 2629746000,
            secure: true,
        });
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 2629746000,
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
            maxAge: 2629746000,
            secure: true,
        });
    } else {
        // Refresh cookie expiry, new cookie with same unique UID
        res.cookie("User-Session", userSessionCookie, {
            signed: true,
            maxAge: 2629746000,
            secure: true,
        });
    }
    
    res.sendFile(path.join(__dirname, "views", "store.html"));
}); 

/* Catch-all route
    app.get("*", function(req, res) {
    });
*/

// Function to delete old rows from user_carts table
async function deleteOldCarts() {
    try {
        const pgClient = new Client();
        await pgClient.connect();

        // Calculate the date one month ago
        const oneMonthAgo = new Date();
        oneMonthAgo.setHours(oneMonthAgo.getHours() - 720); // 30 days * 24 hours

        // Fetch rows to be deleted
        const fetchResult = await pgClient.query('SELECT * FROM user_carts WHERE creation_date < $1;', [oneMonthAgo]);
        const rowsToDelete = fetchResult.rows;

        // Execute the delete query
        const deleteResult = await pgClient.query('DELETE FROM user_carts WHERE creation_date < $1;', [oneMonthAgo]);
        await fs.appendFile("./logs/user_carts_deletion_record", `Deleted ${deleteResult.rowCount} rows one month old at ${new Date()}\n`);

        // Log the details of deleted rows to file
        if (rowsToDelete.length > 0) {
            await fs.appendFile(
                "logs/user_carts_deletion_record",
                `Details of deleted rows:\n${JSON.stringify(rowsToDelete, null, 4)}\n`
            );
        }
    } catch (error) {
        await fs.appendFile("logs/user_carts_deletion_record", `Error deleting rows: ${error.message} at ${new Date()}\n`);
    } finally {
        await pgClient.end();
        await fs.appendFile("./logs/user_carts_deletion_record", `deleteOldCarts() ran at ${new Date()}\n`);
    }
}

// Schedule deleteOldCarts() to run every day at midnight
cron.schedule("0 0 * * *", deleteOldCarts);

app.listen(port, function() {
    // console.log("app.js running");
});
