const express = require('express');
const router = express.Router();
const User = require('../models/user');
const generateToken = require('../service/auth');
const bcrypt = require('bcrypt');
// base route /user/
router.post('/signup',async (req,res)=>{
    try{
     const {name, emailid,password} = req.body;
     const doesExist = await User.findOne({emailid});
     if(doesExist) return res.status(400).json({message:"user already exists"});
     const user = await User.create({
        name,
        emailid, 
        password
     });
     const token = generateToken(user);
     return res.status(200).cookie('token',token,{httpOnly: true, maxAge: 1*24*60*60*1000}).json({message:"signed up"}); 
    }catch(err){
        return res.status(500).json({message: err.message || "internal server error"});
    }
});
router.post('/signin',async (req,res)=>{
    try{
     const {emailid,password} = req.body;
     const user = await User.findOne({emailid});
     if(!user) return res.status(401).json({message:"user not found"});
     const isCorrect = await bcrypt.compare(password, user.password);
     if(!isCorrect) return res.status(401).json({message:"incorrect email or password"});
     const token = generateToken(user);
     return res.status(200).cookie('token',token,{httpOnly: true, maxAge: 1*24*60*60*1000}).json({message:"logged in"}); 
    }catch(err){
        return res.status(500).json({message: err.message || "internal server error"});
    }
});
router.post('/logout',async (req,res)=>{
     return res.status(200).clearCookie('token',{httpOnly: true}).json({message:"logged out"});
    });
module.exports = router;

















