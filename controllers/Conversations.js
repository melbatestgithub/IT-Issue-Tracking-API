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

const getConversationByWriter = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from route parameters
        const conversations = await Conversation.find({
            members: { $in: [userId] }
        });
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).send("No conversation by this user");
    }
};
module.exports={createConversation,getConversationByWriter}