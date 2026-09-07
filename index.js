require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user');
const studentRoutes = require('./routes/student');
const driveRoutes = require('./routes/drive');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/student', studentRoutes);
app.use('/drives', driveRoutes);
const startServer = async function(){
    try{
      await mongoose.connect(process.env.CONNECTION_URL)
      .then(()=>{console.log("mongoDB connected")})
      

      app.listen(process.env.PORT,()=>{console.log("connected port")});
    }
    catch(error){
        console.log(error);
    }
};

startServer(); 