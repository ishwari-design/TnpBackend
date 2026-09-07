const express = require('express');
const Blacklist = require('../models/blacklist');
const Registration = require('../models/registrations');
async function eligibilityCheck(student, drive){
  const blacklistedStudent = await Blacklist.findOne({student: student._id});
  if(blacklistedStudent) return "you are blacklisted";

  if(new Date() > new Date(drive.deadline)) return "deadline missed";
  
  const alreadyRegistered = await Registration.findOne({
    driveId: drive._id,
    registeredStudentId : student._id
  });
  if(alreadyRegistered) return"you have already registered for this drive";
  
  if(drive.mincgpa > student.cgpa) return "you arent eligible due to not meeting the cgpa criterias";

  if(!drive.allowedBacklog && student.backlog>0) return "no backlogs allowed";

  if(!drive.allowedDepartment.includes(student.department)) return "you arent elogible due to department";
  
  if(!drive.allowedYears.includes(student.year)) return `you arent eligible because you are in ${student.year}`;
  
  if(student.isplaced){
    if( student.currentpackage > drive.ctc) {return "you can only apply for drives greater than you ctc";}
  }
  return null;
}

module.exports= eligibilityCheck;