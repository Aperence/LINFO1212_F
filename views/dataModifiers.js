const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient
var bodyParser = require("body-parser");

const modifierHelp = require("../server_scripts/modifierMethods")
const tableHelp = require("../server_scripts/table")

router.use(bodyParser.urlencoded({ extended: true })); 

var prefix = "/modif"


MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/animalmodif",(req,res)=>{
        modifierHelp.updateDB(dbo)
        req.session.isAdmin = req.session.isAdmin || true // !!!!!!!!changer
        req.session.lastpage = prefix + "/animalmodif"                     // utilisé pour rediriger après changement de couleur/mode
        req.session.theme = req.session.theme || "light"
        var renderObject = modifierHelp.makeRenderObject(true,req.query.name,req, dbo);
        return res.render("animalStaffModification.html",renderObject)
    })

    router.get("/staffmodif",(req,res)=>{
        modifierHelp.updateDB(dbo)
        req.session.isAdmin = req.session.isAdmin || true // !!!!!!!!changer
        req.session.lastpage = prefix + "/staffmodif"
        req.session.theme = req.session.theme || "light"
        var renderObject = modifierHelp.makeRenderObject(false,req.query.name,req, dbo);
        return res.render("animalStaffModification.html",renderObject)
    })

    router.get("/loadTimeTable", (req,res)=>{
        var isAnimal = req.query.animal === "true"
        req.session.isAdmin = req.session.isAdmin || true // !!!!!!!!changer
        if (isAnimal){ 
            var tableSearch = "employee"
            dbo.collection("timetable").find({animalName : req.query.name, day : req.query.day, date : req.query.date}).toArray((err,doc)=>{   // cherche tous les horaires concernant cet animal
                tableHelp.makeRenderedTable(tableSearch, req, isAnimal, doc, res, dbo)
            })
        }else{
            var tableSearch = "animal"
            dbo.collection("timetable").find({staffName : req.query.name, day : req.query.day, date : req.query.date}).toArray((err,doc)=>{   // cherche tous les horaires concernant cet employé
                tableHelp.makeRenderedTable(tableSearch, req, isAnimal, doc, res, dbo)
            })
        }
    })


    router.post("/modifyTimeTable", (req,res)=>{
        var day = req.body.dateModif.split("/")[3]                      // Lundi, Mardi, ...
        var date = req.body.dateModif.split("/").slice(0,3).join("/")  //    DD/MM/YYYY
        
        for (let hour = 0; hour<24; hour++){
            for( let halfhour=0; halfhour<2; halfhour++){
                formatHour = modifierHelp.formatHourString([hour,halfhour*30])
                if (req.body.isAnimalModif==="true"){
                    dbo.collection("timetable").deleteOne({"day" : day, "date" : date, "time" : formatHour, "animalName": req.body.nameModif})  //supprime si existe déjà pour cet animal
                    if (req.body["nameSelection"+formatHour]!==""){    // si on a sélectionné au moins un nom
                        dbo.collection("timetable").insertOne({"day" : day, "date" : date, "time" : formatHour, "animalName": req.body.nameModif, "staffName": req.body["nameSelection"+formatHour], "task" : req.body["taskList"+formatHour]})
                    }
                }else{ 
                    dbo.collection("timetable").deleteMany({"day" : day, "date" : date, "time" : formatHour, "staffName": req.body.nameModif})    //supprime si existe déjà 
                    if (req.body["nameSelection"+formatHour]!==""){    // si on a sélectionné au moins un nom
                        dbo.collection("timetable").insertOne({"day" : day, "date" : date, "time" : formatHour, "staffName": req.body.nameModif, "animalName": req.body["nameSelection"+formatHour], "task" : req.body["taskList"+formatHour]})  
                    }
                }

            }
        }
        res.redirect(req.session.lastpage+"?name="+req.body.nameModif)
    })


    router.get("/loadImage",(req,res)=>{
        dbo.collection(req.query.tableName).find({name : req.query.name}).toArray((err,doc)=>{
            if (err) { console.log(err) }
            if (doc.length > 0){
                res.send(doc[0].picture)
            }
        })
    })

    router.get("/loadDescription",(req,res)=>{
        dbo.collection(req.query.tableName).find({name : req.query.name}).toArray((err,doc)=>{
            if (err) { console.log(err) }
            if (doc.length > 0){
                res.send(doc[0].description)
            }else{
                res.send("")
            }
        })
    })

    router.use(express.static('static'));
})
module.exports = {
    "dataModifiers" : router
}