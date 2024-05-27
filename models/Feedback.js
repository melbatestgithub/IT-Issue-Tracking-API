const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  employeeFullName: { type: String },
  email: { type: String },
  department: { type: String },
  message: { type: String },
  userId: { type: String },
});
const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;
