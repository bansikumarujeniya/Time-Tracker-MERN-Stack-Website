const Reports = require("../models/ReportsModel");
const Task = require("../models/TaskModel");
const TimeLog = require("../models/TimeLogModel");

const generateReport = async (req, res) => {
    try {
      const { projectId, userId, taskId } = req.body;
  
      
      const logs = await TimeLog.find({ userId, taskId });
  
      if (!logs.length) {
        return res.status(404).json({ message: "❌ No time logs found for this user and task." });
      }
  
     
      const totalMinutes = logs.reduce((sum, log) => sum + (log.totalMin || 0), 0);
  
    
      const totalHour = parseFloat((totalMinutes / 60).toFixed(2));
  
      
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "❌ Task not found." });
      }
  
      const estimatedMinutes = task.totalMinute || 0;
  
      
      let productivity = 0;
      if (estimatedMinutes > 0) {
        productivity = parseFloat(((estimatedMinutes / totalMinutes) * 100).toFixed(2));
      }
  
      
      const savedReport = await Reports.create({
        projectId,
        userId,
        taskId,
        totalHour,
        productivity,
      });
  
      res.status(201).json({
        message: "✅ Report generated successfully",
        data: savedReport,
      });
    } catch (err) {
      console.error("❌ Error generating report:", err.message);
      res.status(500).json({ message: `❌ ${err.message}` });
    }
  };

const getReports = async (req, res) => {
    try {
        const reports = await Reports.find().populate("projectId userId taskId");
        res.status(200).json({
            message: "Reports fetched successfully",
            data: reports
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { generateReport, getReports };
