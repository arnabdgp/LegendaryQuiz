var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var StudentModel = require('../models/user');

var query = 'mongodb+srv://NewDB:helloworld@cluster0.sc7pm.mongodb.net/mydb?retryWrites=true&w=majority';

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