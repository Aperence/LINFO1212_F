const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient

var prefix = "/log"


MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/inscription",(req,res)=>{
        req.session.theme = req.session.theme || "light"
        req.session.lastpage = prefix + "/inscription"
        return res.render("inscription.html", {Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
    })

    router.use(express.static('static'));
})
module.exports = {
    "logRouter" : router
}