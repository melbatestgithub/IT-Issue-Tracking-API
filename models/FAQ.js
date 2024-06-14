const mongoose=require("mongoose")
const FaqSchema=new mongoose.Schema({

    question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      }
})
const FAQ=mongoose.model("FAQ",FaqSchema)
module.exports=FAQ