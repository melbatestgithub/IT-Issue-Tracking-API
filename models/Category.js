const mongoose=require("mongoose")
const categorySchema= new mongoose.Schema({
    categoryName:{
        type:String
    }
})
const category=mongoose.model("category",categorySchema)
module.exports=category