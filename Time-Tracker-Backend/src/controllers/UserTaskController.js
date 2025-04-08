const UserTask = require("../models/UserTaskModel");
const Task = require("../models/TaskModel");

const addUserTask = async (req, res) => {
    try {
        console.log("📌 Incoming Data:", req.body);

        const { userId, taskId, workedHr = 0, logDate } = req.body;

        if (!userId || !taskId || logDate === undefined) {
            return res.status(400).json({ message: "❌ User ID, Task ID, and Log Date are required" });
        }

        const taskExists = await Task.findById(taskId);
        if (!taskExists) {
            return res.status(404).json({ message: "❌ Task not found" });
        }

        const existingTask = await UserTask.findOne({ userId, taskId });
        if (existingTask) {
            return res.status(400).json({ message: "❌ Task is already assigned to this user" });
        }

        const savedUserTask = await UserTask.create({ userId, taskId, workedHr, logDate });

        res.status(201).json({
            message: "✅ Task assigned successfully",
            data: savedUserTask,
        });
    } catch (err) {
        console.error("❌ Error Assigning Task:", err.message);
        res.status(500).json({ message: `❌ Error: ${err.message}` });
    }
};

const getUserTasks = async (req, res) => {
    try {
        const userTasks = await UserTask.find()
            .populate("userId", "name email")
            .populate({
                path: "taskId",
                populate: { path: "moduleId", select: "moduleName" },
                select: "title priority totalMinute moduleId",
            });

        res.status(200).json({
            message: "✅ User tasks fetched successfully",
            data: userTasks,
        });
    } catch (err) {
        console.error("❌ Error Fetching User Tasks:", err.message);
        res.status(500).json({ message: `❌ Error: ${err.message}` });
    }
};

const getUserTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "❌ User ID is required" });
        }

        const userTasks = await UserTask.find({ userId })
            .populate({
                path: "taskId",
                populate: {
                    path: "moduleId",
                    populate: {
                        path: "projectId",
                        select: "title"
                    },
                    select: "moduleName projectId"
                },
                select: "title description priority totalMinute moduleId"
            })
            .populate("userId", "name email")
            .select("workedHr logDate taskId");

        if (!userTasks.length) {
            return res.status(404).json({ message: "❌ No tasks found for this user" });
        }

        res.status(200).json({
            message: "✅ User tasks fetched successfully",
            data: userTasks,
        });
    } catch (err) {
        console.error("❌ Error Fetching User Tasks:", err.message);
        res.status(500).json({ message: `❌ Error: ${err.message}` });
    }
};

const getUserTaskById = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: "❌ Task ID is required" });
      }
  
      const userTask = await UserTask.findById(id).populate({
        path: "taskId",
        populate: { path: "moduleId", select: "moduleName" },
      });
  
      if (!userTask) {
        return res.status(404).json({ message: "❌ User task not found" });
      }
  
      res.status(200).json({
        message: "✅ User task fetched successfully",
        data: userTask,
      });
    } catch (err) {
      console.error("❌ Error fetching user task:", err.message);
      res.status(500).json({ message: `❌ Error: ${err.message}` });
    }
  };
  
const updateUserTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { workedHr, logDate } = req.body;

        if (workedHr === undefined && logDate === undefined) {
            return res.status(400).json({ message: "❌ Nothing to update" });
        }

        const updatedFields = {};
        if (workedHr !== undefined) updatedFields.workedHr = workedHr;
        if (logDate !== undefined) updatedFields.logDate = logDate;

        const updatedTask = await UserTask.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "❌ User Task not found" });
        }

        res.status(200).json({
            message: "✅ User Task updated successfully",
            data: updatedTask,
        });
    } catch (err) {
        console.error("❌ Error Updating User Task:", err.message);
        res.status(500).json({ message: `❌ Error: ${err.message}` });
    }
};


const deleteUserTask = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUserTask = await UserTask.findByIdAndDelete(id);
        if (!deletedUserTask) {
            return res.status(404).json({ message: "❌ User Task not found" });
        }

        res.status(200).json({ message: "✅ User Task deleted successfully" });
    } catch (err) {
        console.error("❌ Error Deleting User Task:", err.message);
        res.status(500).json({ message: `❌ Error: ${err.message}` });
    }
};

module.exports = {
    addUserTask,
    getUserTasks,
    getUserTasksByUser,
    getUserTaskById,
    updateUserTask,
    deleteUserTask,
};
