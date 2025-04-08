const projectTeamModel = require("../models/ProjectTeamModel");

// Get all project teams
const getAllProjectTeams = async (req, res) => {
    try {
        const projectTeams = await projectTeamModel.find()
            .populate("projectId")
            .populate("userId");
        res.json({
            message: "Project Teams fetched successfully",
            data: projectTeams,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a project team member
const addProjectTeam = async (req, res) => {
    try {
        const newProjectTeam = await projectTeamModel.create(req.body);
        res.status(201).json({
            message: "Project Team member added successfully",
            data: newProjectTeam,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a project team member by ID
const deleteProjectTeam = async (req, res) => {
    try {
        const deletedMember = await projectTeamModel.findByIdAndDelete(req.params.id);
        if (!deletedMember) {
            return res.status(404).json({ message: "Project Team member not found" });
        }
        res.json({
            message: "Project Team member deleted successfully",
            data: deletedMember,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get project team member by ID
const getProjectTeamById = async (req, res) => {
    try {
        const projectTeam = await projectTeamModel.findById(req.params.id)
            .populate("projectId")
            .populate("userId");
        if (!projectTeam) {
            return res.status(404).json({ message: "Project Team member not found" });
        }
        res.json({
            message: "Project Team member fetched successfully",
            data: projectTeam,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProjectTeams,
    addProjectTeam,
    deleteProjectTeam,
    getProjectTeamById,
};
