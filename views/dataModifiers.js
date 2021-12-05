const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient
var bodyParser = require("body-parser");
const multer = require("multer");
var fs = require('fs');
const path = require("path");

const modifierHelp = require("../server_scripts/modifierMethods")
const tableHelp = require("../server_scripts/table")

router.use(bodyParser.urlencoded({ extended: true })); 

var prefix = "/modif"

const upload = multer({
    dest: "dbimages"
});

MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/animalmodif",(req,res)=>{
        if (!req.query.name){
            return res.redirect("/")
        }
        modifierHelp.updateDB(dbo)
        req.session.isAdmin = req.session.isAdmin || true // !!!!!!!!changer
        req.session.lastpage = prefix + "/animalmodif" + (req.query.name ? `?name=${req.query.name}` : "")    // utilisé pour rediriger après changement de couleur/mode
        req.session.theme = req.session.theme || "light"
        var renderObject = modifierHelp.makeRenderObject(true,req.query.name,req, dbo);
        return res.render("animalStaffModification.html",renderObject)
    })

    router.get("/staffmodif",(req,res)=>{
        if (!req.query.name){
            return res.redirect("/")
        }
        modifierHelp.updateDB(dbo)
        req.session.isAdmin = req.session.isAdmin || true // !!!!!!!!changer
        req.session.lastpage = prefix + "/staffmodif" + (req.query.name ? `?name=${req.query.name}` : "") 
        req.session.theme = req.session.theme || "light"
        var renderObject = modifierHelp.makeRenderObject(false,req.query.name,req, dbo);
        return res.render("animalStaffModification.html",renderObject)
    })

    router.get("/loadTimeTable", (req,res)=>{
        var isAnimal = req.query.animal === "true"
        req.session.isAdmin = req.session.isAdmin || true  // !!!!!!!!changer
        if (isAnimal){
            var collection = "animal"
        }else{
            var collection = "employee"
        }
        dbo.collection(collection).find({name : req.query.name}).toArray((err,Employee)=>{
            if (Employee.length === 0){
                res.send("")
            }
            else{
                if (isAnimal){ 
                    var tableSearch = "employee"
                    dbo.collection("timetable").find({animalName : req.query.name, day : req.query.day, date : req.query.date}).toArray((err,doc)=>{   // cherche tous les horaires concernant cet animal
                        tableHelp.makeRenderedTable(tableSearch, req, isAnimal, doc, res, dbo)
                    })
                }else{
                    var tableSearch = "animal"
                    dbo.collection("timetable").find({staffName : req.query.name, day : req.query.day, date : req.query.date}).toArray((err,doc)=>{   // cherche tous les horaires concernant cet employé
                        tableHelp.makeRenderedTable(tableSearch, req, isAnimal, doc, res, dbo, Employee[0])
                    })
                }
            }
        })
    })


    router.post("/modifyTimeTable", (req,res)=>{
        var day = req.body.dateModif.split("/")[3]                      // Lundi, Mardi, ...
        var date = req.body.dateModif.split("/").slice(0,3).join("/")  //    DD/MM/YYYY
        var collect = req.body.isAnimalModif==="true" ? "animal" : "employee"
        dbo.collection(collect).find({name : req.body.nameModif}).toArray((err,doc)=>{
            if (doc.length == 0){
                req.session.error = "Individu non trouvé"
                return res.redirect(req.session.lastpage)
            }
            for (let hour = 0; hour<24; hour++){
                for( let halfhour=0; halfhour<2; halfhour++){
                    formatHour = modifierHelp.formatHourString([hour,halfhour*30])
                    if (req.body.isAnimalModif==="true"){
                        dbo.collection("timetable").deleteOne({"day" : day, "date" : date, "time" : formatHour, "animalName": req.body.nameModif})  //supprime si existe déjà pour cet animal
                        if (req.body["nameSelection"+formatHour]!==""){    // si on a sélectionné au moins un nom
                            dbo.collection("timetable").insertOne({"day" : day, "date" : date, "time" : formatHour, "animalName": req.body.nameModif, "staffName": req.body["nameSelection"+formatHour], "task" : req.body["taskList"+formatHour]})
                        }
                    }else{ 
                        dbo.collection("timetable").deleteOne({"day" : day, "date" : date, "time" : formatHour, "staffName": req.body.nameModif})    //supprime si existe déjà 
                        if (req.body["nameSelection"+formatHour]!==""){    // si on a sélectionné au moins un nom
                            dbo.collection("timetable").insertOne({"day" : day, "date" : date, "time" : formatHour, "staffName": req.body.nameModif, "animalName": req.body["nameSelection"+formatHour], "task" : req.body["taskList"+formatHour]})  
                        }
                    }
    
                }
            }
            res.redirect(req.session.lastpage)
        })

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

    router.get("/loadHour", (req,res)=>{
        dbo.collection("employee").find({name : req.query.name}).toArray((err,doc)=>{
            if (doc[0]){
                res.send(doc[0].startHour + "#" + doc[0].endHour + "#" + (doc[0].admin || ""))
            }else{
                res.send("")
            }
        })
    })


    router.post("/updateItem", upload.single('pictureUpload'),(req,res)=>{
        if (!req.session.isAdmin){
            return res.redirect(req.session.lastpage)
        }
        if (req.body.isAnimal === "true"){
            var collect = "animal"
        }else{
            var collect = "employee"
        }
        dbo.collection(collect).find({name : req.body.name}).toArray((err,doc)=>{

            dbo.collection(collect).updateOne({name : req.body.name},{$set: {description : req.body.desc}})

            if (req.file){
                var countElement;
                fs.readdir("./static/uploads", (err, files) => {
                    countElement = files.length;   // regarde le nombre d'images dans le dossier

                    var tempPath = req.file.path;
                    console.log(tempPath)
                    if (doc[0].picture ){
                        var targetPath = path.join(__dirname, `.././static/` + doc[0].picture);  // doit changer encore le nom pour qu'il soit unique
                    }else{
                        var targetPath = path.join(__dirname, `.././static/uploads/${countElement+1}image.png`);  // doit changer encore le nom pour qu'il soit unique
                    }

                    var urlDestination = doc[0].picture || `./uploads/${countElement+1}image.png`
                    console.log(targetPath)

                    fs.rename(tempPath, targetPath, err =>{   //ajoute l'image au dossier upload se trouvant dans static
                        if (err) return err
                        console.log("uploaded")
                        fs.readdir("./dbimages", (err, files) => {
                            console.log(files)
                            for (const file of files){
                                try{
                                    fs.unlinkSync( path.join(__dirname, "../dbimages/" + file))
                                }
                                catch{
                                    console.log("No file to suppress")
                                }
                            }
                        })
                    });
                    dbo.collection(collect).updateOne({name : req.body.name},{$set: {picture : urlDestination}})
                })
            }
            if (req.body.isAnimal === "false"){
                var rangeStart = req.body.rangeStart
                var rangeEnd = req.body.rangeEnd
                var startHour = modifierHelp.formatHourString([rangeStart - rangeStart%1, rangeStart%1*60])
                var endHour = modifierHelp.formatHourString([rangeEnd - rangeEnd%1, rangeEnd%1*60])
                dbo.collection("employee").updateOne({name :  req.body.name},{$set: {startHour : startHour, endHour : endHour}})
            }
            dbo.collection(collect).updateOne({name : req.body.name},{$set: {admin : req.body.adminCheck === "on"}})
            res.redirect(req.session.lastpage)
        })
    })


    router.use(express.static('static'));
})
module.exports = {
    "dataModifiers" : router
}
