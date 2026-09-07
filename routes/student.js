const express = require('express');
const Student = reuqire('../models/students');
const router = express.Router();
// here we will do insert if doenst exist else update whatever is different or changed 
router.post('/profile',checkAuth, checkRole(['student']),async (req,res)=>{
    try{
    const {prn, department, year, cgpa, backlog, resumeURL} = req.body;
    const userId = req.user._id;
    
    const student = await Student.findOneAndUpdate(
        {
       // this one includes where and what to update like which row to update 
       userid: userId 
    },
{
       $set : {
        userid: userId,
        ...(prn && {prn}),
        ...(department && { department }),
        ...(year !== undefined && { year }),
        ...(cgpa !== undefined && { cgpa }),
        ...(backlog !== undefined && { backlog }),
        ...(resumeURL && { resumeURL })
       }
},
{
       new: true,           // returns the fresh document
       upsert: true,         // creates student if it doesnt exist
       runValidators: true  // checks all the requirements like reqired, unique
}
);
return res.status(200).json({
      message: "Student profile saved successfully",
      student
    });
  } catch (err) {
    // Catches validation errors (e.g., duplicate PRN or missing required fields)
    if (err.code === 11000) {
      return res.status(400).json({ message: "PRN or Profile already exists" });
    }
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
});

router.get('/profile',checkAuth, checkRole['student'], async(req,res)=>{
    try{
    const student = await Student.findOne(req.user._id).populate({
        path: 'userid',
        select: 'emailid name'
    });
if (!profile) {
      return res.status(404).json({ message: "Profile not found. Please create one." });
    }

    return res.status(200).json({ profile });
    }catch(error){
        return res.status(500).json({ message: err.message || "Internal server error" });
    }
});

