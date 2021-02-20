const mongoose = require('mongoose');
const express = require('express');
const cookieParser=require('cookie-parser');
const {default : AdminBro} = require('admin-bro');
const fs = require('fs');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

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
const { CLIENT_RENEG_LIMIT } = require('tls');
//call this function in appsetup if we want to create a admin cum user in databse 
const createAdminCumUser = (email,username,password) => {
  createUser(email,username,password);
  createAdmin(email,password);
};

//to be exported
let topics=[];
let database=[];
let companys=[];
// let gfs;

//database URI
const dbURI='mongodb+srv://'+secrets.username+':'+secrets.password+'@'+secrets.cluster_name+'.qpyuy.mongodb.net/'+secrets.dbname+'?retryWrites=true&w=majority';
//mongoose connect
mongoose.connect(dbURI, { useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex :true})
.then(() => {                           
      console.log('mongoose connected');
      database = mongoose.connection;
      // Init stream
      // gfs = Grid(database.db, mongoose.mongo);
      // gfs.collection('companys');
       module.exports.database=database;
      database.db.collection('topics').find({}).toArray().then((dbtopics)=>{
         topics=dbtopics;
         module.exports.topics=topics;
       });
       database.db.collection('companies').find({}).toArray().then((dbcompanys)=>{
        companys=dbcompanys;
        module.exports.companys=companys;
      });
      appsetup(database);
  })
.catch(err => console.log('dberror vro:',err));


// const storageCompanys = new GridFsStorage({
//   url: dbURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'companys'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const uploadCompanys = multer({ storageCompanys });
// module.exports.uploadCompanys=uploadCompanys;

// const storageExperiences = new GridFsStorage({
//   url: dbURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'experiences'
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });
// const uploadExperiences = multer({ storageExperiences });
// module.exports.uploadExperiences=uploadExperiences;


//after mongoose connection is setup and database is extracted , appsetup will run
const appsetup = (database) =>{
  const app=express();

  //adminbro 
  const admin = new AdminBro(options);
  const router = buildAdminRouter(admin);
  app.use(admin.options.rootPath, router);
   
  const port = Process.env.PORT || 3000 ;
  app.listen(port,()=>{  // do not add localhost here if you are deploying it
    console.log("server listening to port "+port);
  });

  //middleware
  app.use(express.static('public'));
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(methodOverride('_method'));

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

  app.get('/companys',requireAuth,(req,res)=>{
    database.db.collection('companies').find({}).toArray().then((companys)=>{
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
    database.db.collection('companies').findOne({ name : company.toString()})
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
