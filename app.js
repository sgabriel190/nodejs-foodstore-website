const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const sessionModule = require("express-session");
const cookieParser = require("cookie-parser");

// Create an express instance
const app = express();

// Port + host setup
const host = "127.0.0.1";
const port = 8888;

/**
 * Express instance setup
 */
// Setup the express layout engine
app.set("view engine", "ejs");
app.set("views", "./templates");
app.use(expressLayouts);

// Setup the default static folder
app.use(express.static("static"));

// Added json parser to the express app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add session express to the app
app.use(sessionModule({
    name: "pw",
    secret: "abc",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true
    }
}));

// Add cookies to the app
app.use(cookieParser("abc"));

/**
 * Setup the host + port that the node js app should communicate with users
 */
app.listen(port, host, () => {
    console.log(`[Server-info]Serverul rulează la adresa http://${host}:${port}`)
});

/**
 * The root path of the site
 */
app.get("/", (req, res) => {
    res.render("index");
});

// Cont resource HTTP methods
app.get("/cont", (req, res) => {
    res.render("cont");
});

app.post("/login-check", (req, res) => {

});

// Lista resource HTTP methods
app.get("/lista", (req, res) => {
    res.render("lista");
});

// Cos-cumparaturi resource HTTP methods
app.get("/cos-cumparaturi", (req, res) => {
    res.render("cos-cumparaturi");
});