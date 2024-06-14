const express=require("express")
const router=express.Router()
const addFAQ=require("../controllers/FAQ")
router.post("createFaq",addFAQ)
router.get("/getFaq",)



module.exports=router