const Conversation=require("../models/Conversation")
const createConversation=async(req,res)=>{

    try {
        
        const newConversation=new Conversation({
            members:[req.body.senderID,req.body.recieverID]
    
        })
      const conversation = await newConversation.save()
      res.status(200).send(conversation)
    } catch (error) {
        res.status(500).send("Internal Server Error is occured!")
    }
}

const getConversationByWriter=async(req,res)=>{
    try {
        const conversations=await Conversation.find({
            messages:{$in:[req.body.userId]}
        })
        res.status(200).send(conversations)
    } catch (error) {
        res.status(500).send(error)
    }
}
module.exports={createConversation,getConversationByWriter}