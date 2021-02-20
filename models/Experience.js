const mongoose=require('mongoose');
const Company=require('./Company');
const experienceSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    company:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company'
    },
    description:{
        type:String,
        required:true
    },
    valid:{
        type:Boolean,
    }
});

const Experience = mongoose.model('Experience',experienceSchema);
module.exports=Experience;