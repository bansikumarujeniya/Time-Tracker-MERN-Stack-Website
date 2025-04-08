const Project = require('../models/ProjectModel');

// Add a new project
const addProject = async (req, res) => {
    try {
        const savedProject = await Project.create(req.body);
        res.status(201).json({
            message: "Project added successfully",
            data: savedProject,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("statusId", "name"); 
        res.status(200).json({
            message: "All Projects",
            data: projects,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("statusId", "name");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({
            message: "Project details",
            data: project,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("statusId");

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project updated successfully", data: updatedProject });
    } catch (error) {
        res.status(500).json({ message: "Error updating project", error });
    }
};

// Delete a project by ID
const deleteProject = async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { addProject, getProjects, getProjectById, updateProject, deleteProject };
