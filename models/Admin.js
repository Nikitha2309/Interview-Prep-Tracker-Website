const AdminBro = require('admin-bro');
const argon2= require('argon2');
 
const mongoose = require('mongoose');
const { getMaxListeners } = require('./User');
const adminSchema = new mongoose.Schema({
    email:{
        type :String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});
const Admin = mongoose.model('Admin',adminSchema);

//create admin function
const createAdmin = (email,password) => {
  argon2.hash(password).then( (hashedPassword) => {
    const  mypassword=hashedPassword; 
    Admin.create( { email: email , password : mypassword },function(err){
    if(err) 
    {
        console.log('admin creation problem ',err);
        return err;
    }});              });
 };

const passwordBeforeHook = async (request) => {
    if (request.method === 'post') {
      const { password, ...otherParams } = request.payload;
  
      if (password) {
        const encryptedPassword = await argon2.hash(password);
  
        return {
          ...request,
          payload: {
            ...otherParams,
            encryptedPassword,
          },
        };
      }
    }
    return request;
  };


const passwordAfterHook =async (response) => {
    if (response.record && response.record.errors) {
      response.record.errors.password = response.record.errors.encryptedPassword;
    }
    return response; 
  };

const options = {
  properties : {
      password : {
          isVisible : true,
      },
     tempPassword : {
          type :'password',
      },
  },
  actions : {
      new : {
         after : passwordAfterHook,
         before : passwordBeforeHook,
           },
      edit:{
        after : passwordAfterHook,
        before : passwordBeforeHook,
           },
          },
};

module.exports.adminOptions= {
    options,
    resource : Admin,
};
module.exports.Admin=Admin;
module.exports.createAdmin=createAdmin;

    
