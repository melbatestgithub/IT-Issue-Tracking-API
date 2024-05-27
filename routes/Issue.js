const router = require("express").Router();
const {
  createNewIssue,
  getAllIssue,
  getSingleIssue,
  deleteIssue,
  updateIssue,
  UpdateIssueStatus,
  userHistory,
  assignIssue,
  fetchAssignedIssue,
  updateAssignedIssueStatus,
  getSolvedIssue
} = require("../controllers/Issue");
router.post("/newIssue", createNewIssue);
router.get("/allIssue", getAllIssue);
router.get("/singleIssue/:id", getSingleIssue);
router.get("/historyIssue/:userId", userHistory);
router.delete("/deleteIssue/:id", deleteIssue);
router.put("/updateIssue/:id", updateIssue);
router.put("/:id/approve", UpdateIssueStatus);
router.put("/assignIssue", assignIssue);
router.get("/getAssignedIssue", fetchAssignedIssue);
router.put("/updateAssignedIssueStatus", updateAssignedIssueStatus);
router.get("/getSolvedIssue", getSolvedIssue);

module.exports = router;
