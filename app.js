const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const sessionModule = require("express-session");
const cookieParser = require("cookie-parser");
const mongoClient = require("mongodb").MongoClient;
const urlDB = "mongodb://localhost:27017/";

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

// Set up the database
mongoClient.connect(urlDB + "marketplace", { useUnifiedTopology: true }, (err, db) => {
    if (err) {
        throw err;
    }
    console.log("[DB-info]:Baza de date a fost creata.");
});

mongoClient.connect(urlDB, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
        throw err;
    }
    var dbo = db.db("marketplace");
    dbo.createCollection("users", (err, res) => {
        if (err) {
            throw err;
        }
        console.log("[DB-info]:Tabela users a fost creata.");
    });
});

mongoClient.connect(urlDB, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
        throw err;
    }
    var dbo = db.db("marketplace");
    dbo.createCollection("products", (err, res) => {
        if (err) {
            throw err;
        }
        console.log("[DB-info]:Tabela products a fost creata.");
    });
});


/**
 *********** Web site functionalities ***********
 */

/**
 * Setup the host + port that the node js app should communicate with users
 */
app.listen(port, host, () => {
    console.log(`[Server-info]:Serverul rulează la adresa http://${host}:${port}.`)
});

/**
 * The root path of the site
 */
app.get("/", (req, res) => {
    let promise = new Promise((resolve, reject) => {
        mongoClient.connect(urlDB, { useUnifiedTopology: true }, (err, db) => {
            if (err) {
                reject(err);
            }
            var dbo = db.db("marketplace");
            dbo.collection("products")
                .find("*")
                .toArray((err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res);
                });
        });
    });

    promise
        .then((result) => {
            // Logging message
            console.log("[Server-info]:Randarea paginii index.");
            res.render("index", {
                nume: req.cookies["nume"],
                produse: result
            });
        })
        .catch(err => console.log(err));
});

// Search resource HTTP methods
app.post("/search-function", (req, res) => {
    let raspuns_json = req.body;
});

// Cont resource HTTP methods
app.get("/cont", (req, res) => {
    // Logging message
    console.log("[Server-info]:Randarea paginii cont.");

    res.render("cont", {
        mesajEroare: req.cookies["mesajEroare"],
        nume: req.cookies["nume"],
        utilizator: req.cookies["utilizator"]
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("utilizator");
    res.clearCookie("nume");
    res.clearCookie("lista");
    res.clearCookie("cos");

    // Logging message
    console.log("[Server-info]:Log out efectual. Redirectionare catre cont.");

    res.redirect("/cont");
});

app.post("/login-check", (req, res) => {
    let raspuns_json = req.body;
    let promise = new Promise((resolve, reject) => {
        mongoClient.connect(urlDB, { useUnifiedTopology: true }, (err, db) => {
            if (err) {
                reject(err);
            }
            var dbo = db.db("marketplace");
            dbo.collection("users")
                .find({ user: raspuns_json.nume_utilizator })
                .toArray((err, res) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(res[0]);
                });
        });
    });

    promise
        .then((result) => {
            if (raspuns_json.nume_utilizator === result.user &&
                raspuns_json.parola_utilizator === result.password) {
                res.cookie("utilizator", result.user);
                res.cookie("nume", result.name);
                res.cookie("lista", []);
                res.cookie("cos", []);
                res.clearCookie("mesajEroare");

                // Logging message
                console.log("[Server-info]:Log in cu succes. Redirectionare catre index.");

                res.redirect("/");
            } else {
                res.cookie("mesajEroare", "Log in: datele utilizatorului sunt incorecte.");

                // Logging message
                console.log("[Server-info]:Log in esuat. Redirectionare catre cont.");

                res.redirect("/cont");
            }
        })
        .catch(err => console.log(err));
});

// Parola uitata resurse HTTP methods
app.get("/parola-uitata", (req, res) => {


    if (req.cookies["utilizator"] == null) {
        // Logging message
        console.log("[Server-info]:Randarea paginii parola-uitata.");
        res.render("parola-uitata", {
            nume: req.cookies["nume"]
        });
    } else {
        // Logging message
        console.log("[Server-info]:Accesarea paginii parola-uitata desi utilizatorul este logat. Redirectionare spre cont.");
        res.redirect("/cont");
    }
});

// Cont nou resource HTTP methods
app.get("/cont-nou", (req, res) => {

    if (req.cookies["utilizator"] == null) {
        // Logging message
        console.log("[Server-info]:Randarea paginii cont-nou.");

        res.render("cont-nou", {
            utilizator: req.cookies["utilizator"],
            nume: req.cookies["nume"]
        });
    } else {
        // Logging message
        console.log("[Server-info]:Accesarea paginii cont-nou desi utilizatorul este logat. Redirectionare spre cont.");
        res.redirect("/cont");
    }
});

app.post("/new-acc-check", (req, res) => {
    let raspuns_json = req.body;

    mongoClient.connect(urlDB, { useUnifiedTopology: true }, (err, db) => {
        if (err) {
            throw err;
        }
        var dbo = db.db("marketplace");
        var objToBeInserted = {
            name: raspuns_json.nume,
            user: raspuns_json.username,
            password: raspuns_json.parola,
            email: raspuns_json.email
        };
        dbo.collection("users").insertOne(objToBeInserted, (err, res) => {
            if (err) {
                throw err;
            }
            console.log("[DB-info]:One record inserted into users table.");
        });

    });

    // Logging message
    console.log("[Server-info]:Crearea contului cu succes. Redirectionare catre cont.");

    res.redirect("/cont");
});

// Lista resource HTTP methods
app.get("/lista", (req, res) => {
    // Logging message
    console.log("[Server-info]:Randarea paginii lista.");

    res.render("lista", {
        nume: req.cookies["nume"]
    });
});

// Cos-cumparaturi resource HTTP methods
app.get("/cos-cumparaturi", (req, res) => {
    // Logging message
    console.log("[Server-info]:Randarea paginii cos-cumparaturi.");

    res.render("cos-cumparaturi", {
        nume: req.cookies["nume"]
    });
});