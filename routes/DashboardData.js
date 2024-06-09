const express = require('express');
const Issue=require("../models/Issues")
const Users=require("../models/Users")

const router=express.Router()

router.get('/dashboard-data', async (req, res) => {
    try {
      const totalEmployees = await Users.countDocuments();
      const totalItStaff = await Users.countDocuments({ department: 'IT Staff' });
      const closedIssues = await Issue.countDocuments({ status: 'Solved' });
      const openedIssues = await Issue.countDocuments({ status: 'pending' });
      const totalIssues = await Issue.countDocuments();
  
      res.json({
        employees: totalEmployees,
        itStaffMembers: totalItStaff,
        closedIssues,
        openedIssues,
        issues: totalIssues,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports=router
