const Conversation=require("../models/Conversation")

const createConversation = async (req, res) => {
    try {
        const { senderID, recieverID } = req.body;

        // Check if a conversation already exists between these users
        const existingConversation = await Conversation.findOne({
            members: { $all: [senderID, recieverID] }
        });

        if (existingConversation) {
            return res.status(200).json({
                message: "Conversation already exists between these users.",
                conversation: existingConversation
            });
        }

        // Create a new conversation if it doesn't exist
        const newConversation = new Conversation({
            members: [senderID, recieverID]
        });

        const conversation = await newConversation.save();
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).send("Internal Server Error occurred!");
    }
};

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