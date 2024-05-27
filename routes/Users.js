const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User=require("../models/Users")
const {
  SignUpController,
  LoginController,
  getUsers,
  getITStaffUsers,
  getITstaffEmail,

} = require("../controllers/Users");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


router.post("/register", SignUpController);
router.post("/login", LoginController);
router.get("/getAll", getUsers);
router.get("/getITStaffUser", getITStaffUsers);
router.get("/getITstaffEmail", getITstaffEmail);







router.put('/updateUser/:id', async (req, res) => {
  try {
    const updatedUserData = { ...req.body };
    if (req.body.profileImage) {
      // Upload image to Firebase Storage
      const bucket = admin.storage().bucket();
      const profileImage = bucket.file(`profile_images/${req.params.id}.jpg`);
      const profileImageUploadStream = profileImage.createWriteStream({
        metadata: {
          contentType: 'image/jpg',
        },
      });
      profileImageUploadStream.on('error', (error) => {
        console.error('Error uploading profile image to Firebase:', error);
        res.status(500).send({ message: 'Error uploading profile image to Firebase' });
      });
      profileImageUploadStream.on('finish', async () => {
        // Generate signed URL for the uploaded image
        const imageUrl = await profileImage.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // Adjust expiration as needed
        });
        updatedUserData.profileImageUrl = imageUrl[0];
        // Update user data in MongoDB with profile image URL
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedUserData, { new: true });
        res.send(updatedUser);
      });
      profileImageUploadStream.end(req.body.profileImage);
    } else {
      // If no profile image provided, just update user data in MongoDB
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedUserData, { new: true });
      res.send(updatedUser);
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send({ message: 'Error updating user data' });
  }
});


module.exports = router;
