const express = require('express');
const router = express.Router();
const Issue = require('../models/Issues');

router.get('/', async (req, res) => {
  try {
    const inProgressCount = await Issue.countDocuments({ status: 'In Progress' });
    const solvedCount = await Issue.countDocuments({ status: 'Solved' });
    const rejectedCount = await Issue.countDocuments({ status: 'Rejected' });
    const pendingCount = await Issue.countDocuments({ status: 'pending' });

    const inProgressIssues = await Issue.find({ status: 'In Progress' });
    const solvedIssues = await Issue.find({ status: 'Solved' });
    const rejectedIssues = await Issue.find({ status: 'Rejected' });
    const acceptedIssues = await Issue.find({ status: 'Accepted' });

    res.json({
      inProgressCount,
      solvedCount,
      rejectedCount,
      pendingCount,
      inProgressIssues,
      solvedIssues,
      rejectedIssues,
      acceptedIssues,
    });
  } catch (err) {
    console.error('Error fetching report data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
