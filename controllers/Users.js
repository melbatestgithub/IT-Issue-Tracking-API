const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const SignUpController = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber,
      address,
      employmentType,
      department,
      emergencyContact,
      gender,
      profile,
    } = req.body;
    if (password !== confirmPassword) {
      res
        .status(400)
        .send({ success: false, message: "Password does not match" });
    }
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).send({ message: "User already exist" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      address,
      employmentType,
      department,
      emergencyContact,
      gender,
      profile,
    });
    await newUser.save();
    res.status(201).send({
      success: true,
      newUser,
    });
  } catch (error) {
    console.log("Unable to register Employee", error);
    res
      .status(500)
      .send({ success: false, message: "Unable to register Employee" });
  }
};

const LoginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User is not found",
      });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send("Incorrect password");
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isItStaff: user.isITStaff,
      },
      process.env.JWT_SECRET
    );
    const { password, ...others } = user._doc;
    return res.status(201).send({ token, others });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ department: { $nin: ["IT Staff"] } });
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  const userId=req.query.userId
  const firstName=req.query.firstName
  try {
    const user =userId?
     await User.findById(userId):
     await User.findOne(firstName);
     const {password,updatedAt,...others}=user._doc
    res.status(201).json(others);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getITstaffEmail = async (req, res) => {
  try {
    const ITStaff = await User.find({ department: { $in: ["IT Staff"] } });
    const ITStaffDetails = ITStaff.map((user) => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
    res.status(201).json({
      success: true,
      ITStaffDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getITStaffUsers = async (req, res) => {
  try {
    const itStaffUsers = await User.find({ department: { $in: ["IT Staff"] } });

    if (!itStaffUsers || itStaffUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found with department IT Staff",
      });
    }

    res.status(200).json({
      success: true,
      users: itStaffUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const UpdateUser=async(req,res)=>{
  const{id}=req.params;
  const updatedData=req.body;
  try {
    const newUser=await User.findByIdAndUpdate(id,updatedData,{new:true})
    res.status(200).send({success:true,user:newUser})
    
  } catch (error) {
    res.status(500).send("Internal Server Error is Occured")
  }
}


module.exports = {
  LoginController,
  SignUpController,
  getUsers,
  getITStaffUsers,
  getITstaffEmail,
  UpdateUser,
  getAllUsers
  
};
