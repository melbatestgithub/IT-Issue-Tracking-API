const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    status: { type: String, default: "pending" },
    userId: { type: String },
    date: { type: Date, default: Date.now }, // Assuming this is the creation date
    department: { type: String },
    roomNumber: { type: Number },
    assignedTo: { type: String },
    priority: { type: String }
}, { timestamps: true }); // This will automatically add createdAt and updatedAt fields

const Issue = mongoose.model("Issue", IssueSchema);
module.exports = Issue;