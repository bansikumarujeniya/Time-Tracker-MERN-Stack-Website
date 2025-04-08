const projectModuleModel = require("../models/ProjectModuleModel");
const projectModel = require("../models/ProjectModel");


const getAllProjectModules = async (req, res) => {
  try {
    const projectModules = await projectModuleModel.find()
      .populate("projectId", "title description")
      .populate("statusId", "name");

    res.json({
      success: true,
      message: "✅ Project modules fetched successfully",
      data: projectModules,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `❌ ${error.message}` });
  }
};


const getProjectModuleById = async (req, res) => {
  try {
    const projectModule = await projectModuleModel.findById(req.params.id)
      .populate("projectId", "title description")
      .populate("statusId", "name");

    if (!projectModule) {
      return res.status(404).json({ success: false, message: "❌ Project module not found" });
    }

    res.json({
      success: true,
      message: "✅ Project module fetched successfully",
      data: projectModule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `❌ ${error.message}` });
  }
};


const addProjectModule = async (req, res) => {
  try {
    const { projectId, moduleName, description, estimatedHours, statusId, startDate } = req.body;

    // Validation
    if (!projectId || !moduleName || !estimatedHours || !statusId || !startDate) {
      return res.status(400).json({
        success: false,
        message: "❌ Required fields: projectId, moduleName, estimatedHours, statusId, startDate",
      });
    }

    
    const projectExists = await projectModel.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({ success: false, message: "❌ Project not found." });
    }

   
    const newProjectModule = await projectModuleModel.create({
      projectId,
      moduleName,
      description: description || "",
      estimatedHours,
      statusId,
      startDate,
    });

    res.status(201).json({
      success: true,
      message: "✅ Project module added successfully",
      data: newProjectModule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `❌ ${error.message}` });
  }
};


const updateProjectModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { moduleName, description, estimatedHours, statusId, startDate } = req.body;

    const updatedModule = await projectModuleModel.findByIdAndUpdate(
      moduleId,
      {
        moduleName,
        description,
        estimatedHours,
        statusId,
        startDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedModule) {
      return res.status(404).json({ success: false, message: "❌ Project module not found" });
    }

    res.json({
      success: true,
      message: "✅ Project module updated successfully",
      data: updatedModule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `❌ ${error.message}` });
  }
};


const deleteProjectModule = async (req, res) => {
  try {
    const deletedModule = await projectModuleModel.findByIdAndDelete(req.params.id);

    if (!deletedModule) {
      return res.status(404).json({ success: false, message: "❌ Project module not found" });
    }

    res.json({
      success: true,
      message: "🗑️ Project module deleted successfully",
      data: deletedModule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `❌ ${error.message}` });
  }
};


const getModulesByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const modules = await projectModuleModel.find({ projectId })
      .populate("statusId", "name")
      .lean();

    if (!modules || modules.length === 0) {
      return res.status(404).json({ success: false, message: "❌ No modules found for this project." });
    }

    res.json({
      success: true,
      message: "✅ Modules for project fetched successfully",
      data: modules,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `❌ ${error.message}` });
  }
};

module.exports = {
  getAllProjectModules,
  getProjectModuleById,
  addProjectModule,
  updateProjectModule,
  deleteProjectModule,
  getModulesByProjectId, 
};
