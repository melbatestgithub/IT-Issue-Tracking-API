const router = require("express").Router();

const {SendFeedback,getFeedback} = require("../controllers/Feedback");
router.post("/createFeedback", SendFeedback);
router.get("/getFeedback", getFeedback);

module.exports = router;
