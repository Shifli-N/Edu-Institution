const express = require('express');
const basicAuth = require('express-basic-auth');

const adminController = require('../controller/admin.contoller');

const router = express.Router();

router.use(basicAuth({
    users : {'admin':'admin@123'},
    challenge : true,
}))

router.use(express.json());

router.all('/', (req,res) => {
    //console.log(req.body)
    if(Object.keys(req.body).length > 0){
        return res.send(req.body);
    }

    res.send('Welcome to Admin');
});



router.post('/login', 
    adminController.adminLoginCheck, 
    adminController.adminLogin
);


router.post('/createStaff',
    adminController.createStaffCheck,
    adminController.createStaff
);

router.post('/staffLogin',
    adminController.staffLoginCheck,
    adminController.staffLogin
);


router.get('/getStaffDetails', adminController.getStaffDetail);

router.get('/showAllStaffs', adminController.showAllStaffs);

router.delete('/removeStaff',
    adminController.removeStaffCheck,
    adminController.removeStaff
);


router.post('/createClass', 
    adminController.createClassCheck, 
    adminController.createClass
);


router.get('/showAllClasses', adminController.showAllClasses);

router.get('/getClassDetails/:id', adminController.getClassDetails);

router.delete('/removeClass', 
    adminController.removeClassCheck,
    adminController.removeClass
);


module.exports = router;
