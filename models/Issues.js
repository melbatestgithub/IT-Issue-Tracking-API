const mongoose=require('mongoose')

const IssueSchema=new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String},
    status:{type:String,default:"pending"},
    userId:{type:String},
    date:{type:Date},
    department:{type:String},
    roomNumber:{type:Number},
    assignedTo:{type:String}
    
})
const Issue= mongoose.model("Issue",IssueSchema)
module.exports=Issue