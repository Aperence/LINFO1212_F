const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient

const modifierHelp = require("./../server_scripts/modifiers")

var prefix = "/modif"


MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/animalmodif",(req,res)=>{
        req.session.lastpage = prefix + "/animalmodif"
        var renderObject = modifierHelp.makeRenderObject(true,"test",req,dbo);
        console.log(renderObject)
        return res.render("animalStaffModification.html",renderObject)
    })

    router.get("/staffmodif",(req,res)=>{
        req.session.lastpage = prefix + "/staffmodif"
        var renderObject = modifierHelp.makeRenderObject(false,"test2",req,dbo);
        return res.render("animalStaffModification.html",renderObject)
    })


    router.get("/upnav_site",(req,res)=>{
        return res.render("upnav_site.html")
    })


    router.use(express.static('static'));
})
module.exports = {
    "DataModifiers" : router
}