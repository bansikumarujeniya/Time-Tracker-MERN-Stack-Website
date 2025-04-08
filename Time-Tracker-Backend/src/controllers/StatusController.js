const statusModel = require("../models/StatusModel");

// Get all statuses
const getAllStatuses = async (req, res) => {
    try {
        const statuses = await statusModel.find();
        res.json({
            message: "Statuses fetched successfully",
            data: statuses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new status
const addStatus = async (req, res) => {
    try {
        const newStatus = await statusModel.create(req.body);
        res.status(201).json({
            message: "Status added successfully",
            data: newStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a status by ID
const deleteStatus = async (req, res) => {
    try {
        const deletedStatus = await statusModel.findByIdAndDelete(req.params.id);
        if (!deletedStatus) {
            return res.status(404).json({ message: "Status not found" });
        }
        res.json({
            message: "Status deleted successfully",
            data: deletedStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get status by ID
const getStatusById = async (req, res) => {
    try {
        const status = await statusModel.findById(req.params.id);
        if (!status) {
            return res.status(404).json({ message: "Status not found" });
        }
        res.json({
            message: "Status fetched successfully",
            data: status,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllStatuses,
    addStatus,
    deleteStatus,
    getStatusById,
};
