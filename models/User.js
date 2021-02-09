const mongoose = require('mongoose');
const { isEmail }=require('validator');
const bcrypt=require('bcrypt');
const { username, password } = require('../secret');

const userSchema = new mongoose.Schema({
        email :  {
            type:String,
            required:[true,'please enter an email'],
            unique:[true,'Email is already registered'],
            lowercase:true,
            validate:[isEmail,'please enter a valid email ,idiot']
        },
        username: {
            type:  String,
            unique: [true, 'Username already exists'],
            minlength: [4, ' Username too small'],
            required: [ true , 'Enter a username']
        },
        password : {
           type:String,
           required:[true ,'please enter a password'],
           minlength:[6,'minimum password length is 6 vro'],
        }
   });

//first function fires then doc saves
userSchema.pre('save',async function(next){
       const salt=await bcrypt.genSalt();
       this.password=await bcrypt.hash(this.password,salt);
       next();
   });

//static method to login user
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if (user){
        const auth=await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}
const User = mongoose.model('User',userSchema);
module.exports.User=User;

const createUser = (email,username,password) =>{
    User.create({email,username,password});
};
module.exports.createUser=createUser;
