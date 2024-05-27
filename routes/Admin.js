const router = require("express").Router();
const { AdminSignUp, Login } = require("../controllers/Admin");
router.post("/reg", AdminSignUp);
router.post("/log", Login);

module.exports = router;
