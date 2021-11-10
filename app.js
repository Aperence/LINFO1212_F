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






https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
  }, app).listen(8080);