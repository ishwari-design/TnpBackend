const express = require('express');
const router = express.Router();
const Drive=  require('../models/drives');
const Registration = require('../models/registrations');
const eligibilityCheck = require('../models/service/eligibility');
const Student = require('../models/students');
const Drive = require('../models/drives');
router.post('/', checkAuth, checkRole(['tnp']),async (req,res)=> {
   try{
     const {
   companyName,
  description,
  driveType,
  ctc,
  stipend,
  mincgpa,
  allowedBacklog,
  allowedDepartment,
  allowedYears,
  deadline
        } = req.body;
        
          const drive = await Drive.create({
  organizerTnp: req.user._id,
  companyName,
  description,
  driveType,
  ctc,
  stipend,
  mincgpa,
  allowedBacklog,
  allowedDepartment,
  allowedYears,
  deadline
});
       return res.status(201).json({message:"drive details added"});
   }catch(err){
    return res.status(500).json({message:err.message || "internal server error"});
   }
});

router.post('/:driveid/register', checkAuth, checkRole(['student']), async (req,res)=>{
  try{
  const driveId = req.params.driveid;
  const userId = req.user._id;
  const student = await Student.findOne({user: userId });
  if(!student) return res.status(404).json({message:"profile not foung student not found complete the profile first"});
  const drive = await Drive.findById(driveId);
  if(!drive) return res.status(404).json({message:"drive not found"});

  const response = await eligibilityCheck(student, drive);
  if(response) {
    return res.status(403).json({message:response});
  }
  const registration = await Registration.create({
    driveId: drive._id,
    registeredStudentId: student._id
  });
  return res.status(201).json({message:"registration complete"}); 
} catch(error){
  return res.status(500).json({message: error.message || "internal server error"});
}
});

router.patch('/:driveid/registrations/statusupdate', checkAuth, checkRole(['tnp']), async (req,res)=>{
  try{
  const {studentIds, status} = req.body;

  const validStatus = ['APPLIED', 'SHORTLISTED', 'REJECTED', 'OFFERED'];
  if(!validStatus.includes(status)) return res.status(400).json({ message: "Invalid status value" });
  //if(!Array.isArray(studentIds) || studentIds.length == 0)) { return res.status(400).json({ message: "Please provide an array of student IDs" });}

  const result = await  Registration.updateMany(
    {driveId: req.params.driveid,
      registeredStudentId: {$in: studentIds}
    },
    {
      $set :{status}
    }
  );
    return res.status(200).json({
      message: `Successfully updated ${result.modifiedCount} students to ${status}`,
      updatedCount: result.modifiedCount
    });
  } catch(error){
    return res.status(500).json({ message: error.message || "Internal server error" });
  }

});
router.get('/:driveid/registered_students',checkAuth, checkRole(['tnp']), async (req,res) => {
  try{
  const driveId = req.params.driveid;
  const registeredStudents = await Registration.find({driveId}).populate({
    path : 'registeredStudentId',
    select : 'cgpa prn department year',
    populate: {
      path: 'userid',
      select: 'emailid name'
    }
  });
  return res.status(200).json(registeredStudents);
  } catch(error){
    return res.status(500).json({ message: error.message || "Internal server error"});
  }
});
// http://localhost:5000/drives?search=google&mincgpa=7.5  queries are wrtieen after the ? mark 
// in req.query we have 2 things search and other keys l 
router.get('/',checkAuth, async (req,res)=>{
  try{
  const {search, mincgpa} = req.query;
  const filter = {};

  if(search){
    filter.$or = [
      {companyName: {$regex: search, $options: 'i'}},
      {description :{$regex: search, $options: 'i'} }
    ];
  };

  if(mincgpa){
    filter.mincgpa = {$lte : Number(mincgpa)};
  }
  const drives = await Drive.find(filter).sort({createdAt:-1});
  return res.status(200).json({
      count: drives.length,
      drives
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
});
module.exports = router;
