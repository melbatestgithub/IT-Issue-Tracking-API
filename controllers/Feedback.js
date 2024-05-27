const Feedback=require("../models/Feedback")

const SendFeedback=async(req,res)=>{
    const{employeeFullName,department,email,message,userId}=req.body
    try {
        const newFeedback = new Feedback({
          employeeFullName,
          department,
          email,
          message,
          userId
        });
        await newFeedback.save()
        res.status(200).json({
            success:true,
            newFeedback
        })
    } catch (error) {
        console.log("Unable to send feedback")
        res.status(500).send({
            success:false,
            message:"Internal Server error is occured"
        })
        
    }
}

const getFeedback=async(req,res)=>{
    try {
        const getFeedback=await Feedback.find()
        res.status(200).send(getFeedback)
    } catch (error) {
        res.status(200).send("Internal Server Error")
        
    }
}
module.exports={SendFeedback,getFeedback}