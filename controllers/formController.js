const Question = require("../models/Question");
const app=require('../app');

const handleErrors=(err)=>{
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

module.exports.formQuestion_get =(req,res) => {
     res.render('formQuestion',{ topics : app.topics});    
}

module.exports.formQuestion_post = (req,res) => {
    const {name,link,topic}=req.body;
    try
    {
        const valid=false;
        const question= Question.create({name,link,topic,valid});
        alert('some alert');
        res.redirect('/some page');
    }
    catch(err)
    {
       const errors=handleErrors(err);
       console.log(err);
       res.status(400).json({errors});
    }
}

