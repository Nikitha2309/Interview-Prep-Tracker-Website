const mongoose = require('mongoose');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser=require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app= express();
//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
//views
app.set('view engine','ejs');
//db
const dbURI='mongodb+srv://Nikitha:1234@clusteritw.qpyuy.mongodb.net/Usersdb?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex :true})
  .then((result)=> app.listen(3000))
  .catch((err)=>console.log('dberror vro:',err));
//routes
app.get('*',checkUser);
app.get('/',(req,res) => {
    console.log("sucess nikkiiii");
    res.render('home');
});
app.get('/inside',requireAuth,(req,res)=>{
  res.render('inside');
});
app.use(authRoutes); 
//app.get
// app.get('/set-cookies',(req,res)=>{
//   res.cookie('newUser',false);
//   res.cookie('olduser',true,{maxAge:1000*60*60*24});
//   res.send("<h2>yayy you got a cookie</h2>");
// });

// app.get('/read-cookies',(req,res)=>{
//    const cookies=req.cookies;
//    console.log(cookies);
//    res.json(cookies);
// })




