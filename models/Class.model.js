const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const classSchema = new Schema({

    className : {
        type:String,
        unique:true,
        require:true,
    },

    classCode : {
        type:String,
        unique:true,
        require:true,
    },

    maxStrength : {
        type:Number,
        require:true,
    },

    classIncharge:{
        type:Array,
        require:true,
    },

    subjects:{
        type:Object,
        require:true,
    },

    createdUser : {
        type:String,
        require:true,
    },

    createdOn : {
        type:Date,
        require:true,
    }

});

const classModel = mongoose.model('studentClass',classSchema);

module.exports = classModel;