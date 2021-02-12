const mongoose = require('mongoose');
const express = require('express');
const cookieParser=require('cookie-parser');
const {default : AdminBro} = require('admin-bro');

const formRoutes = require('./routes/formRoutes');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const secrets=require('./secret');
const buildAdminRouter = require('./admin/admin.router');
const options = require('./admin/admin.options');
const {User,createUser} = require('./models/User');
const Topic=require('./models/Topic');
const Question=require('./models/Question'); 
const Company=require('./models/Company');
const Experience=require('./models/Experience'); 
const {Admin,adminOptions,createAdmin}= require('./models/Admin');
//call this function in appsetup if we want to create a admin cum user in databse 
const createAdminCumUser = (email,username,password) => {
  createUser(email,username,password);
  createAdmin(email,password);
};

//to be exported
let topics=[];
let database=[];
let companys=[];

//database URI
const dbURI='mongodb+srv://'+secrets.username+':'+secrets.password+'@'+secrets.cluster_name+'.qpyuy.mongodb.net/'+secrets.dbname+'?retryWrites=true&w=majority';
//mongoose connect
mongoose.connect(dbURI, { useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex :true})
.then(() => {                           
      console.log('mongoose connected');
       database = mongoose.connection;
       module.exports.database=database;
      database.db.collection('topics').find({}).toArray().then((dbtopics)=>{
         topics=dbtopics;
         module.exports.topics=topics;
       });
       database.db.collection('companys').find({}).toArray().then((dbcompanys)=>{
        companys=dbcompanys;
        module.exports.companys=companys;
      });
      appsetup(database);
  })
.catch(err => console.log('dberror vro:',err));


//after mongoose connection is setup and database is extracted , appsetup will run
const appsetup = (database) =>{
  const app=express();

  //adminbro 
  const admin = new AdminBro(options);
  const router = buildAdminRouter(admin);
  app.use(admin.options.rootPath, router);

  app.listen(3000);

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

  app.use(authRoutes); 
  app.use(formRoutes);

  //createAdminCumUser("email","username","password"); //to create admin cum user


  app.get('/topics',requireAuth,(req,res)=>{
    database.db.collection('topics').find({}).toArray().then((topics)=>{
      res.render('topics',{ topics : topics});});
  });

  app.get('/companies',requireAuth,(req,res)=>{
    database.db.collection('companys').find({}).toArray().then((companys)=>{
      res.render('companys',{ companys : companys});});
  });

  app.get('/topics/:t_name',requireAuth,(req,res)=>{
    //to convert arrays -> Arrays
    let topic= req.params.t_name;
    topic=topic.charAt(0).toUpperCase() + topic.slice(1);
    //find topic  in topics collection
    database.db.collection('topics').findOne({ name : topic.toString()})
    //then get all questions linked to it
    .then((topic)=>{
         let questions= database.db.collection('questions').find({ topic : topic._id}).toArray();
         return questions;    })
    //finally render the page
    .then((questions)=>{
         res.render('topic',{ topic:topic , questions : questions});})
    .catch((err)=> console.log('error2 ',err));
  });

  app.get('/companys/:c_name',requireAuth,(req,res)=>{
    //to convert arrays -> Arrays
    let company= req.params.c_name;
    company=company.charAt(0).toUpperCase() + company.slice(1);
    //find company  in companys collection
    database.db.collection('companys').findOne({ name : company.toString()})
    //then get all experiences linked to it
    .then((company)=>{
         let experiences= database.db.collection('experiences').find({ company : company._id}).toArray();
         return experiences;    })
    //finally render the page
    .then((experiences)=>{
         res.render('company',{ company:company , experiences : experiences});})
    .catch((err)=> console.log('error3 ',err));
  });

} 