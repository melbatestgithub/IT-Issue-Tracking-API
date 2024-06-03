const router=require("express").Router()
const {createConversation,getConversationByWriter}=require("../controllers/Conversations")
router.post("/newconv",createConversation)
router.get("/:userId",getConversationByWriter)

module.exports=router