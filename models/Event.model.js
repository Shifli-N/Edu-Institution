const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = Schema({

    eventName:{
        type:String,
        required:true,
    },

    eventDate:{
        type:Date,
        required:true,
    },

    eventStartTime:{
        type:Number,
        required:true,
    },

    eventDuration:{
        type:Number,
        required:true,
    },

    assignedTo:{
        type:String,
        required:true,
    }

});


const eventModel = mongoose.model('Events',eventSchema);

module.exports = eventModel