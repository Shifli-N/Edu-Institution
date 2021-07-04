const CreateError = require('http-errors');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');


const SuperAdmin = require('../models/SuperAdmin.model');
const Admin = require('../models/Admin.model');


const superAdminCreationCheck = [
    check('superAdminUserName').notEmpty().withMessage('Super Admin Username is Require'),
    check('superAdminUserName').optional().isString()
    .withMessage('Super Admin Username must be String'),


    check('superAdminPassword').notEmpty().withMessage('Super Admin Password is Require'),
    check('superAdminPassword').optional().isLength({ min : 5, })
    .withMessage('Password Length must be greater than 5'),


    check('superAdminConfirmPassword').notEmpty().withMessage('Super Admin Confirm Password is Require'),
    check('superAdminConfirmPassword').optional().isLength({ min : 5, })
    .withMessage('Super Admin Confirm Password must be greater than 5'),

    
    check('superAdminConfirmPassword').optional().custom(function(pass,{req}){
        if(pass === req.body.superAdminPassword){
            return true;
        }
    }).withMessage('Password Mismatch'),


    check('emailId').notEmpty().withMessage('Super Admin Email-Id is Require'),
    check('emailId').optional().isEmail().normalizeEmail()
    .withMessage('Invalid Email-Id'),
]


const createSuperAdminLogin = async function(req,res,next){
    try{
        const validationError = validationResult(req);

        if(!validationError.isEmpty()){
            console.log(validationError);

            res.status(400).json({
                success:false,
                errors : validationError.errors.map(item => item.msg),
            })
        }

        let result = await SuperAdmin.find();

        if(result.length > 0){
           throw CreateError(400,'Already SuperAdmin is Created');
        }

        const superAdmin = SuperAdmin();
        superAdmin.userName = req.body.superAdminUserName.trim().toLowerCase();
        superAdmin.emailId  = req.body.superAdminPassword;
        superAdmin.password = await createHash(req.body.superAdminConfirmPassword);

        result = await superAdmin.save()

        res.status(200).json(
            {
                success:true,
                message:`Super Admin ${result.userName} is Created Successfully.`,
            }
        )

        //res.end();

    }catch(err){
        console.log(err);
        next(err);
    }
}




const loginCheck = [
    check('userName').notEmpty().withMessage('Require Username for Login'),
    check('password').notEmpty().withMessage('Require Password for Login'),
    check('confirmPassword').notEmpty().withMessage('Require Confirm Password for Login'),
    //check('password').equals(req.body.confirmPassword).withMessage('Password Mismatch'),
]



const superAdminLogin = async function(req,res,next){
    try{
        const error = validationResult(req);
        //console.log(error);

        if(!error.isEmpty()){
            res.status(400).json({
                success:false,
                errors: error.errors.map(item => item.msg),
            });
            return;
        }

        const userName = req.body.userName.trim().toLowerCase();
        const pass = req.body.password;
        const confirmPass = req.body.confirmPassword;

        if(pass != confirmPass){
            res.status(400).json({
                success: false,
                errors: 'Password and Confirm Password is mismatch'
            });

            return;
        }


        // testing bcrypt

        /*const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(confirmPass,salt);
        console.log(`password hash - ${hashPass}`);

        const isCorrect = await bcrypt.compare(confirmPass, "$2b$10$veUQbtoI60k4tgSEoXxKQ.4l61sF32pntimPdplrz7Dtj.UDe9Ifq");
        console.log(`db and given pass isCorrect ${isCorrect}`); */


        // to create superAdmin Password

       /* const sup = new SuperAdmin(req.body);
        const salt = await bcrypt.genSalt(10)
        sup.password = await bcrypt.hash(sup.password, salt);
        sup.userName = sup.userName.trim().toLowerCase();

        const insert = await sup.save(); */
        

        const superAdmin = await SuperAdmin.findOne();

        //console.log(superAdmin);

        if(userName != superAdmin.userName){
            throw CreateError(401,'Invalid User Name');
        }


        const isValidPassword = await bcrypt.compare(confirmPass, superAdmin.password);

        if(!isValidPassword){
            throw CreateError(401,'Invaild Password');
        }


        res.status(200).json({
            success : true,
            message : "User Credential is Successfully Matched",
            data:superAdmin.password,
        });

        
    }catch(err){
        console.log(err);
        return next(err);
    }
}


async function createHash(pass){
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(pass,salt);

    return hashPass;
}


const createAdminCheck = [
    check('name').notEmpty().withMessage('Require Admin Name')
    .isString().withMessage('Admin Name must be String'),

    check('email').optional().isEmail()
    .normalizeEmail().withMessage('Require valid Email Id'),

    check('userName').notEmpty().withMessage('Require Admin User Name')
    .isString().withMessage('Admin User Name must be String'),

    check('password').notEmpty().withMessage('Require Admin Password')
    .isLength({min:4}).withMessage('Require Password Length is more than 4'),

    check('confirmPassword').notEmpty().withMessage('Require Admin Confirm Password')
    .isLength({min:4}).withMessage('Require Confirm Password Length is more than 4'),


    check('confirmPassword').custom(function(confirmPass,{req}){
        if(confirmPass === req.body.password){
            return true;
        }
    }).withMessage('Password is mismatch'), 

];


const createAdmins = async function(req,res,next){
    try{

        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()){
            console.log(validationErrors);
            
            return res.status(400).json({
                success : false,
                errors : validationErrors.errors.map( err => err.msg ),
            });
        }

        const adminModel = new Admin(req.body);
        adminModel.userName = adminModel.userName.trim().toLowerCase();
        adminModel.password = await createHash(req.body.confirmPassword);

        const result = await adminModel.save();

        if(result._id){
            res.status(200).json({
                success:true,
                message:"Admin is Successfully Created."
            });
        }else{
            throw CreateError(400,'Ops, Something went wrong!');
        }
    }catch(err){
        console.log(err);
        return next(err);
    }
}


const showAllAdmins = async function(req,res,next){
    try{
        const result = await Admin.find({},{ __v:0, password:0 });

        if(result.lenght == 0){
            throw CreateError(404,"No Admins are Found");
        }

        res.send(result);

    }catch(err){
        console.log(err);
        next(err);
    }
}


const getAdminDetails = async function(req,res,next){
    try{
        //console.log(req.query);
        const result = await Admin.find({userName:req.query.username},{__v:0,password:0});

        if(result.length == 0){
            throw CreateError(404,'No Admin Record is Found');
        }

        res.send(result);

    }catch(err){
        console.log(err);
        next(err);
    }
}



const removeAdmins = async function(req,res,next){
    try{
        const result = await Admin.findOne({userName:req.params.user},{});
        
        if(result == null || result.length == 0){
            throw CreateError(404,'No Record is Found!');
        }

        //console.log(result);

        result.remove();

        res.json({
            success:true,
            message: 'Admin is Deleted',
        });

    }catch(err){
        console.log(err);
        next(err);
    }
}



module.exports = {
    superAdminCreationCheck,
    createSuperAdminLogin,

    loginCheck,
    superAdminLogin,

    createAdminCheck,
    createAdmins,

    showAllAdmins,

    getAdminDetails,

    removeAdmins,
}