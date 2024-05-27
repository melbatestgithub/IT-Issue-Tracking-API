const router=require("express").Router()
const {createConversation}=require("../controllers/Conversations")
router.post("/newconv",createConversation)

module.exports=router