const mongoose = require('mongoose');

const Schema = mongoose.Schema

const contentSchema = new Schema({
    fileId:{
        type:Number,
        unique:true,
        required:true,
    },

    class : {
        type : String,
        required:true,
    },

    subject : {
        type : String,
        required:true,
    },

    filePath : {
        type:String,
        required:true,
    },

    createdBy : {
        type:String,
        required:true,
    },

    createdOn : {
        type:Date,
        default: new Date().toISOString().split('T')[0],
    }
});

const contentModel = mongoose.model('content',contentSchema);

contentModel.pre

module.exports = contentModel;