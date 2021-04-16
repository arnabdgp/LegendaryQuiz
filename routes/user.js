require('dotenv').config()
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var StudentModel = require('../models/user');

var query = process.env.MONGO_URI;

const db = query;
mongoose.Promise = global.Promise;

mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology:true},function(error){
    if(error){
        console.log("Error!"+error);
    }
    else{
        console.log("Database Connected");
    }
});

module.exports = router;