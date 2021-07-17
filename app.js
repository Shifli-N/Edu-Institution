const express = require('express');
const CreateError = require('http-errors');
const connectDB = require('./utils/dbConfig');
require('dotenv').config();


// const CreateError = require('./utils/CreateError');
const connectMongoDB = require('./utils/dbConfig');

const superAdmin = require('./src/superAdmin');
const admin = require('./src/admin');
const staff = require('./src/staff');
const student = require('./src/student');
const { ValidationError } = require('joi');
const { reqLog } = require('./utils/winstonLogger');


const app = express();

const PORT = process.env.PORT;
const DB_PATH = process.env.DB_URI;

app.use(express.json({}));

connectDB(DB_PATH);

//for request log
app.use(function(req,res,next){
    reqLog(`${req.method} ${req.url}`);
    
    if(Object.keys(req.body).length > 0){
        reqLog(`${JSON.stringify(req.body)}`);
    }

    next();
});


app.all('/', async function(req,res,next){

    if(!req.body || Object.keys(req.body).length === 0 ){
     return res.send('Welcome Home');
    }

    res.send(req.body);
});

// SuperAdmin Router
app.use('/superAdmin',superAdmin);


//Admin Router
app.use('/admin',admin);


//Staff Router
global.__basedir = __dirname
// console.log(__basedir);
app.use('/staff',staff);


//Student Router
app.use('/student',student);



app.use(function(req,res,next){
    const err =  CreateError(404,'Page is Not Found');

    next(err);
});


// error handling
app.use(function(err,req,res,next){

    if(err instanceof ValidationError){
        err.status = 400;
    }

    res.status(err.status || 500);
    res.send({
        success:false,
        error: {
            status : err.status || 500,
            message: err.message,
        },
    });
});



app.listen(PORT,function(){
    console.log(`SERVER RUNNING ON ${PORT}`)
});