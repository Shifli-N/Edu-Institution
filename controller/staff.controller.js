const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;
const CreateError = require('http-errors');

const Joi = require('../models/joi-validation/JoiValidation');
const Content = require('../models/Content.model');
const EventModel = require('../models/Event.model');
const StudentModel = require('../models/Student.model');
const StaffModel = require('../models/Staff.model');
const NotifyModel = require('../models/Notification.model');


exports.staffLogin = async function(req,res,next){
    try {
        
        const loginSchema = await Joi.staffLoginSchema.validateAsync(req.body);
        
        const result = await StaffModel.findOne({"loginCredentials.userName":loginSchema.userName}, {__v:0, _id:0});

        if(!result){
            throw CreateError(404,"No Staff is Found");
        }

        const isCredentialIsValid = await result.comparePassword(loginSchema.confirmPassword);

        if(!isCredentialIsValid){
            throw CreateError(401,"Invalid Credentials");
        }else{
            res.json({
                success:true,
                message:`Staff ${result.staffName} is Successfully logged`,
            });
        }

    } catch (err) {
        console.warn(err);
        next(err);
    }
}


exports.createStudent = async function(req,res,next){
    try {
        
        const studentSchema = await Joi.createStudentSchema.validateAsync(req.body);

        console.info(JSON.stringify(studentSchema,"",2));

        const result = await new StudentModel(studentSchema).save();

        res.json({
            success:true,
            msg: `Student ${result.studentName} in ${result.class} created Successfully`,
        });

        //res.send(studentSchema);

    } catch (err) {
        console.warn(err);
        next(err);
    }
}


exports.showAllStudents = async function(req,res,next){
    try {
        
        const result = await StudentModel.find({},{__v:0,_id:0,"loginCredentials.password":0});

        if(result.length == 0){
            throw CreateError(404, 'No Record is Found');
        }

        res.json({
            success:true,
            data: result,
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
}


exports.showStudentsByClass = async function(req,res,next){
    try {
        const result = await StudentModel.find({class:req.params.className},{__v:0, _id:0, "loginCredentials.password":0});

        if(result.length == 0){
            throw CreateError(404, "No Record is Found");
        }

        res.json({
            success:true,
            data:result,
        })

    } catch (err) {
        console.warn(err)
        next(err);
    }
}


exports.showStudentById = async function(req,res,next){
    try {
        const result = await StudentModel.findOne({sId:req.params.id},{__v:0, _id:0, "loginCredentials.password":0});

        if(!result){
            throw CreateError(404, "No Record is Found");
        }

        res.json({
            success:true,
            data:result,
        })

    } catch (err) {
        console.warn(err)
        next(err);
    }
}


exports.showStudentByUserName = async function(req,res,next){
    try {
        const result = await StudentModel.findOne({"loginCredentials.userName":req.params.username.toLowerCase()},{__v:0, _id:0, "loginCredentials.password":0});

        if(!result){
            throw CreateError(404, "No Record is Found");
        }

        res.json({
            success:true,
            data:result,
        })

    } catch (err) {
        console.warn(err)
        next(err);
    }
}


exports.removeStudent = async function(req,res,next){
    try {

        const removeSchema = await Joi.removeStudentSchema.validateAsync(req.body);

        const query = {
            $and : [
                {sId: removeSchema.sId},
                {class: removeSchema.class},
                {studentName: removeSchema.studentName},
                {"loginCredentials.userName": removeSchema.userName}
            ]
        }

        const result = await StudentModel.findOne(query)

        if(!result){
            throw CreateError(404,"No Student is Found")
        }

        await result.remove()

        res.json({
            success:true,
            message:`Studet ${result.studentName} in ${result.class} is Removed Successfully`,
        });

    } catch (err) {
        console.warn(err);
        next(err);
    }
}


exports.createEvents = async function(req,res,next){
    try{

        const eventArray = await Joi.createEventSchema.validateAsync(req.body);

        console.log(eventArray.events.length)

        let finalRes = [];

        for(let i = 0; i < eventArray.events.length; i++){
            console.log(eventArray.events[i]);
            const eventItem = await Joi.eventArrayItem.validateAsync(eventArray.events[i]);

            const eventItemResult = await new EventModel(eventItem).save();

            delete eventItemResult._id
            delete eventItemResult.__v

            finalRes.push(eventItemResult);
        }

        res.send(finalRes);

    }catch(err){
        console.warn(err);
        next(err);
    }
}


exports.showAllEvents = async function(req,res,next){
    try{
        const result = await EventModel.find({},{__v:0,_id:0});

        if(result.length == 0){
            throw CreateError(404, "No Record is Found");
        }

        res.send(result);

    }catch(err){
        console.warn(err);
        next(err);
    }
}


exports.showEventByClass = async function(req,res,next){
    try {
        
        const result = await EventModel.find({assignedTo:req.query.Class}, {__v:0, _id:0});

        console.log(result);

        if(result.length == 0){
            throw CreateError(404, "No Record is Found");
        }

        res.send(result);

    } catch (er) {
        console.warn(er);
        next(er);
    }
}


exports.showEventByDate = async function(req,res,next){
    try {
        
        const result = await EventModel.find({eventDate:req.query.Date}, {__v:0, _id:0});

        if(result.length == 0){
            throw CreateError(404,'No Record is Found');
        }

        res.json({
            success:true,
            data: result,
        });

    } catch (err) {
        console.warn(err);
        next(err);
    }
}



const myStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'resources/static/sampleAssert')
    },

    filename: function(req,file,cb){
        const ext = path.extname(file.originalname);
        const name = path.parse(file.originalname).name;
        const uid = uuid();
        const finalFileName = `${name}-${uid}${ext}`

        cb(null, finalFileName);
    }
});

