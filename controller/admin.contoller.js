const {check,validationResult} = require('express-validator');
const CreateError = require('http-errors');


const Admin = require('../models/Admin.model');
const {CreateHash, ComparePassword} = require('../utils/Bcryptor');
const Staff = require('../models/Staff.model');
const EduClass = require('../models/Class.model');


const adminLoginCheck = [
    check('userName').notEmpty().withMessage('Username is Require'),
    check('userName').optional().isString().withMessage('Username must be String'),

    check('password').notEmpty().withMessage('Password is Required'),
    check('password').optional().isLength({min:5}).withMessage('Password length must be Greater than 5'),

    check('confirmPassword').notEmpty().withMessage('Confirm Password is Require'),
    check('confirmPassword').optional().isLength({min:5}).withMessage('Confirm Password length must be Greater than 5'),

    check('confirmPassword').custom(function(conPass, {req}){
        if(conPass === req.body.password){
            return true;
        }
    }).withMessage('Passwod Mismatch'),
];


const adminLogin = async function(req,res,next){
    try{
        const validationError = validationResult(req);

    if(!validationError.isEmpty()){
        console.log(validationError);

        return res.status(400).json({
            success:false,
            errors :validationError.errors.map(item => item.msg),
        });
    }

    const result = await Admin.findOne({userName:req.body.userName});

    if(!result){
        throw CreateError(404,'No User is Found');
    }

    console.log(result);

    const isCorrectPassword = await ComparePassword(req.body.confirmPassword, result.password);

    if(!isCorrectPassword){

        return res.status(400).json({
            success: false,
            error : 'Login is Failed',
            message:'Please Check the Crenditial twice',
        });

    }

    res.status(200).json({
        success: true,
        message: 'Admin is Successfully Logged',
    });

    }catch(err){
        console.log(err);
        next(err);
    }
    
}


const createStaffCheck = [
    check('sId').notEmpty().withMessage('Staff ID is Require'),
    
    check('staffName').notEmpty().withMessage('Staff Name is Require'),

    check('personalInformation').notEmpty().withMessage('Personal Information field is Require'),

    check('personalInformation').optional()
        .custom(function(value,{req}){
            if(req.body.personalInformation.gender){
                return true;
            }
        })
        .withMessage('Persnal Information, Gender is Required')

        .custom(function(value,{req}){
            if(req.body.personalInformation.address){
                return true;
            }
        })
        .withMessage('Persnal Information, Address is Required')

        .custom(function(value,{req}){
            if(req.body.personalInformation.maritalStatus){
                return true;
            }
        })
        .withMessage('Persnal Information, Marital Status is Required')

        .custom(function(value,{req}){
                if(req.body.personalInformation.contact){
                    return true;
                }
        })
        .withMessage('Persnal Information, Contact is Required')

        .custom(function(value,{req}){
            
            if(req.body.personalInformation.contact){
                if(req.body.personalInformation.contact.phone){
                    return true;
                }

                return false;
            }

            return true;
        })
        .withMessage('Contact Phone No is Required')
    ,

    
    check('educationQualification').notEmpty().withMessage('Required Educational Qualification Details'),


    check('educationQualification').optional()
        .custom((value,{req}) => {
            return req.body.educationQualification.SSLC && 
                Object.keys(req.body.educationQualification.SSLC).length > 0
         })
        .withMessage('SSLC is details is Required')

        .custom((value,{req}) => {
            return req.body.educationQualification.HSLC && 
                Object.keys(req.body.educationQualification.HSLC).length > 0
         })
        .withMessage('HSLC is details is Required')

        .custom((value,{req}) => {
            return req.body.educationQualification.UG && 
                Object.keys(req.body.educationQualification.UG).length > 0
         })
        .withMessage('UG is details is Required')

        .custom((value,{req}) => {
            return req.body.educationQualification.PG && 
                Object.keys(req.body.educationQualification.PG).length > 0
         })
        .withMessage('PG is details is Required')
    ,
        

    check('academicInformations').notEmpty().withMessage('Academic Information is Required'),

    check('academicInformations').optional()
        .isArray().withMessage('Expecting Academinc Information is list')
    ,
    
    check('dateOfJoin').exists().withMessage('Date of Join is Required'),
    
    check('salary').notEmpty().withMessage('Salary Information is Required'),

    check('exprience').notEmpty().withMessage('Experience Information is Required'),


    check('loginCredentials').notEmpty().withMessage('To Create Staff, Login Credential is Required'),

    check('loginCredentials').optional()
        .custom((value,{req}) => {
            return req.body.loginCredentials.userName && 
                    req.body.loginCredentials.password && 
                     req.body.loginCredentials.confirmPassword 
        })
        .withMessage('User Name, Password & Confirm Password is Required')
    ,

    
    check('loginCredentials').optional()
        .custom((value,{req}) => {
            if(req.body.loginCredentials.password && req.body.loginCredentials.confirmPassword){
                return  req.body.loginCredentials.password === req.body.loginCredentials.confirmPassword;
            }

            return true;
        })
        .withMessage('Password and Confirm Password is Mismatch')
    ,


];


