const Issue = require("../models/Issues");
const User=require("../models/Users")
const createNewIssue = async (req, res) => {
  try {
    // Extract issue data from the request body
    const {
      title,
      category,
      department,
      description,
      roomNumber,
      date,
      userId,
    } = req.body;

    // Create a new issue object
    const newIssue = new Issue({
      title,
      category,
      department,
      description,
      roomNumber,
      date,
      userId, // Associate the issue with the user who submitted it
    });

    // Save the new issue to the database
    await newIssue.save();

    // Respond with success message
    res.status(201).json({ message: "Issue submitted successfully" });
  } catch (error) {
    // Handle any errors
    console.error("Error submitting issue:", error);
    res
      .status(500)
      .json({ error: "Unable to submit issue. Please try again later." });
  }
};

const getAllIssue = async (req, res) => {
  try {
    const Issues = await Issue.find();
    res.status(200).json({
      success: true,
      Issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const UpdateIssueStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      res.status(400).send("Issue is not found");
    }
    issue.status = "approved";
    await issue.save();
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error is occured",
    });
  }
};

const getSingleIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server error is occured",
    });
  }
};

const userHistory = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from request parameters
    const issues = await Issue.find({ userId: userId }); // Filter issues based on userId
    res.json({ success: true, issues:issues });
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server error is occured",
    });
  }
};

const deleteIssue = async (req, res) => {
  const { id } = req.params;
  try {
    await Issue.findByIdAndDelete(id);
    res.status(200).json("Issue Has been deleted Successfully");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const assignIssue=async(req,res)=>{
  try {
    const { issueId, assignedTo } = req.body;
    const issue = await Issue.findById(issueId);
    issue.assignedTo = assignedTo;

    await issue.save()
    res.status(200).send({
      message:"Issue has been assigned successfully",
      issue
    })
  } catch (error) {
    res.status(500).send({
      message:"Unable to assign Issue"
    })
  }

}


const fetchAssignedIssue =async(req,res) => {
  try {
    const userEmail = req.query.email;
    const user= await User.findOne({email:userEmail})

    if(!user){
      res.status(404).send({
        message:"User is not found"
      })
    }
    const assignedIssue=await Issue.find({assignedTo:userEmail})
    res.status(200).send({
      success:true,
      assignedIssue
    })
   
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"Internal Server Error is Occured "
    })
  }
};

const updateAssignedIssueStatus=async(req,res)=>{
  try {
    const {issueId,status}=req.body
    const updateStatus=await Issue.findByIdAndUpdate(issueId,{status:status},{new:true})
    await updateStatus.save()
    res.status(200).send("Assigned Issue status is Updated")
  } catch (error) {
    res.status(500).send({
      success:false,
      message:"Internal Server Error is occured"
    })
  }
}

const updateIssue = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, department, roomNumber } = req.body;
  try {
    const updated = { title, description, category, department, roomNumber };
    const updatedIssue = await Issue.findByIdAndUpdate(id, updated, {
      new: true,
    });
    res.status(200).json({
      success: true,
      updatedIssue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};


const getSolvedIssue=async(req,res)=>{
  try {
    const getSolvedIssue= await Issue.find({status:'Solved'})
    res.status(200).send(getSolvedIssue)
  } catch (error) {
    res.status(500).send("Something went wrong")
    
  }
}
module.exports = {
  createNewIssue,
  getAllIssue,
  getSingleIssue,
  deleteIssue,
  updateIssue,
  UpdateIssueStatus,
  userHistory,
  assignIssue,
  fetchAssignedIssue,
  updateAssignedIssueStatus,
  getSolvedIssue
};
