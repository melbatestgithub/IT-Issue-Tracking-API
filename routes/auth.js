const router = require("express").Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
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

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "melakuzeleke443@gmail.com",
        pass: "melzel4304",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "user email@gmail.com",
      subject: "Reset Password Link",
      text: `http://localhost:5600/auth/reset-password/${user._id}/${token}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    console.log("Unable to recover password");
  }
});
router.post("reset-password", (req, res) => {
  const { id, token } = req.params;
  const { password, confirmPassword } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) return res.status(401).json("Inavlid token ");
    const hash = bcrypt.hash(password, 10);
    User.findByIdAndUpdate({ _id: id }, { password: hash });
  });
});
module.exports = router;
