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


var searchHelp = require('./server_scripts/search')

var app = express ();

app.engine('html', consolidate.hogan)
app.set('views','templates');
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

    //temporaire
    app.get("/",(req,res)=>{
        req.session.lastpage = "/"
        res.redirect("/schedule/animal_schedule")
    })

    app.get("/animal_schedule.html",function(req,res){
        res.render("animal_schedule.html")

    })

    app.get("/upnav_site",(req,res)=>{
        if (req.session.connected){
            var connectedLink = "/log/profil"   // provisoire
            var connected = "Profil"
        }else{
            var connectedLink = "/log/connect"   // provisoire   style="opacity:1;{{display}}"
            var connected = "Connexion"
        }
        if (req.session.isAdmin){
            var display =  "opacity:1;"
        }else{
            var display = "opacity:1;display:none"
        }
        return res.render("upnav_site.html", {ConnectionLink : connectedLink, Connected : connected, display : display})
    })

    app.get('/ChangeMode', (req,res)=>{
        req.session.theme = req.session.theme === "light" || !(req.session.theme) ? "dark" : "light"
        res.redirect(req.session.lastpage)
    })

    app.get("/search", (req,res)=>{
        /** 
        dbo.collection("animal").find({ $text : { $search : req.query.search,  $language: "french"}}).toArray((err,docAnimal)=>{
            dbo.collection("employee").find({ $text : { $search : req.query.search,  $language: "french"}}).toArray((err,docEmployee)=>{
                if (docAnimal.length === 0 && docEmployee.length === 0 ){
                    // TF-IDF
                }
                console.log(docAnimal.concat(docEmployee))
                // displaySchedule(docAnimal.concat(docEmployee))
            })
        })*/


        //TF-IDF
        dbo.collection("animal").find().toArray((err,docAnimal)=>{
            dbo.collection("employee").find().toArray((err,docEmployee)=>{
                dbo.collection("timetable").find().toArray((err,docTimetable)=>{

                    var result_search = searchHelp.search(docAnimal.concat(docEmployee), docTimetable, req.query.search)
                    //console.log(result_search)
                    if (result_search.length === docAnimal.concat(docEmployee).length){
                        //error
                    }
                    // displaySchedule(result_search)
                })
            })
        })
        res.redirect("/")
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



