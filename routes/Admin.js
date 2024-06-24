const router = require("express").Router();
const { AdminSignUp, Login } = require("../controllers/Admin");
router.post("/reg", AdminSignUp);
router.post("/log", Login);


router.put('/users/updateUser/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = { ...req.body };

  try {
    // Validate if userId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ message: 'Invalid user ID' });
    }

    // Update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send({ message: 'Error updating user data' });
  }
});



module.exports = router;
