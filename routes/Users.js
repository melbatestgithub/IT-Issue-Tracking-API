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
  UpdateUser,
  getAllUsers

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
router.put("/updateUser/:id", UpdateUser);
router.get("/allUsers", getAllUsers);



















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




router.delete("/delete/:id",async(req,res)=>{
  const userId=req.params.id
  try {
    await User.findByIdAndDelete(userId)
    res.status(200).send("User is Deleted Successfully")
  } catch (error) {
    res.status(200).send("Error while deleting a use")
  }
})

router.get('/latest-employees', async (req, res) => {
  try {
    const employees = await User.find().sort({ joinedAt: -1 }).limit(4);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const userId = req.query.exclude;
    const users = await User.find({ _id: { $ne: userId } });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/newly-registered', async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Change this to your desired timeframe
    
    const newUsers = await User.find({ joinedAt: { $gte: yesterday } });
    res.json(newUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/createITStaffMember",async(req,res)=>{
  const newStaff=req.body
try {
  
  const ITStaff=await User.create(newStaff)
  res.status(201).send({message:"IT Staff member is successfully created",ITStaff})
} catch (error) {
  res.status(500).send({message:"Internal Server Error is occured"})
}

})

module.exports = router;
