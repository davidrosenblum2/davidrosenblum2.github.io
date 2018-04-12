/*
    Node.js webserver for the front-end class website
*/

"use strict";

let express = require("express"),
    fs = require("fs");

let app = express().use(express.static(__dirname + "/public"));

app.route("/").get((req, res) => {
    res.end("index.html");
});

app.route("/fake*").get((req, res) => {
    res.end("This link is fake.");
});

app.route("/quote/get*").get((req, res) => {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*"
    });

    let index = Math.round(Math.random() * (quotes.length - 1));
    res.end(JSON.stringify(quotes[index], null, 4));
});

app.route("/quote/get*").options((req, res) => {
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    });
    res.end();
});

let quotes  = [];
fs.readFile("misc/quotes.json", (err, data) => {
    if(!err){
        try{
          quotes = JSON.parse(data);
        }
        catch(err){
            return;
        }
    }
});

// heroku gives port
const PORT = process.env.PORT || 8080;

app.listen(PORT, err => {
    if(!err){
        console.log(`Node.js server listening on port ${PORT}.`);
    }
    else throw err;
});