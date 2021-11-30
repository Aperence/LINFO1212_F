const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
var MongoClient = require('mongodb').MongoClient

var prefix = "/log"

MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/inscription",(req,res)=>{
        req.session.theme = req.session.theme || "light"
        req.session.lastpage = prefix + "/inscription"
        res.render("inscription.html", {Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
    })

    router.post('/createAnimal.html', function(req,res,next){
        if (req.body.nameAnimal != null && req.body.descriptionAnimal != null){
            dbo.collection("animal").find({name : req.body.nameAnimal}).toArray((err,doc)=>{
                if (doc.length!=0){
                    console.log("Animal déjà existant");
                    req.session.error = "Animal déjà existant.";
                    return res.redirect(req.session.lastpage)
                }
                else{
                    dbo.collection("animal").insertOne({name : req.body.nameAnimal, description : req.body.descriptionAnimal})
                    console.log("Animal créé : ", req.body.nameAnimal, req.body.descriptionAnimal)
                    return res.redirect(req.session.lastpage)
                }
            });
        }
        else{
            return res.redirect(req.session.lastpage)
        }
    });

    router.post('/createEmployee.html', function(req,res,next){
        if (req.body.nameEmployee != null && req.body.descriptionEmployee != null && req.body.inscmdp != null && req.body.confmdp != null){
            dbo.collection("employee").find({name : req.body.nameEmployee}).toArray((err,doc)=>{
                if (doc.length!=0){
                    console.log("Employé déjà existant");
                    req.session.error = "Employé déjà existant.";
                    return res.redirect(req.session.lastpage)
                }
                else{
                    var hashedPassword = bcrypt.hashSync(req.body.inscmdp, 8);
                    if (req.body.admin == "true"){ 
                        req.body.admin = true
                    }
                    else{
                        req.body.admin = false
                    }
                    dbo.collection("employee").insertOne({name : req.body.nameEmployee, password : hashedPassword, description : req.body.descriptionEmployee, admin : req.body.admin, startHour : req.body.startHour, endHour : req.body.endHour})
                    console.log("Employé créé : ", req.body.nameEmployee, req.body.descriptionEmployee, hashedPassword, req.body.inscmdp, req.body.admin, req.body.startHour, req.body.endHour)
                    return res.redirect(req.session.lastpage)
                }
            });
        }
        else{
            return res.redirect(req.session.lastpage)
        }
    });

    router.use(express.static('static'));
})
module.exports = {
    "logRouter" : router
}