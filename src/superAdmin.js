const express = require('express');
const basicAuth = require('express-basic-auth');
const CreateError = require('http-errors');
const validator = require('express-validator');
const bcrypt = require('bcrypt');


const superAdminController = require('../controller/superAdmin.controller');


const router = express.Router();
//const {check, validationResult} = validator;


router.use(basicAuth(
    {   
        challenge:"false",
        users : {'admin':'admin'} 
    }
));

router.use(express.json());


router.get('/',function (req,res,next){
    const authenKey = req.headers.authorization;
    res.write("Welcome Super Admin")
    console.log(req.headers);
    res.end();
});






router.post('/createSuperAdminLogin', 
            superAdminController.superAdminCreationCheck, 
            superAdminController.createSuperAdminLogin
);

router.post('/login', superAdminController.loginCheck, superAdminController.superAdminLogin);

router.post('/createAdmins',superAdminController.createAdminCheck, superAdminController.createAdmins);

router.get('/showAllAdmins',superAdminController.showAllAdmins);

router.get('/getAdminDetails', superAdminController.getAdminDetails);

router.delete('/removeAdmin/:user',superAdminController.removeAdmins);


module.exports = router;