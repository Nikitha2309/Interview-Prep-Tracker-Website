const mongoose = require('mongoose');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser=require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const secrets=require('./secret');
const buildAdminRouter = require('./admin/admin.router');
const options = require('./admin/admin.options');
const {default : AdminBro} = require('admin-bro');
const User = require('./models/User');

const app= express();
//db
const dbURI='mongodb+srv://'+secrets.username+':'+secrets.password+'@'+secrets.cluster_name+'.qpyuy.mongodb.net/'+secrets.dbname+'?retryWrites=true&w=majority';


const run = async () => {
  await mongoose.connect(dbURI, { useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex :true})
       .then((result)=> console.log('mongoose connected'))
       .catch((err)=>console.log('dberror vro:',err));
  const admin = new AdminBro(options);
  const router = buildAdminRouter(admin);
  app.use(admin.options.rootPath, router);
  app.listen(3000);
}

run();

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//views
app.set('view engine','ejs');

//routes
app.get('*',checkUser);

app.get('/',(req,res) => {
    console.log("sucess nikkiiii :) :)");
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




