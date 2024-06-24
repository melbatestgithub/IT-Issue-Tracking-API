const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');

require('dotenv').config(); 
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/Users");
const CLIENT_URL = "http://localhost:3000/dashboard";


router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email: email });
//   try {
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     var transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "melakuzeleke443@gmail.com",
//         pass: "melzel4304",
//       },
//     });

//     var mailOptions = {
//       from: "youremail@gmail.com",
//       to: "user email@gmail.com",
//       subject: "Reset Password Link",
//       text: `http://localhost:5600/auth/reset-password/${user._id}/${token}`,
//     };
//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         return res.send({ Status: "Success" });
//       }
//     });
//   } catch (error) {
//     console.log("Unable to recover password");
//   }
// });
// router.post("reset-password", (req, res) => {
//   const { id, token } = req.params;
//   const { password, confirmPassword } = req.body;
//   jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
//     if (err) return res.status(401).json("Inavlid token ");
//     const hash = bcrypt.hash(password, 10);
//     User.findByIdAndUpdate({ _id: id }, { password: hash });
//   });
// });



router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a temporary password reset token (using uuidv4)
    const resetToken = uuidv4(); // Generate a random UUID
    const resetLink = `http://localhost:3000/reset-password/${user.id}/${resetToken}`;

    // Update user record with resetToken (for demonstration purposes)
    user.resetToken = resetToken;
    await user.save();

    // Send email with reset link
    sendEmail(email, resetLink, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Failed to send reset link' });
      }
      console.log('Email sent:', info);
      return res.status(200).json({ message: 'Password reset link sent successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to send email (using nodemailer)
const sendEmail = (email, resetLink, callback) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Password Reset Link',
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`
  };

  transporter.sendMail(mailOptions, callback);
};



module.exports = router;
