const mongoose = require('mongoose');
const User = require('./user');
const studentSchema = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    prn:{
        type: String,
        required: true,
        unique: true
    },
    department:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    cgpa:{
        type: Number,
        required: true
    },
    backlog:{
        type: Boolean,
        required: true
    },
    isplaced:{
        type: Boolean,
        default: false
    },
    cuurentpackage:{
        type : Number,
        default: 0
    },
    resumeURL:{
        type: String, 
        required: true
    }
},{timestamps:true});

const Student = mongoose.model('student', studentSchema);
module.exports = Student;