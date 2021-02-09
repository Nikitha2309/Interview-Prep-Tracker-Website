const jwt = require('jsonwebtoken');
const {User} =require('../models/User');

const maxAge=3*24*60*60; //3 days
const createToken = (id) => {
    return jwt.sign({ id }, 'hakuna matata',{
        expiresIn : maxAge
    });
};

const handleErrors=(err)=>{
    console.log(err.message,err.code);

    //error messages
     let errors={email:'',password:'',username:''};

    //1.duplicate error code
     if(err.code == 11000){
        if((Object.keys(error.keyPattern)).includes('email')){
            errors.email= 'email already registered';
        }
        else{
            errors.username = 'Username already exists';
        }
        return errors;
    }

    //2.un registered email
    if(err.message=='incorrect email'){
        errors.email='email not registered';
    }

    //3.incorect password
    if(err.message=='incorrect password'){
        errors.password='password not matching';
    }

    //4.invalid user creds
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path]=properties.message;
        });
    }
    return errors;

}

module.exports.signup_get =(req,res) => {
    res.render('signup');
}

module.exports.login_get =(req,res) => {
    res.render('login');
}

module.exports.signup_post =async (req,res) => {
    const {email,username,password}=req.body;
    try
    {
        const user=await User.create({email,username,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    }
    catch(err)
    {
       const errors=handleErrors(err);
       console.log(err);
       res.status(400).json({errors});
    }
}

module.exports.login_post = async (req,res) => {
    const { email, password }=req.body;
   
   try{
       const user = await User.login(email,password);
       const token = createToken(user._id);
       res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
       res.status(200).json({user:user._id});
   }
   catch(err){
      const errors=handleErrors(err);
      res.status(400).json({errors});
      console.log(err);
   }
}

module.exports.logout=(req,res)=>{
    //delete token == replace token witha null token with less expiretime
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

