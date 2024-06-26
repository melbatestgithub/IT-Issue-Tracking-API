const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPassword: { type: String,  },
  firstName: { type: String },
  lastName: { type: String },
  position: { type: String },
  profile: { type: String, },
  phoneNumber: { type: String },
  department:{type:Array},
  roomNumber:{type:Number},
  address: { type: String },
  salary: { type: Number },
  emergencyContact: { type: String },
  gender:{type:String},
  employmentType: { type: Array },
  isITStaff: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now }
});
const User = mongoose.model("Users", userSchema);
module.exports = User;
