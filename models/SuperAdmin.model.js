const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const superAdminSchema = new Schema({
    userName : {
        type:String,
        required:true,
    },

    password : {
        type:String,
        required:true,
    },

    emailId : {
        type:String,
        required:true,
    }
});

const superAdminModel = mongoose.model('superAdmin',superAdminSchema);

module.exports = superAdminModel;