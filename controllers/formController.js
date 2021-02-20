const Question = require("../models/Question");
const Experience = require("../models/Experience");
const app=require('../app');
const {checkAdmin} = require('../middleware/authMiddleware');

const handleErrorsQuestion=(err)=>{
    console.log(err.message,err.code);

    //error messages
     let errors={name:'',link:'',topic:''};

    //1.duplicate error code
     if(err.code == 11000){
        if((Object.keys(error.keyPattern)).includes('name')){
            errors.name= 'question name  already taken';
        }
        else{
            errors.link = 'link already exists';
        }
        return errors;
    }

    //invalid question 
    if (err.message.includes('Question validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path]=properties.message;
        });
    }
    return errors;

}

const handleErrorsExperience=(err)=>{
    console.log(err.message,err.code);

    //error messages
     let errors={name:'',title:'',image:'',company:'',description:''};

    //1.duplicate error code
     if(err.code == 11000){
        errors.name= 'experience with this title already exists';
        return errors;
    }

    //invalid question 
    if (err.message.includes('Experience validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
          errors[properties.path]=properties.message;
        });
    }
    return errors;

}

module.exports.formQuestion_get =(req,res) => {
     res.render('formQuestion',{ topics : app.topics});    
}

module.exports.formQuestion_post = (req,res) => {
    const {name,link,topic}=req.body;
    try
    {
        let valid;
        if(checkAdmin)
        {
            valid=true;
            console.log("admin added ques");
        }
        else
        {
            valid=false;
            console.log("user added ques");
        }
        const question= Question.create({name,link,topic,valid});
        alert('some alert');
        res.redirect('/some page');
    }
    catch(err)
    {
       const errors=handleErrorsQuestion(err);
       console.log("shit ..error               ",err);
       res.status(400).json({errors});
    }
}

module.exports.formExperience_get =(req,res) => {
    res.render('formExperience',{ companys : app.companys});    
}

module.exports.formExperience_post = (req,res) => {
   const {name,title,image,company,description}=req.body;
   try
   {
       let valid;
       if(checkAdmin)
       {
           valid=true;
           console.log("admin added experience");
       }
       else
       {
           valid=false;
           console.log("user added experience");
       }
       const experience= Experience.create({name,title,image,company,description,valid});
       console.log("done vro u go gall",experience);
       alert('some alert');
       res.redirect('/some page');
   }
   catch(err)
   {
      const errors=handleErrorsExperience(err);
      console.log(err);
      res.status(400).json({errors});
   }
}

