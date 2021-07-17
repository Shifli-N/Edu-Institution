const mongoose = require('mongoose');
require('dotenv').config();


const {log} = require('../utils/winstonLogger');


function connectDB(DB_PATH){
    //console.log(DB_PATH);

    mongoose.connect(DB_PATH, {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true,
    } )
    .then(function(){
        console.log("MongoDB is Connected !!");
    })
    .catch(function(error){
        // console.log(`ERROR is Occured on MongoDB Connnection, \n\t => ${error}`);
        log.error(`ERROR is Occured on MongoDB Connnection, \n\t => ${error}`);
    });
   
}

module.exports = connectDB;