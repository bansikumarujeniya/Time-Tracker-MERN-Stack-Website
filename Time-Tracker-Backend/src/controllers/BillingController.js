const Billing = require("../models/BillingModel");
const TimeLog = require("../models/TimeLogModel");

const addBilling = async (req, res) => {
  try {
    const savedBilling = await Billing.create(req.body);
    res.status(201).json({
      message: "Billing record created successfully",
      data: savedBilling,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBillings = async (req, res) => {
  try {
    
    const billings = await Billing.find()
      .populate({
        path: "userId",
        select: "firstName lastName email",
      })
      .populate({
        path: "projectId",
        select: "title description",
      });

   
    const allLogs = await TimeLog.find()
      .populate({
        path: "taskId",
        populate: {
          path: "moduleId",
          select: "projectId",
        },
      });

    
    const billingWithTotals = billings.map((billing) => {
      const logsForBilling = allLogs.filter((log) => {
        const logUserId = log.userId?.toString();
        const logProjectId = log.taskId?.moduleId?.projectId?.toString();
        return (
          logUserId === billing.userId?._id.toString() &&
          logProjectId === billing.projectId?._id.toString()
        );
      });

      const totalMinutes = logsForBilling.reduce((sum, log) => sum + (log.totalMin || 0), 0);
      const totalHours = totalMinutes / 60;
      const totalAmount = totalHours * billing.hourlyPrice;

      return {
        ...billing.toObject(),
        totalHour: +totalHours.toFixed(2),
        totalAmount: +totalAmount.toFixed(2),
      };
    });

    res.status(200).json({
      message: "✅ Billing records fetched successfully",
      data: billingWithTotals,
    });
  } catch (err) {
    console.error("❌ Error fetching billing records:", err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addBilling, getBillings };
