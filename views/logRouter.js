const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient

var prefix = "/log"


MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/inscription",(req,res)=>{
        return res.render("inscription.html")
    })

    router.get("/upnav_site",(req,res)=>{
        return res.render("upnav_site.html")
    })

    router.use(express.static('static'));
})
module.exports = {
    "logRouter" : router
}