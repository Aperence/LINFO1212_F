const express = require('express');
const router = express.Router();


router.get("/animalmodif",(req,res)=>{
    return res.render("AnimalModification.html")
})

router.get("/staffmodif",(req,res)=>{
    return res.render("StaffModification.html")
})

module.exports = {
    "DataModifiers" : router
}