let mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const bodyParser = require("body-parser");
const constants = require("./constants");
const homeRoute = require('./route/index');
const signUpRoute = require('./route/signup');
const vendorRoute = require('./route/vendor');
const cartRoute = require('./route/cart');
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(express.static("public"))
app.use(express.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(signUpRoute);
app.use(vendorRoute);
mongoose
    .connect(
        constants.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((err) => {
        console.log("Connection failed!");
    });

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

app.use(homeRoute)
app.use(cartRoute)