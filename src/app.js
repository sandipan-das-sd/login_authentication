const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Register = require("./models/registers");
const auth = require("./middleware/auth");

// MongoDB Connection
require('./db/conn');

// Specify the absolute path to the public folder
const static_path = path.join(__dirname, "src", "db", "public");
const templates_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partial_path);

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/secret", auth, (req, res) => {
    res.render("secret");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const newUser = new Register(req.body);
        await newUser.save();
        res.send(`<center>Congratulations!!! <b>${req.body.firstName}</b> User registered successfully</center>`);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email === 1) {
            res.status(400).send('<center><h1>Sorry, this email address is already registered!!</h1></center>');
        } else {
            res.status(400).send(error.message);
        }
    }
});

app.post("/login", async (req, res) => {
    try {
        const { firstName, password } = req.body;
        const user = await Register.findOne({ firstName });

        if (user && user.password === password) {
            // You may want to use a more secure method for handling authentication,
            // such as JWT. The following is a simple example using cookies.
            res.cookie('user', user.firstName);
            res.status(201).render("index");
        } else {
            res.send("Invalid login details");
        }
    } catch (error) {
        res.status(400).send("Invalid login details");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});
