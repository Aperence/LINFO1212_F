const express = require('express');
var MongoClient = require('mongodb').MongoClient
var fs = require('fs');
var generate = require("../server_scripts/randomGeneration")

const router = express.Router();

var prefix = "/tools"


MongoClient.connect('mongodb://localhost:27017', (err,db)=>{

    dbo = db.db('site')
    // ajouter des événements facilement ->> à retirer
    router.get("/append", (req,res)=>{
        console.log("append")
        generate.randomCollections(dbo)
        res.redirect("/")
    })

    // reset la base de donnée ->> à retirer
    router.get("/clear", (req,res)=>{
        dbo.collection("timetable").deleteMany({});
        dbo.collection("employee").deleteMany({});
        dbo.collection("animal").deleteMany({});
        res.redirect("/")
    })

    // permet de créer un fichier JSON contenant tous les incidents de la base de donnée
    router.get("/serialize", (req,res) =>{
        
        dbo.collection("timetable").find({}).toArray((err,doc)=>{
            if (err) console.log(err)
            var str = []
            for (let i of doc){
                str.push(JSON.stringify(i))
            }
            fs.writeFile("database_save/timetableSave.json",JSON.stringify({list : str}),(err)=>{
                console.log("Done appending")
            })
        })

        dbo.collection("animal").find({}).toArray((err,doc)=>{
            if (err) console.log(err)
            var str = []
            for (let i of doc){
                str.push(JSON.stringify(i))
            }
            fs.writeFile("database_save/animalSave.json",JSON.stringify({list : str}),(err)=>{
                console.log("Done appending animal")
            })

        })
        
        dbo.collection("employee").find({}).toArray((err,doc)=>{
            if (err) console.log(err)
            var str = []
            for (let i of doc){
                str.push(JSON.stringify(i))
            }
            fs.writeFile("database_save/employeeSave.json",JSON.stringify({list : str}),(err)=>{
                console.log("Done appending employee")
            })
        })

        res.redirect("/")
    })

    // permet de recréer la base de donnée à partir du fichier JSON sérialisé
    router.get("/deserialize", (req,res)=>{
        fs.readFile("database_save/animalSave.json", (err,data)=>{
            data = JSON.parse(data)
            for (let item of data.list){
                item = JSON.parse(item)
                dbo.collection("animal").insertOne(item)
            }
        })

        fs.readFile("database_save/employeeSave.json", (err,data)=>{
            data = JSON.parse(data)
            for (let item of data.list){
                item = JSON.parse(item)
                dbo.collection("employee").insertOne(item)
            }
        })

        fs.readFile("database_save/timetableSave.json", (err,data)=>{
            data = JSON.parse(data)
            for (let item of data.list){
                item = JSON.parse(item)
                dbo.collection("timetable").insertOne(item)
            }
        })

        res.redirect("/")
    })
})

router.use(express.static('static'));

module.exports = {
    "DBTools" : router
}