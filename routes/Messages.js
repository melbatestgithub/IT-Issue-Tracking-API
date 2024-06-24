const express = require("express");
const router = express.Router();
const {createMessage,getMessage} = require("../controllers/Messages");

// Define your routes
router.post("/", createMessage);
router.get("/:conversationId", getMessage);

module.exports = router;