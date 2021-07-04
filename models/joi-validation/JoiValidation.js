const Joi = require('joi');

const createStudentSchema = Joi.object({
    sId : Joi.number().min(2).required(),
    studentName : Joi.string().min(3).required(),
    class : Joi.string().min(3).required(),

    personalInformation : Joi.object({
        gender : Joi.string().min(3).required(),
        dob : Joi.date().required(),
        address : Joi.string().min(5).required(),

        contact : Joi.object({
            personalPhoneNo : Joi.string().min(7).required(),
            parentPhoneNo : Joi.string().min(7).required(),
            parentAltPhoneNo : Joi.string().min(7).required(),
            emailId : Joi.string().email({
                minDomainSegments:2,
                tlds: {
                    allow: ["com"]
                }
            }),

        }).required(),
    }).required(),

    dateOfJoin: Joi.string().allow('').required(),

    academicPerformance : Joi.array().required(),
    nonAcademicPerformance : Joi.array().required(),

    loginCredentials : Joi.object({
        userName : Joi.string().min(3).lowercase().required(),
        password : Joi.string().min(4).required(),
        confirmPassword: Joi.ref('password'),
    }).required(),

    createdBy: Joi.string().min(3).required(),

})


const removeStudentSchema = Joi.object({
    sId: Joi.number().min(3).required(),
    studentName: Joi.string().min(3).required(),
    userName: Joi.string().min(4).required(),
    class: Joi.string().min(3).required(),
})



const createEventSchema = Joi.object({
    events: Joi.array().min(1).required(),
});

const eventArrayItem = Joi.object({
    eventName: Joi.string().min(4).required(),
    eventDate: Joi.date().required(),
    eventStartTime: Joi.number().min(7).required(),
    eventDuration: Joi.number().min(1).required(),
    assignedTo: Joi.string().min(3).required(),
})


const studentLoginSchema = Joi.object({
    username: Joi.string().lowercase().min(4).required(),

    password:Joi.string().min(4).required(),

    confirmPassword:Joi.ref('password'),

    email:Joi.string().optional(),

    other:Joi.object().optional().not().empty(),
});


const createContents = Joi.object({
    class : Joi.string().lowercase().required(),

    subject: Joi.string().required(),

    createdBy : Joi.string().required(),

    fileId: Joi.number().min(4).required(),
});


const createNotificationSchema = Joi.object({
    notificationHeading : Joi.string().min(6).required(),
    notificationMessage : Joi.string().min(6).required(),
    class : Joi.string().min(3).required(),
    date : Joi.date().allow('').required(),
    authorizedBy : Joi.string().min(3).required(),
});



const staffLoginSchema = Joi.object({
    userName: Joi.string().min(3).lowercase().required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.ref('password'),
});


module.exports = {
    createEventSchema,
    eventArrayItem,
    createContents,
    createStudentSchema,
    removeStudentSchema,
    staffLoginSchema,
    createNotificationSchema,

    studentLoginSchema,
}