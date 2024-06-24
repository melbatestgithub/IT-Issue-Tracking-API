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
  getSolvedIssue,
  getApprovedIssue
} = require("../controllers/Issue");
router.post("/newIssue", createNewIssue);
router.get("/allIssue", getAllIssue);
router.get("/approved", getApprovedIssue);
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
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first)
      .limit(5); // Limit to the latest five issues
    res.json(latestIssues);
  } catch (error) {
    console.error("Error fetching latest issues:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/count', async (req, res) => {
  const { email } = req.query;


  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const assignedCount = await Issue.countDocuments({ assignedTo: email  });
    const solvedCount = await Issue.countDocuments({ assignedTo: email,status:"Solved"  });
    const RejectedCount = await Issue.countDocuments({ assignedTo: email,status:"Rejected"  });


    res.json({ assignedCount,solvedCount,RejectedCount });
  } catch (error) {
    console.error('Error fetching counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/high-priority-issues', async (req, res) => {
  try {
    // Find all issues with priority set to "High"
    const highPriorityIssues = await Issue.find({ priority: 'High' });

    res.json(highPriorityIssues);
  } catch (error) {
    console.error('Error fetching high priority issues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/counts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const submittedCount = await Issue.countDocuments({ userId });
    const inProgressCount = await Issue.countDocuments({ userId, status: 'In-progress' });
    const solvedCount = await Issue.countDocuments({ userId, status: 'Solved' });

    res.json({ submittedCount, inProgressCount, solvedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/latest/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const latestIssue = await Issue.findOne({ userId }).sort({ createdAt: -1 }).exec();
    res.json(latestIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
