const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient

var prefix = "/log"

MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db("site")

    router.get("/inscription",(req,res)=>{
        req.session.theme = req.session.theme || "light"
        req.session.lastpage = prefix + "/inscription"
        req.session.error = "test12";
        var x = req.session.error;
        req.session.error = null;
        res.render('inscription.html', {error : x, Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
    })

    router.get("/profil",(req,res)=>{
        if (req.session.name){
            req.session.theme = req.session.theme || "light"
            req.session.lastpage = prefix + "/profil"
            var x = req.session.error;
            req.session.error = null;
            dbo.collection("employee").find({name : req.session.name}).toArray((err,doc)=>{
                var aName = doc[0].name;
                var aDescription = doc[0].description;
                var aPassword = doc[0].password;
                var aAdmin = doc[0].admin;
                var aStartHour = doc[0].startHour;
                var aEndHour = doc[0].endHour;
                var aPicture = doc[0].picture;
            req.session.searchedName = doc[0].name;
            console.log(req.session.name + "----" + aPassword);
            res.render('profil.html', {error : x, name : aName, description : aDescription, password : aPassword, admin : aAdmin, startHour : aStartHour, endHour : aEndHour, picture : aPicture, Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
            });
        }
        else{
            res.redirect("/log/connexion")
        }
    })

    router.get("/connexion",(req,res)=>{
        if (req.session.name){
            res.redirect("/log/profil")
        }
        else{
            req.session.theme = req.session.theme || "light"
            req.session.lastpage = prefix + "/connexion"
            var x = req.session.error;
            req.session.error = null;
            res.render('connexion.html', {error : x, Mode : req.session.theme, imageMode : req.session.theme + ".jpg"})
        }
    })

    router.post('/createAnimal.html', function(req,res,next){
        if (req.body.nameAnimal != null && req.body.descriptionAnimal != null){
            dbo.collection("animal").find({name : req.body.nameAnimal}).toArray((err,doc)=>{
                if (doc.length!=0){
                    console.log("Animal déjà existant");
                    req.session.error = "Animal déjà existant.";
                    res.redirect("/log/inscription")
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
    })

    router.post('/createEmployee.html', function(req,res,next){
        if (req.body.nameEmployee != null && req.body.descriptionEmployee != null && req.body.connmdp != null && req.body.confmdp != null && req.body.startHour != null && req.body.endHour != null){
            dbo.collection("employee").find({name : req.body.nameEmployee}).toArray((err,doc)=>{
                if (doc.length!=0){
                    console.log("Employé déjà existant");
                    req.session.error = "Employé déjà existant.";
                    res.redirect(req.session.lastpage)
                }
                else{
                    var hashedPassword = bcrypt.hashSync(req.body.connmdp, 8);
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
                    console.log("Employé créé : ", req.body.nameEmployee, req.body.descriptionEmployee, hashedPassword, req.body.connmdp, req.body.admin, defStartHour, defEndHour)
                    res.redirect(req.session.lastpage)
                }
            });
        }
        else{
            res.redirect(req.session.lastpage)
        }
    })

    // fonction du formulaire de connexion
    router.post('/connexion.html', function(req,res,next){
        console.log(req.body.nameEmployee , req.body.connmdp)
        if (req.body.nameEmployee != null && req.body.connmdp != null){
            console.log("Compte cherché : ", req.body.nameEmployee, req.body.connmdp)
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
                        req.session.connected = true;
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
            res.redirect('/log/connexion');
        }
    })

    router.post('/modifDescription.html', function(req,res,next){
        if (req.body.descriptionEmployee != null){
            dbo.collection("employee").updateOne({name : req.session.searchedName},{$set: {description : req.body.descriptionEmployee}});
            console.log("Description modifiée")
            res.redirect("/log/profil")
        }
        else{
            res.redirect(req.session.lastpage)
        }
    })

    router.post('/modifPicture.html', function(req,res,next){
        if (req.body.picture != null){
            dbo.collection("employee").updateOne({name : req.session.searchedName},{$set: {picture : req.body.picture}});
            console.log("Photo de profil modifiée")
            res.redirect("/log/profil")
        }
        else{
            res.redirect(req.session.lastpage)
        }
    })


    router.use(express.static('static'));
})
module.exports = {
    "logRouter" : router
}