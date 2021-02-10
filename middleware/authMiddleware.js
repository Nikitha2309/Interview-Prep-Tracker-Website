const jwt = require('jsonwebtoken');
const {User} = require('../models/User');

const requireAuth=(req,res,next)=>
{
    //token corresponding to req
    const token = req.cookies.jwt;

    //verify existance
    if(token)
    {
        jwt.verify(token,'hakuna matata',(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                //redirects to login page incase of error
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    } //if token wont exist , take back to login page
    else{
          res.redirect('/login');
    }

};

const checkUser =(req,res,next)=>{
    //token of req
    const token =req.cookies.jwt;
    //if it exists
    if(token){
        jwt.verify(token,'hakuna matata',async(err,decodedToken) => {
            //incase of a error
            if(err){
                  res.locals.user=null;
                  next();
            }else{
                let user= await User.findById(decodedToken.id);
                res.locals.user=user;
                next();
            }
        });

    }else{
        res.locals.user=null;
        next();
    }
};

const checkAdmin =(req,res,next)=>{
    //token of req
    const token =req.cookies.jwt;
    //if it exists
    if(token){
        jwt.verify(token,'hakuna matata',async(err,decodedToken) => {
            //incase of a error
            if(err){
                  res.locals.admin=null;
                  return false;
                  next();
            }else{
                let admin= await Admin.findById(decodedToken.id);
                if(admin==null)
                {
                    return false;
                }
                else{
                    res.locals.Admin=admin;
                    return true;
                }
                next();
            }
        });

    }else{
        res.locals.user=null;
        return false;
        next();
    }
};



module.exports={requireAuth,checkUser,checkAdmin};