const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema

const studentSchema = Schema({

    sId : {
        type:Number,
        required:true,
        unique:true,
    },

    studentName : {
        type:String,
        required:true,
    },

    class : {
        type:String,
        required:true,
    },

    personalInformation : {
        type: Schema.Types.Mixed,
        required:true,

        contact : {
            personalPhoneNo : {
                type:String,
                unique:true,
            },

            emailId : {
                type:String,
                unique:true,
            }
        }
    },

    dateOfJoin : {
        type:Date,
        required:false,
    },

    academicPerformance : {
        type:Array,
        required:true,
    },

    nonAcademicPerformance : {
        type:Array,
        required:true,
    },

    loginCredentials : {
        userName : {
            type:String,
            require:true,
            unique:true,
        },

        password : {
            type:String,
            require:true,
        }
    },

    createdBy: {
        type:String,
        require:true
    }

});


studentSchema.pre('save', async function(next){
    this.loginCredentials.userName = this.loginCredentials.userName.toLowerCase();
    this.loginCredentials.password = await bcrypt.hash(this.loginCredentials.password,10);

    next();
});

studentSchema.methods.comparePassword = async function(enteredPass){
    //console.log(`enterpass -> ${enteredPass}, hash -> ${this.loginCredentials.password}`)
    return await bcrypt.compare(enteredPass, this.loginCredentials.password);
}

const studentModel = mongoose.model('students', studentSchema);

module.exports = studentModel