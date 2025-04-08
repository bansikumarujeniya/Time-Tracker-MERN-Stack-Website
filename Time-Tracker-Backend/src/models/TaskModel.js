const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: "project_modules",
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    statusId: {
        type: Schema.Types.ObjectId,
        ref: "statuses",
        required: true
    },
    totalMinute: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("tasks", taskSchema);
