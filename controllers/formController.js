const Question = require("../models/Question");
const app=require('../app');
const {checkAdmin} = require('../middleware/authMiddleware');


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
        const question = new Question({
            name,
            link,
            topic,
            valid
        });
        question.save((err,question)=>{
            if(err){
                return res.status(400).json({
                    error:"not able to save the question"
                });
            }
            return res.json(question);
        });
        //res.redirect('home');
    }
    catch(err)
    {
       const errors=handleErrors(err);
       console.log(err);
       res.status(400).json({errors});
    }
}

