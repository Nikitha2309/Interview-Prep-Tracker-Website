const mongoose = require('mongoose');
const express = require('express');
const cookieParser=require('cookie-parser');
const {default : AdminBro} = require('admin-bro');

const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const secrets=require('./secret');
const buildAdminRouter = require('./admin/admin.router');
const options = require('./admin/admin.options');
const User = require('./models/User');
const Topic=require('./models/Topic');
const Question=require('./models/Question');

//database URI
const dbURI='mongodb+srv://'+secrets.username+':'+secrets.password+'@'+secrets.cluster_name+'.qpyuy.mongodb.net/'+secrets.dbname+'?retryWrites=true&w=majority';
//mongoose connect
mongoose.connect(dbURI, { useNewUrlParser: true , useUnifiedTopology: true ,useCreateIndex :true})
.then(() => {                           
      console.log('mongoose connected');
      var database = mongoose.connection;
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
  app.get('/topics',requireAuth,(req,res)=>{
    database.db.collection('topics').find({}).toArray().then((topics)=>{
      console.log(topics);
      res.render('topics',{ topics : topics});});
  });
  app.use(authRoutes); 
} 