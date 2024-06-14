const express=require("express")
const router=express.Router()
const{ addFAQ,getFaq}=require("../controllers/FAQ")
router.post("/createFaq",addFAQ)
router.get("/getFaq",getFaq)



module.exports=router