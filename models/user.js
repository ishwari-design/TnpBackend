const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    emailid:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true,
        enum : ['student', 'tnp'],
        default : 'student'
    }
    
},{timestamps:true});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

const User = mongoose.model("user",userSchema);

module.exports = User;