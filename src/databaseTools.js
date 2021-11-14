const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient


var prefix = "/tools"




router.use(express.static('static'));

module.exports = {
    "DBTools" : router
}