exports.uploadSingleFile = multer(
    {
        storage:myStorage,

        fileFilter: (req,file,cb) => {
            if(
                file.mimetype == "application/pdf" || file.mimetype == "application/docs" ||
                file.mimetype == "text/plain" || file.mimetype == "application/msword" ||
                file.mimetype == "application/vnd.ms-powerpoint" || file.mimetype == "application/msword"
            ){
                cb(null,true);
            }else{
                return cb(CreateError(400,"Invalid File Format"))
                //cb(null,false);
                //return new CreateError(400, "This File Format is not Allowed");
            }
        }
    }
).single('avatar');

exports.createContents = async function(req,res,next){
    try {
        
        const joiResult = await Joi.createContents.validateAsync(req.body)

        if(!req.file){
            throw CreateError(400, "File is Required");
        }

        joiResult.filePath = req.file.path

        // const result = new Content(re`)

        console.log(joiResult);

        const result = new Content(joiResult);
        const finalRes = await result.save();

        res.send(finalRes);

    } catch (err) {
        console.warn(err);
        next(err);
    }
}


exports.showAllContents = async function(req,res,next){
    try{
        const result = await Content.find({},{__v:0, _id:0});

        if(result.length == 0){
            throw CreateError(404, "No Record is Found");
        }

        res.json({
            success:true,
            data:result,
        })

    }catch(err){
        console.warn(err);
        next(err);
    }
}


exports.showContentByClassName = async function(req,res,next){
    try{
        const result = await Content.find({class:req.params.className}, {__v:0, _id:0});

        if(!result || result.length == 0){
            throw CreateError(404, "No Record is Found");
        }

        res.json(
            {
                success:true,
                data : result,
            }
        );

    }catch(err){
        console.warn(err);
        next(err);
    }
}


exports.createNotification = async function(req,res,next){
    try{
        const notifySchema = await Joi.createNotificationSchema.validateAsync(req.body);

        const result = await new NotifyModel(notifySchema).save();

        res.json({
            success:true,
            message: `Notification of \"${result.notificationHeading}\" on \"${result.date}\" is Created Successfully.`,
        })

        // res.send(notifySchema)

    }catch(err){
        console.warn(err);
        next(err);
    }
}


exports.showAllNotification = async function(req,res,next){
    try {
        
        const result = await NotifyModel.find({},{_id:0,__v:0});

        if(result.length == 0){
            throw CreateError(404, 'No Record is Found');
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


exports.showNotificationForClass = async function(req,res,next){
    try {
        
        const result = await NotifyModel.find({class:req.params.class},{_id:0,__v:0});

        if(result.length == 0){
            throw CreateError(404, 'No Record is Found');
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


exports.showNotificationByDate = async function(req,res,next){
    try {
        
        const result = await NotifyModel.find({date:req.query.Date},{_id:0,__v:0});

        if(result.length == 0){
            throw CreateError(404, 'No Record is Found');
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

exports.showNotification = async function(req,res,next){
    try {
        
        const query = {
            $and : [
                {class:req.params.class},
                {date:req.query.Date},
            ]
        }

        const result = await NotifyModel.find(query, {_id:0,__v:0});

        if(result.length == 0){
            throw CreateError(404, 'No Record is Found');
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