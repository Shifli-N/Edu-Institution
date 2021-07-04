const mongoose = require('mongoose')
const bcrypt = require('bcrypt');


// const {CreateHashWithSalt} = require('../utils/Bcryptor');

const Schema = mongoose.Schema

const staffSchema = new Schema({
    "sId":{
        type:String,
        unique:true,
        required:true,
    },
    "staffName":{
        type:String,
        required:true,
    },

    "personalInformation":{
        type:Schema.Types.Mixed,
        required:true,
    },

    "educationQualification":{
        type:Schema.Types.Mixed,
        required:true,
    },

    "dateOfJoin":{
        type:String,
        //default:undefied,
        required:true,
    },

    "salary":{
        type:Number,
        //default:undefied,
        required:true,
    },

    "academicInformations":{
        type:Array,
        required:true,
    },

    "loginCredentials":{
        "userName":{
            type:String,
            unique:true,
            required:true,
        },

        "password":{
            type:String,
            required:true,
        },

    }
});

// generate hash for password
staffSchema.pre('save', async function(next){

    // if(!this.isModified('password')){
    //     next();
    // }

    // console.log(">> "+this.isModified('loginCredentials.password'))

    // this.loginCredentials.password = 
    //     await bcrypt.CreateHash(this.loginCredentials.password);
    // console.log('>> Password is converted to '+this.loginCredentials.password);


    console.log(this.loginCredentials)
    console.log(">> "+this.isModified('loginCredentials.password'))
    // this.loginCredentials.password = CreateHashWithSalt(this.loginCredentials.password.toString(),10);
    // console.log(this.loginCredentials.password);


    this.loginCredentials.password = await bcrypt.hash(this.loginCredentials.password,10);

    console.log(this.loginCredentials);
    console.log(">> "+this.isModified('loginCredentials.password'))
    

    next();

});


staffSchema.methods.comparePassword = async function(userPass){
    return bcrypt.compare(userPass, this.loginCredentials.password);
}


const staff = mongoose.model('staff',staffSchema);

module.exports = staff;