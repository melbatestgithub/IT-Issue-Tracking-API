const  mongoose =require('mongoose') 

const conversationSchema= new mongoose.Schema({
  
        members:{
          type:Array  
        }
    
})
module.exports=mongoose.model("Conversation",conversationSchema)