const createStaff = async function(req,res,next){
    try{
        const body = req.body;
        //console.log(body);

        const validationError = validationResult(req);

        console.log(validationError)

        if(!validationError.isEmpty()){
            console.log(validationError);
            
            return res.status(400).json({
                success:false,
                errors : validationError.errors.map(i => i.msg),                
            });
        }

        delete req.body.loginCredentials.confirmPassword;

        const staffModel = new Staff(req.body)
        const result = await staffModel.save()

        res.status(200).json({
            success:true,
            message: 'Staff Successfully created!',
            data: `Created user name is ${result.loginCredentials.userName}`
        })


        // res.send(result);

        //res.send(req.body);

    }catch(err){
        console.log(err);
        next(err);
    }
}



const staffLoginCheck = [
    check('userName', "User Name is Required").notEmpty(),
    check('password','Password is Required').notEmpty(),
    check('confirmPassword','Confirm Password is Required').notEmpty(),

    check('confirmPassword', 'Password mismatch').optional()
        .custom( function(value, {req}){
            return value === req.body.password;
        })
    ,
]


const staffLogin = async function(req,res,next){
    try{
        console.log(`${req.body.password} ${req.body.confirmPassword}`)
        // if(req.body.password != req.body.confirmPassword){
        //     throw CreateError(400,"Password Mismatch");
        // }


        const validationError = validationResult(req);

        if(!validationError.isEmpty()){
            return res.status(400).json({
                success:false,
                errors : validationError.errors.map(it => it.msg)
            });
        }


        const staff = await Staff.findOne({"loginCredentials.userName": req.body.userName});

        if(!staff){
            return res.json({
                success:true,
                message:"No Data is Found"
            })
        }

        const isValid = await staff.comparePassword(req.body.password, staff.loginCredentials.password);
        
        if(!isValid){
            throw CreateError(400, "Invalid Password");
        }

        if(isValid){
            res.json({
                success: true,
                message: `${staff.loginCredentials.userName} is Successfully Logged`,
            });
        }


    }catch(err){
        console.log(err);
        next(err);
    }
}


const getStaffDetail = async function(req,res,next){
    try{
        console.log(req.query.userName);

        const result = await Staff.find(
            { "loginCredentials.userName":req.query.userName },
            {
                __v:0,
                _id:0,
                "loginCredentials.password":0,
            }
        );

        if(!result || result.length == 0){
            throw CreateError(200,"No User is found");
        }

        res.send(result);

    }catch(err){
        console.log(err);
        next(err);
    }
}


const showAllStaffs = async function(req,res,next){
    try{

        const result = await Staff.find({},
            {__v:0, _id:0, "loginCredentials.password":0}
        );

        if(!result || result.length == 0){
            throw CreateError(200,"No Record is found");
        }

        res.send(result);

    }catch(err){
        console.log(err);
        next(err);
    }
}


const removeStaffCheck = [
    check('sId','Required sId').notEmpty(),
    check('staffUserName','Required User Name').notEmpty(),
]


