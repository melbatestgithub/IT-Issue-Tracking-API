const express = require("express");
const router = express.Router();
const createMessage = require("../controllers/Messages");

// Define your routes
router.post("/", createMessage);

module.exports = router;
