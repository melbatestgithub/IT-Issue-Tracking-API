const router=reqiure("express").Router()
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
module.exports=createMessage