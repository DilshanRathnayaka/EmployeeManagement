const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    fullname:{type:String,required:true},
    namewithini:{type:String,required:true},
    displayname:{type:String,required:true},
    dateofbirth:{type:String,required:true},
    gender:{type:String,required:true},
    mobile:{type:Number,required:true},
    email:{type:String,required:true},
    Designation:{type:String,required:true},
    joineddate:{type:String,required:true},
    Experience:{type:String,required:true},
    salary:{type:Number,required:true},
    personalnotes:{type:String,required:true},
    employeeID:{type:Number},
    EmployeeType:{type:String,required:true},

}, {
    timestamps: false,
    versionKey: false,
  })

module.exports = mongoose.model("EmployeeSchema",employeeSchema);