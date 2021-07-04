const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    notificationHeading : {
        type:String,
        required:true,
    },

    notificationMessage : {
        type:String,
        required:true,
    },

    class : {
        type : String,
        required:true,
    },

    date : {
        type:Date,
        default: Date.now(),
    },

    authorizedBy : {
        type:String,
        required:true,
    },
});


const notificationModel = mongoose.model('notification',notificationSchema);

module.exports = notificationModel;