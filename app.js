var express = require("express")
var consolidate = require('consolidate')
var MongoClient = require('mongodb').MongoClient
var bodyParser = require("body-parser");
var https = require('https');
var fs = require('fs');
var session = require('express-session');
var Server = require('mongodb').Server;
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");

var dataModifs = require("./views/dataModifiers")
var DBTools = require('./views/databaseTools')
var logs = require('./views/logRouter')
var AniSchRouter = require('./views/animalScheduleRouter')


var searchHelp = require('./server_scripts/search');

var app = express ();


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({
    secret: "ParadisioScheduler",
    saveUninitialized: true,
    cookie:{ 
        path: '/', 
        httpOnly: true
    }
}));

https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'ingi'
  }, app).listen(8080);


MongoClient.connect('mongodb://localhost:27017', (err,db)=>{
    dbo = db.db('site')

    app.engine('html', consolidate.hogan)
    app.set('views','templates');

    //temporaire
    app.get("/",(req,res)=>{
        req.session.lastpage = "/"
        res.redirect("/schedule/animal_schedule")
    })

    app.get("/upnav_site",(req,res)=>{
        var icon = "<i class='bx bxs-user-account bx-md' style='color:white'></i>"
        if (req.session.connected){
            if (req.session.picture){
               icon = `<img style="height:40px; width:40px; background-image:url(${req.session.picture}); background-size: cover;">`
            }
            var connectedLink = "/log/profil"   // provisoire
            var connected = "Profil"
            var displaydeco = "opacity:1;"
        }else{
            var connectedLink = "/log/connexion"   // provisoire
            var connected = "Connexion"
            var displaydeco = "opacity:1;display:none"
        }
        if (req.session.isAdmin){
            var display =  "opacity:1;"
        }else{
            var display = "opacity:1;display:none"
        }
        return res.render("upnav_site.html", {userIcon : icon, ConnectionLink : connectedLink, Connected : connected, display : display, displaydeco : displaydeco})
    })

    app.get('/ChangeMode', (req,res)=>{
        req.session.theme = (req.session.theme === "light")? "dark" : "light"
        res.redirect(req.session.lastpage)
    })

    app.get("/search", (req,res)=>{
        dbo.collection("animal").find({ $text : { $search : req.query.search,  $language: "french"}}).toArray((err,docAnimal)=>{
            dbo.collection("employee").find({ $text : { $search : req.query.search,  $language: "french"}}).toArray((err,docEmployee)=>{
                dbo.collection("animal").find().toArray((err,docAnimalTF)=>{
                    dbo.collection("employee").find().toArray((err,docEmployeeTF)=>{
                        dbo.collection("timetable").find().toArray((err,docTimetable)=>{

                            var result_search = searchHelp.search(docAnimalTF.concat(docEmployeeTF), req.query.search, docTimetable)
                            var finalResult = searchHelp.merge(result_search, docAnimal, docEmployee)
                            console.log(finalResult)

                            if (finalResult.length === docAnimalTF.concat(docEmployeeTF).length){
                                return res.render("animal_schedule.html", {error : "Aucun résultat trouvé en particulier"})   // à changer
                            }
                            else{
                                // displaySchedule(result_search)
                                res.redirect("/")
                            }
                        })
                    })
                })
            })
        })

    })

    

    // ajouts de routeurs
    app.use("/modif",dataModifs.dataModifiers)
    app.use("/tools", DBTools.DBTools)
    app.use("/log", logs.logRouter)
    app.use("/schedule",AniSchRouter.AniSchRouter)

    app.use(express.static('static'));



    app.get('*', (req, res) => {
        req.session.theme = req.session.theme || "light"
        res.status(404).render("404.html", {mode : req.session.theme});
    });
})



