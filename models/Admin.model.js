const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name : {
        type :String,
        required : true,
    },

    email : {
        type : String,
        unique : true,
        lowercase : true,
    },

    userName : {
        type : String,
        required : true,
    },

    password : {
        type : String,
        // minLength : [8,'Required Longer than 8 Characters.'],
        // maxLength : [30,'Required Lesser than 30 Characters.'],
        required : true,
    },

});




const adminModel = mongoose.model('Admins',adminSchema);

module.exports = adminModel;