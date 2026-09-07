const mongoose = require('mongoose');
const User = require('./user');
const driveSchema = new mongoose.Schema({
  organizerTnp:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  companyName:{
    type: String, 
    required: true
  },
  description:{
    type: String, 
    required: true
  },
  driveType: {
    type: String,
    enum: ['INTERNSHIP', 'FULL_TIME', 'INTERN_PLUS_FTE'],
    required: true
  },
  ctc: { 
    type: Number 
},      // e.g., 12 (for 12 LPA)
  stipend: { 
    type: Number
 },  // e.g., 25000 (per month)
  mincgpa:{
    type: Number,
  },
  allowedBacklog:{
    type: Boolean,
    default: false
  },
  allowedDepartment:{
    type: [String],
    enum: ['CS','IT','AI/ML','MECH','CIVIL','ENTC'],
    required: true
  },
  allowedYears:{
    type: [Number],
    required: true
  },
  deadline:{
    type: Date,
    required: true
  }
}, {timestamps:true});

const Drive = mongoose.model('drive',driveSchema);
modules.export = Drive;