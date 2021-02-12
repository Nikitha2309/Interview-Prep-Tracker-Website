const mongoose=require('mongoose');

const companySchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    link:{
        type:String,
        required:true,
        unique:true
    },
    logo:{
         data:Buffer,
         contentType:String
    }
});

const  Company = mongoose.model('Company',companySchema);
module.exports=Company;