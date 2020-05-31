const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')

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

/**
 * Setup the host + port that the node js app should communicate with users
 */
app.listen(port, host, () => {
    console.log(`Serverul rulează la adresa http://${host}:${port}`)
});

/**
 * The root path of the site
 */
app.get('/', (req, res) => {
    res.render("index");
});