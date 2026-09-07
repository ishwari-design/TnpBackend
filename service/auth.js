const jwt = require('jsonwebtoken');
const express= require('express');

function generateToken(user){
    const payload = ({
        _id: user._id,
        emailid: user.emailid,
        role: user.role
    });
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return token;
};
module.exports = generateToken;