const removeStaff = async function(req,res,next){
    try{

        const validationError = validationResult(req);

        if(!validationError.isEmpty()){
            return res.status(400).json({
                success:false,
                errors : validationError.errors.map( it => it.msg),
            });
        }

        const result = await Staff.findOne(
            {"loginCredentials.userName":req.body.staffUserName}
        )

        if(!result || result.length < 0){
            throw CreateError(404,'No Record is Found');
        }

        const rem = await result.remove();

        res.json({
            success:true,
            message:`${rem.loginCredentials.userName} is Deleted successfully`,
        })


    }catch(err){
        console.log(err);
        next(err);
    }
}


const createClassCheck = [
    check('className').notEmpty().isString().withMessage('Required Class Name'),
    check('classCode').notEmpty().isString().withMessage('Required Class Code'),
    check('maxStrength', 'Invalid maxStrength').notEmpty()
        .isNumeric()
        .custom( (val) => val >= 10)
    ,
    
    check('classIncharge').notEmpty().isArray().withMessage('Required Class Incharges'),
    check('classIncharge').optional()
        .custom((val, {req}) => {
            return req.body.classIncharge.length > 0;
        })
        .withMessage('Required Atleast One Class Incharge')
    ,


    check('subjects').notEmpty().isObject().withMessage('Required Subject for Class'),

    check('subjects').optional()
        .custom((value,{req}) => Object.keys(req.body.subjects).length > 0)
        .withMessage("Required atleast One Subject")
    ,

    check('createdUser').notEmpty().isString().withMessage('Required Created User'),
    
    check('createdOn')
        .isString()
        .withMessage('Required Date field is String')
        .custom(function(value){
        console.log(value);
        console.log(new Date(value));
        console.log(Date.parse(value));

        if(Number.isNaN(Date.parse(value))){
            return false;
        }

        return true;
    })
    .withMessage('Invalid Date format'),

]


const createClass = async function(req,res,next){
    try{

        const validationError = validationResult(req);

        if(!validationError.isEmpty()){
            console.log(validationError)
            return res.status(400).json({
                success:false,
                error: validationError.errors.map( i => i.msg),
            });
        }

        req.body.createdOn = new Date(req.body.createdOn);

        const result = await new EduClass(req.body).save();

        if(result){
            res.send(`Class Name ${result.className} is created Successfully`);
        }

    }catch(err){
        console.log(err);
        next(err);
    }
}


const showAllClasses = async function(req,res,next){
    try{

        const result = await EduClass.find();

        if(result.length == 0){
            throw CreateError(404,'No Record is Found');
        }

        res.send(result);

    }catch(err){
        console.log(err);
        next(err);
    }
}


const getClassDetails = async function(req,res,next){
    try{

        const result = await EduClass.findOne({classCode:req.params.id},{__v:0,_id:0});
        
        if(!result){
            throw CreateError(404,'No Record is Found');
        }

        res.send(result);

    }catch(err){
        console.log(err);
        next(err);
    }
}


const removeClassCheck = [
    check('className','Required Class Name').notEmpty(),
    check('classCode','Required Class Code').notEmpty(),
]


const removeClass = async function(req,res,next){
    try{

        const validationError = validationResult(req);

        if(!validationError.isEmpty()){
            res.status(404).json({
                success:false,
                error: validationError.errors.map(i => i.msg),
            });
        }

        const result = await EduClass.findOne({classCode:req.body.classCode});

        if(!result){
            throw CreateError(404,"No Record is Found");
        }

        const temp = await result.remove();

        if(temp){
            res.send(`Class ${result.className} is Deleted Successfully`);
        }

    }catch(err){
        console.log(err);
        next(err);
    }
}



module.exports = {
    adminLoginCheck,
    adminLogin,

    createStaffCheck,
    createStaff,

    staffLoginCheck,
    staffLogin,

    getStaffDetail,

    showAllStaffs,

    removeStaffCheck,
    removeStaff,

    createClassCheck,
    createClass,

    showAllClasses,
    getClassDetails,

    removeClassCheck,
    removeClass,
}