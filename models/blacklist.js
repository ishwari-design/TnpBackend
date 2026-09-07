const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required : true

    },
    reason:{
        type: String,
        required: true
    },
    driveId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'drive'
    },
    isActive:{
        type : Boolean,
        default: true
    }
},{timestamps : true});
blacklistSchema.index({studentId: 1, isActive: 1});
const Blacklist = mongoose.model('blacklist',blacklistSchema);
module.exports = Blacklist;