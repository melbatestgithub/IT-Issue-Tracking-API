const mongoose = require("mongoose");
const departmentSchema = new mongoose.Schema({
  name: { type: String },
  totalEmployee: { type: Number },
  block: { type: Number },
  roomNumber: { type: Number },
  manager: { type: String },
});
const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
