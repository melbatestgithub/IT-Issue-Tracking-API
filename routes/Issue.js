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
const Issue=require("../models/Issues")


const getIssuesByMonth = async () => {
  const monthsArray = [
    { month: 1, monthName: 'Jan' },
    { month: 2, monthName: 'Feb' },
    { month: 3, monthName: 'Mar' },
    { month: 4, monthName: 'Apr' },
    { month: 5, monthName: 'May' },
    { month: 6, monthName: 'Jun' },
    { month: 7, monthName: 'Jul' },
    { month: 8, monthName: 'Aug' },
    { month: 9, monthName: 'Sep' },
    { month: 10, monthName: 'Oct' },
    { month: 11, monthName: 'Nov' },
    { month: 12, monthName: 'Dec' },
  ];

  return await Issue.aggregate([
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        total: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $group: {
        _id: "$_id.year",
        months: {
          $push: {
            month: "$_id.month",
            total: "$total",
          },
        },
      },
    },
    {
      $project: {
        year: "$_id",
        months: {
          $map: {
            input: monthsArray,
            as: "monthItem",
            in: {
              $let: {
                vars: {
                  found: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$months",
                          as: "m",
                          cond: { $eq: ["$$m.month", "$$monthItem.month"] },
                        },
                      },
                      0,
                    ],
                  },
                },
                in: {
                  month: "$$monthItem.month",
                  total: { $ifNull: ["$$found.total", 0] },
                  monthName: "$$monthItem.monthName"
                },
              },
            },
          },
        },
      },
    },
    { $unwind: "$months" },
    {
      $sort: { "year": 1, "months.month": 1 },
    },
  ]);
};

router.get('/issues-by-month', async (req, res) => {
  try {
    const issues = await getIssuesByMonth();
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/latest", async (req, res) => {
  try {
    const latestIssues = await Issue.find()
      .sort({ date: -1 }) // Sort by date in descending order (latest first)
      .limit(5); // Limit to the latest five issues
    res.json(latestIssues);
  } catch (error) {
    console.error("Error fetching latest issues:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
