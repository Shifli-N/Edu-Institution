const express = require('express');
const path = require('path');

const studentController = require('../controller/student.controller');


const router = express.Router();

router.use(
    express.json(),
)

router.all('/',function(req,res,next){
    res.send('Welcome to Students root');
})


router.post('/login',studentController.studentLogin);

router.get('/getStudentDetails', studentController.getStudentDetails);

router.use('/resources',express.static('resources'));

router.get('/getContent/:class/:date', studentController.getContent);

router.get('/getNotification/:class', studentController.getNotification);

router.get('/getEvents/:class', studentController.getEvent);


module.exports = router;