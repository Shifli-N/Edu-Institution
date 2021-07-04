const express = require('express');
const basicAuth = require('express-basic-auth');
const serveIndex = require('serve-index');
const path = require('path');
const fileUpload = require('express-fileupload')
const multer = require('multer');


const staffController = require('../controller/staff.controller');



const router = express.Router();


router.use(basicAuth({
  users : {'staff':'staff@123'},
  challenge:true,
}));


router.use(express.json({}));


router.all('/',async function(req,res,next){
    if(Object.keys(req.body).length > 0){
        return res.send(req.body);
    }

    res.send('Welcome to Staff');
})


router.post('/login', 
    staffController.staffLogin
);


router.post('/createStudent', staffController.createStudent );


router.get('/showAllStudents',staffController.showAllStudents);


router.get('/showStudentsByClass/:className', staffController.showStudentsByClass);


router.get('/showStudentById/:id', staffController.showStudentById);


router.get('/showStudentByUsername/:username', staffController.showStudentByUserName);

router.delete('/removeStudent', 
    staffController.removeStudent
);

router.post('/createEvents',
    staffController.createEvents
);


router.get('/showAllEvents',staffController.showAllEvents);

router.get('/showEventByDate',staffController.showEventByDate);

router.get('/showEventByClassName', staffController.showEventByClass)


// router.use(fileUpload())

router.post('/createContents', 
    staffController.uploadSingleFile,
    staffController.createContents
);


router.get('/showAllContents', staffController.showAllContents);

router.get('/showContentByClassName/:className', staffController.showContentByClassName);


router.post('/createNotification', staffController.createNotification);

router.get('/showAllNotifications', staffController.showAllNotification)

router.get('/showNotificationForClass/:class', staffController.showNotificationForClass);

router.get('/showNotificationByDate', staffController.showNotificationByDate);

router.get('/showNotification/:class', staffController.showNotification);


// serveFile Test
router.use('/ftp',
    express.static('public/ftp'),
    serveIndex('public/ftp', {icons:true}),
)

//console.log(path.join(__dirname,'shifli'))



module.exports = router
