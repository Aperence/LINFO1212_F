const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient

var prefix = "/schedule"

MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/animalSchedule",(req,res)=>{
        console.log(req.session.isAdmin);
        req.session.theme = req.session.theme || "light"
        req.session.lastpage = prefix + "/animalSchedule"
        return res.render("animalSchedule.html", {Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
    })

    router.use(express.static('static'));
})
module.exports = {
    "AniSchRouter" : router
}