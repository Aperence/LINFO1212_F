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

    router.get("/profile",(req,res)=>{
        if (req.session.name){
            req.session.theme = req.session.theme || "light"
            req.session.lastpage = prefix + "/profile"
            res.render("profile.html", {Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
        }
        else{
            res.redirect("/log/connect")
        }
    })

    router.get("/connect",(req,res)=>{
        if (req.session.name){
            res.redirect("/log/profile")
        }
        else{
            req.session.theme = req.session.theme || "light"
            req.session.lastpage = prefix + "/connect"
            res.render("connect.html", {Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
        }
    })

    router.post('/createAnimal.html', function(req,res,next){
        if (req.body.nameAnimal != null && req.body.descriptionAnimal != null){
            dbo.collection("animal").find({name : req.body.nameAnimal}).toArray((err,doc)=>{
                if (doc.length!=0){
                    console.log("Animal déjà existant");
                    req.session.error = "Animal déjà existant.";
                    res.redirect(req.session.lastpage)
                }
                else{
                    dbo.collection("animal").insertOne({name : req.body.nameAnimal, description : req.body.descriptionAnimal})
                    console.log("Animal créé : ", req.body.nameAnimal, req.body.descriptionAnimal)
                    res.redirect(req.session.lastpage)
                }
            });
        }
        else{
            res.redirect(req.session.lastpage)
        }
    });

    router.post('/createEmployee.html', function(req,res,next){
        if (req.body.nameEmployee != null && req.body.descriptionEmployee != null && req.body.inscmdp != null && req.body.confmdp != null && req.body.startHour != null && req.body.endHour != null){
            dbo.collection("employee").find({name : req.body.nameEmployee}).toArray((err,doc)=>{
                if (doc.length!=0){
                    console.log("Employé déjà existant");
                    req.session.error = "Employé déjà existant.";
                    res.redirect(req.session.lastpage)
                }
                else{
                    var hashedPassword = bcrypt.hashSync(req.body.inscmdp, 8);
                    if (req.body.admin == "true"){ 
                        req.body.admin = true
                    }
                    else{
                        req.body.admin = false
                    }
                    var startHour = req.body.startHour;
                    var endHour = req.body.endHour;
                    var heureDebut = startHour%1*60;
                    startHour-=startHour%1;
                    if (startHour < 10){
                        startHour = "0" + startHour.toString();
                    }
                    if (heureDebut == 0){
                        heureDebut = heureDebut.toString() + "0";
                    }
                    var heureFin = endHour%1*60
                    endHour-=endHour%1;
                    if (endHour < 10){
                        endHour = "0" + endHour.toString();
                    }
                    if (heureFin == 0){
                        heureFin = heureFin.toString() + "0";
                    }
                    var defStartHour = startHour + ":" + heureDebut
                    var defEndHour = endHour + ":" + heureFin
                    dbo.collection("employee").insertOne({name : req.body.nameEmployee, password : hashedPassword, description : req.body.descriptionEmployee, admin : req.body.admin, startHour : defStartHour, endHour : defEndHour})
                    console.log("Employé créé : ", req.body.nameEmployee, req.body.descriptionEmployee, hashedPassword, req.body.inscmdp, req.body.admin, defStartHour, defEndHour)
                    res.redirect(req.session.lastpage)
                }
            });
        }
        else{
            res.redirect(req.session.lastpage)
        }
    });

    // fonction du formulaire de connexion
    router.post('/connexion.html', function(req,res,next){
        console.log(req.body.nameEmployee , req.body.connmdp)
        if (req.body.nameEmployee != null && req.body.connmdp != null){
            var hashedPassword = bcrypt.hashSync(req.body.connmdp, 8);
            console.log("Compte cherché : ", req.body.nameEmployee, hashedPassword)
            dbo.collection("employee").find({name : req.body.nameEmployee}).toArray((err,doc)=>{
                console.log(doc)
                if (doc.length===0){
                  req.session.error = "Utilisateur inexistant.";
                  res.redirect(req.session.lastpage)
                }
                else{
                    pwd = doc[0].password;
                    console.log(pwd);
                    const verifPassword =  bcrypt.compareSync(req.body.connmdp, pwd);
                    console.log("Connected" , req.body.nameEmployee , pwd)
                    console.log(verifPassword);
                    if (verifPassword){
                        req.session.name = req.body.nameEmployee;
                        console.log(req.session.name)
                        res.redirect('/');
                    }
                    else{
                      req.session.error = "Mot de passe incorrect.";
                      res.redirect(req.session.lastpage)
                    }
                }
            })
        }
        else{
            res.redirect('/log/connect');
        }
    });

    router.use(express.static('static'));
})
module.exports = {
    "logRouter" : router
}