const CreateError = require('http-errors');


const JoiValidator = require('../models/joi-validation/JoiValidation');
const Student = require('../models/Student.model');
const Content = require('../models/Content.model');
const Event = require('../models/Event.model');
const Notification = require('../models/Notification.model');


exports.studentLogin = async function(req,res,next){
    try{
        
        const schema = JoiValidator.studentLoginSchema;

        const joiResult = await schema.validateAsync(req.body);

        //console.log(joiResult);

        const student = await Student.findOne({"loginCredentials.userName":joiResult.username});

        if(!student){
            throw CreateError(404,"User is not Found");
        }

        const isValidUser = await student.comparePassword(joiResult.confirmPassword);

        if(!isValidUser){
            return res.status(400).json({
                success:false,
                error:"Wrong Username or Password",
            })
        }else{
            return res.json({
                success:true,
                message:`Student ${student.loginCredentials.userName} is Logged Successfully`,
            });
        }

        //res.send(joiResult);

        //res.send(req.body)

    }catch(err){
        console.warn(err);
        next(err);
    }
}

exports.getStudentDetails = async function(req,res,next){
    try {
        const result = await Student.findOne({studentName: req.body.name}, {loginCredentials:0, _id:0, __v:0});

        if(!result){
            throw CreateError(404, "No Record is Found");
        }

        res.json({
            success: true,
            data : result,
        });

    } catch (err) {
        console.warn(err);
        next(err);
    }
}


exports.getContent = async function(req,res,next){
    try{
        const query = {
            $and : [
                {"class": req.params.class},
                {"createdOn": req.params.date},
            ]
        };

        //console.log(query);
        console.log(req);

        const result = await Content.find(query,{__v:0, _id:0});

        if(!result.length > 0){
            throw CreateError(404, 'No Record is Found');
        }

        res.json({
            success:true,
            data:result,
        });
        

    }catch(err){
        console.warn(err);
        next(err);
    }
}


exports.getNotification = async function(req,res,next){
    try {
        const query = {
            $and : [
                {date : req.query.Date},
                {class: req.params.class},
            ]
        }

        const result = await Notification.find(query,{__v:0,_id:0});

        if(!result.length > 0){
            throw CreateError(404,'No Record is Found');
        }

        res.json({
            success:true,
            data:result,
        });

    } catch (err) {
        console.warn(err);
        next(err);
    }
}

exports.getEvent = async function(req,res, next){
    try {
        const query = {
            $and : [
                {eventDate : req.query.Date},
                {assignedTo : req.params.class},
            ]
        };

        const result = await Event.find(query, {__v:0, _id:0});

        if(!result.length > 0){
            throw CreateError(404,'No Record is Found');
        }

        res.json({
            success:true,
            data:result,
        });

    } catch (err) {
        console.warn(err);
        next(err);
    }
}