const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient
const createTable = require("./../server_scripts/displayTable")

const prefix = "/schedule"

MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/animalSchedule",(req,res)=>{
        req.session.theme = req.session.theme || "light"
        req.session.lastpage = prefix + "/animalSchedule"
        req.query.num = req.query.num || req.session.num || "1"   // si pas de numéro de page défini, charge la première page
        req.session.num = req.query.num
        var sortOrder = parseInt(req.session.sort) || 0  //pas de tri par défaut
        var search = req.session.search
        dbo.collection("timetable").find({}).toArray((err, docTimetable)=>{
            if (sortOrder){
                var item ={}
                 if(req.session.cat ="name"){
                     item = {"name" : req.session.sort}
                 } 
                 
                 dbo.collection("animal").find(search).sort(item).collation({ locale: "en", caseLevel: true }).toArray((err,doc) =>{
                     if (err) {console.log(err)}
                     if (req.session.cat=="isAvailable"){
                        //doc = createTable.sorted(doc)
                     }
                     return res.render("animalSchedule.html",createTable.returnPages(doc,req, docTimetable))})
             }
             dbo.collection("animal").find({}).toArray((err,doc)=>{
                 if (err) {console.log(err)}
                 return res.render("animalSchedule.html",createTable.returnPages(doc,req, docTimetable))})
        })
    })

    router.get("/display", (req,res)=>{
        req.session.num = req.query.num
        res.redirect("/")
    })

    router.use(express.static('static'));
})

module.exports = {
    "AniSchRouter" : router
}