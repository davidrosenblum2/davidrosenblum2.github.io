/*
    Node.js webserver for the front-end class website
*/

"use strict";

let express = require("express");

let app = express().use(express.static(__dirname + "/public"));

app.route("/").get((req, res) => {
    res.end("index.html");
});

app.route("/fake*").get((req, res) => {
    res.end("This link is fake.");
});

// heroku gives port
const PORT = process.env.PORT || 8080;

app.listen(PORT, err => {
    if(!err){
        console.log(`Node.js server listening on port ${PORT}.`);
    }
    else throw err;
});