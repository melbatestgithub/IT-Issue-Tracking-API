const mongoose=require("mongoose")
const AdminSchema=new mongoose.Schema({
    email:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    password:{type:String},
    isAdmin:{type:Boolean}
})
const Admin=mongoose.model("Admin,",AdminSchema)
module.exports=Admin