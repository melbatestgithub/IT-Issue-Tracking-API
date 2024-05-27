const router = require("express").Router();
const {addDepartment,getAll} = require("../controllers/Departments");
router.post("/addDepartment", addDepartment);
router.get("/getAll",getAll)
module.exports=router