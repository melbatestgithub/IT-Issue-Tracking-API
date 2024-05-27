const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSignUp = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const admin = new Admin({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });
    await admin.save();
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {}
};

const Login = async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (!user) {
      res.status(200).send("User not found");
    }
    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!checkPassword) {
      res.status(200).send("Password did not match");
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET
    );
    const { password, ...others } = req.body;
    res.status(200).json({
      success: true,
      token,
      others,
    });
  } catch (error) {}
};
module.exports = { AdminSignUp, Login };
