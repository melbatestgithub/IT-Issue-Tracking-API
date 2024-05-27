import mongoose, { Types, model } from 'mongoose'

const messageSchema= new mongoose.Schema(
    {
        conversationId:{
            type:String
        },
        sender:{
            type:String
        },
        message:{
            type:String
        },
      
},  {timestamps:true},)
module.exports=mongoose.model("message",messageSchema)