const Task = require("../models/TaskModel");
const projectModuleModel = require("../models/ProjectModuleModel");
const projectModel = require("../models/ProjectModel");


const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate({
        path: "moduleId",
        populate: {
          path: "projectId",
          select: "title"
        },
        select: "moduleName projectId"
      })
      .populate("statusId", "name");

    res.status(200).json({
      message: "✅ Tasks fetched successfully",
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ message: `❌ ${err.message}` });
  }
};


const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate({
        path: "moduleId",
        populate: {
          path: "projectId",
          select: "title"
        },
        select: "moduleName projectId"
      })
      .populate("statusId", "name");

    if (!task) {
      return res.status(404).json({ message: "❌ Task not found" });
    }

    res.json({
      message: "✅ Task fetched successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error: " + error.message });
  }
};


const getTasksByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    if (!moduleId) {
      return res.status(400).json({ message: "❌ Module ID is required." });
    }

    const moduleExists = await projectModuleModel.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ message: "❌ Module not found." });
    }

    const tasks = await Task.find({ moduleId })
      .populate({
        path: "moduleId",
        populate: {
          path: "projectId",
          select: "title"
        },
        select: "moduleName projectId"
      })
      .populate("statusId", "name");

    res.json({
      message: tasks.length ? "✅ Tasks fetched successfully" : "⚠️ No tasks found for this module.",
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error: " + error.message });
  }
};


const addTask = async (req, res) => {
  try {
    const { moduleId, projectId, title, priority, description, statusId, totalMinute } = req.body;

    if (!moduleId || !projectId) {
      return res.status(400).json({ message: "❌ Module ID and Project ID are required." });
    }

    const [moduleExists, projectExists] = await Promise.all([
      projectModuleModel.findById(moduleId),
      projectModel.findById(projectId)
    ]);

    if (!moduleExists) return res.status(404).json({ message: "❌ Module not found." });
    if (!projectExists) return res.status(404).json({ message: "❌ Project not found." });

    const newTask = await Task.create({
      moduleId, projectId, title, priority, description, statusId, totalMinute
    });

    res.status(201).json({
      message: "✅ Task added successfully",
      data: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error: " + error.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const { moduleId, projectId, title, priority, description, statusId, totalMinute } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { moduleId, projectId, title, priority, description, statusId, totalMinute },
      { new: true, runValidators: true }
    )
      .populate({
        path: "moduleId",
        populate: {
          path: "projectId",
          select: "title"
        },
        select: "moduleName projectId"
      })
      .populate("statusId", "name");

    if (!updatedTask) {
      return res.status(404).json({ message: "❌ Task not found" });
    }

    res.json({
      message: "✅ Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error: " + error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "❌ Task not found" });
    }

    res.json({
      message: "✅ Task deleted successfully",
      data: deletedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error: " + error.message });
  }
};

module.exports = {
  getAllTasks,
  addTask,
  updateTask,
  deleteTask,
  getTaskById,
  getTasksByModule
};
