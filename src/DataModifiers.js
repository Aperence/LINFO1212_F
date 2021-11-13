const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient

const modifierHelp = require("../server_scripts/modifierMethods")

var prefix = "/modif"


MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/animalmodif",(req,res)=>{
        req.session.lastpage = prefix + "/animalmodif"
        var renderObject = modifierHelp.makeRenderObject(true,"test",req);
        //console.log(renderObject)
        return res.render("animalStaffModification.html",renderObject)
    })

    router.get("/staffmodif",(req,res)=>{
        req.session.lastpage = prefix + "/staffmodif"
        var renderObject = modifierHelp.makeRenderObject(false,"test2",req);
        return res.render("animalStaffModification.html",renderObject)
    })


    router.get("/upnav_site",(req,res)=>{
        return res.render("upnav_site.html")
    })

    router.get("/loadTimeTable", async(req,res)=>{
        var isAnimal = req.query.animal === "true"
        var TimeTable = []
        console.log("called")
        if (isAnimal){ 
            dbo.collection("timetable").find({animalName : req.query.name, day : req.query.day, date : req.query.date}).toArray((err,doc)=>{
                console.log(doc)
                modifierHelp.createListItem(isAnimal, TimeTable, doc)
                responseTimeTable = modifierHelp.renderTimeTable(TimeTable);                 
                res.send(responseTimeTable)
            })
        }else{
            dbo.collection("timetable").find({staffName : req.query.name, day : req.query.day, date : req.query.date}).toArray((err,doc)=>{
                modifierHelp.createListItem(isAnimal, TimeTable,doc)
                responseTimeTable = modifierHelp.renderTimeTable(TimeTable);                 
                res.send(responseTimeTable)
            })
        }
    })


    router.use(express.static('static'));
})
module.exports = {
    "DataModifiers" : router
}