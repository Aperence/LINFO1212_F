const express = require('express');
const router = express.Router();
const modifierHelp = require("./../server_scripts/modifiers")


router.get("/animalmodif",(req,res)=>{
    var renderObject = modifierHelp.makeRenderObject(true,"test");
    console.log(renderObject)
    return res.render("animalStaffModification.html",renderObject)
})

router.get("/staffmodif",(req,res)=>{
    var renderObject = modifierHelp.makeRenderObject(false,"test2");
    return res.render("animalStaffModification.html",renderObject)
})


router.get("/upnav_site",(req,res)=>{
    return res.render("upnav_site.html")
})


router.use(express.static('static'));

module.exports = {
    "DataModifiers" : router
}