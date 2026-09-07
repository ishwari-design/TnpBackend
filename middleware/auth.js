const jwt = require('jsonwebtoken');
const express = require('express');

function checkAuth(req,res,next){
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message:"unauthorised access"});
    try{
    const decoded = jwt.decode(token,process.env.SECRET_KEY);
    if(!decoded) return res.status(401).json({message:"invalid token"});
    req.user = decoded;
    next();
    }catch(err){
        return res.status(500).json({message:err.message || "internal server error"});
    }
    
};
const checkRole = (allowedRoles) => {
    return (req,res,next)=>{
        if(!req.user.role) return res.status(401).json({message: "unauthrized access role not defined"});
        if(!allowedRoles.includes(req.user.role)) return res.status(403).json({message:"forbidden access, you cant access this page"});
        next();
    }
};
module.exports = {checkAuth, checkRole};