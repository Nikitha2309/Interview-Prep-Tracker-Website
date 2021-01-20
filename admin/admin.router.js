const {default : AdminBro}= require('admin-bro');
const { buildAuthenticatedRouter } = require('@admin-bro/express');
const express = require('express');
const argon2 = require('argon2');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const {Admin} = require('../models/Admin');

const buildAdminRouter = (admin) => {
    const router = buildAuthenticatedRouter(admin,{
                                                    cookieName : 'admin-bro',
                                                    cookiePassword:'supersecretpassword',
                                                    authenticate : async(email,password)=>{
                                                                const admin = await Admin.findOne({email});
                                                                try{
                                                                    if(admin && await argon2.verify(admin.password,password)){
                                                                        return admin.toJSON();
                                                                    }
                                                                }
                                                                catch(err){
                                                                    console.log('adminauth error vro ',err);
                                                                    return null;
                                                                }
                                                                                            }, },
                                                     null , 
                                                     {
                                                            resave:false,
                                                            saveUnitialised:true,
                                                            store:new MongoStore({mongooseConnection:mongoose.connection}),
                                                     }
                                           );
    return router;
};

module.exports = buildAdminRouter;