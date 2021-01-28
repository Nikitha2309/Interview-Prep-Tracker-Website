const mongoose=require('mongoose');
const Topic=require('./Topic');
const questionSchema =new mongoose.Schema({
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
    topic:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Topic'
    },
    valid:{
        type:Boolean,
    }
});

const Question = mongoose.model('Question',questionSchema);
module.exports=Question;