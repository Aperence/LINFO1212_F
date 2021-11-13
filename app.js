var express = require("express")
var consolidate = require('consolidate')
var MongoClient = require('mongodb').MongoClient
var bodyParser = require("body-parser");
var https = require('https');
var fs = require('fs');
var session = require('express-session');
var Server = require('mongodb').Server;
var ObjectId = require('mongodb').ObjectId;
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
var dataModifs = require("./src/DataModifiers")

var app = express ();

app.engine('html', consolidate.hogan)
app.set('views','templates');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
    secret: "ParadisioScheduler",
    saveUninitialized: true,
    cookie:{ 
        path: '/', 
        httpOnly: true
    }
}));

//temporaire
app.get("/",(req,res)=>{
    req.session.lastpage = "/"
    res.redirect("/modif/animalmodif")
})

app.get("/upnav_site",(req,res)=>{
    return res.render("upnav_site.html")
})

app.get("/upnav_prov",(req,res)=>{
    return res.render("upnav_prov.html")
})

app.get('/ChangeMode', (req,res)=>{
    req.session.theme = req.session.theme === "light" || !(req.session.theme) ? "dark" : "light"
    res.redirect(req.session.lastpage)
})

// ajouts de routeurs
app.use("/modif",dataModifs.DataModifiers)


app.use(express.static('static'));

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
  }, app).listen(8080);