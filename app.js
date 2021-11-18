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
var dataModifs = require("./views/DataModifiers")
var DBTools = require('./views/databaseTools')

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
    if (req.session.isAdmin){
        return res.render("upnav_site.html", {display : ""})
    }else{
        return res.render("upnav_site.html", {display : "display : none"})
    }

})

app.get('/ChangeMode', (req,res)=>{
    req.session.theme = req.session.theme === "light" || !(req.session.theme) ? "dark" : "light"
    res.redirect(req.session.lastpage)
})


// ajouts de routeurs
app.use("/modif",dataModifs.DataModifiers)
app.use("/tools", DBTools.DBTools)

app.use(express.static('static'));



app.get('*', (req, res) => {
    res.status(404).render("404.html");
});

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
  }, app).listen(8080);