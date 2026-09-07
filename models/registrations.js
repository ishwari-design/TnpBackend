const mongoose = require('mongoose');
const Drive = require('./drives');
const Student = require('./students');
const registrationSchema = new mongoose.Schema({
    driveId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'drive',
        required: true
    },
    registeredStudentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    status:{
        type: String, 
        enum: ['APPLIED','SHORTLISTED','OFFERED','REJECTED'],
        default: 'APPLIED'
    }
}
,{timestamps: true});
registrationSchema.index({driveId: 1, registeredStudentId: 1}, {unique: true});

const Registration = mongoose.model('registration',registrationSchema);
module.exports = Registration;