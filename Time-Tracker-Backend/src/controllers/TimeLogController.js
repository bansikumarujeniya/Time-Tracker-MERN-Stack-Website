const TimeLog = require("../models/TimeLogModel");

const addTimeLog = async (req, res) => {
    try {
        const { userId, taskId, startDate, endDate, totalMin } = req.body;

        if (!userId || !taskId || !startDate) {
            return res.status(400).json({
                message: "❌ userId, taskId, and startDate are required"
            });
        }

        const savedTimeLog = await TimeLog.create({
            userId,
            taskId,
            startDate,
            endDate,
            totalMin
        });

        res.status(201).json({
            message: "✅ Time Log created successfully",
            data: savedTimeLog
        });
    } catch (err) {
        console.error("❌ Error saving time log:", err.message);
        res.status(500).json({ message: `❌ ${err.message}` });
    }
};

const getTimeLogs = async (req, res) => {
    try {
        const timeLogs = await TimeLog.find()
            .populate("userId", "firstName lastName email") 
            .populate({
                path: "taskId",
                select: "title description priority totalMinute moduleId statusId", 
                populate: [
                    {
                        path: "moduleId",
                        select: "moduleName projectId",
                        populate: { path: "projectId", select: "title" },
                    },
                    {
                        path: "statusId",
                        select: "name",
                    },
                ],
            });

        res.status(200).json({
            message: "✅ Time Logs fetched successfully",
            data: timeLogs
        });
    } catch (err) {
        console.error("❌ Error fetching time logs:", err.message);
        res.status(500).json({ message: `❌ ${err.message}` });
    }
};

const deleteTimeLog = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLog = await TimeLog.findByIdAndDelete(id);
        if (!deletedLog) {
            return res.status(404).json({ message: "❌ Time Log not found" });
        }

        res.status(200).json({
            message: "✅ Time Log deleted successfully",
            data: deletedLog
        });
    } catch (err) {
        console.error("❌ Error deleting time log:", err.message);
        res.status(500).json({ message: `❌ ${err.message}` });
    }
};

module.exports = { addTimeLog, getTimeLogs, deleteTimeLog };
