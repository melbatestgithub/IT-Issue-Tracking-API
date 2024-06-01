const router = require("express").Router();
const { AdminSignUp, Login } = require("../controllers/Admin");
router.post("/reg", AdminSignUp);
router.post("/log", Login);


router.put('/updateAdmin/:id', async (req, res) => {
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
