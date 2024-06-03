const Message=require("../models/Message")


const createMessage=async(req,res)=>{
    const newMessage=new Message(req.body)
    try {
        const savedMessage=await newMessage.save()
        res.status(200).send(savedMessage)
    } catch (error) {
        res.status(500).send("Internal Server Error is Occured")
    }
}

const getMessage=async(req,res)=>{
    try {
        const message=await Message.find({
            conversationId: req.params.conversationId
        })
        res.status(200).send(message)
    } catch (error) {
        res.status(500).send("Internal Server Error is Occured")
    }
}
module.exports={createMessage,getMessage}