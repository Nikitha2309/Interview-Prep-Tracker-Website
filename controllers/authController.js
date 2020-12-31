const jwt = require('jsonwebtoken');
const User =require('../models/User');

const handleErrors=(err)=>{
    console.log(err.message,err.code);
    //two types of errors
     let errors={email:'',password:''};


    //un registered email
    if(err.message=='incorrect email'){
        errors.email='email not registered';
    }

    //incorect password
    if(err.message=='incorrect password'){
        errors.password='password not matching';
    }

     //duplicate error code
     if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
      }

    //invalid user creds
    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path]=properties.message;
        });
    }
    return errors;

}
const maxAge=3*24*60*60;
const createToken = (id) => {
    return jwt.sign({ id }, 'net ninja secret',{
        expiresIn : maxAge

    });
};
module.exports.signup_get =(req,res) => {
    res.render('signup');
}

module.exports.login_get =(req,res) => {
    res.render('login');
}

module.exports.signup_post =async (req,res) => {
    const {email,password}=req.body;
    try
    {
        const user=await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(201).json({user:user._id});
    }
    catch(err)
    {
       const errors=handleErrors(err);
       //handleErrors(err);
       //console.log(err,' user unable to create');
       res.status(400).json({errors});
       //res.status(400).send(user);

    }
    //res.send('new signup');
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
   }

   // console.log(email,password);
   // res.send('user login');
}

module.exports.logout_get=(req,res)=>{
    //delete token
    //replace token witha null token with less expiretime
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

