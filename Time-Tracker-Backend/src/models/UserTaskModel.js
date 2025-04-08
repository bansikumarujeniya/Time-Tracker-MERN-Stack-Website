const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userTaskSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    taskId: {
        type: Schema.Types.ObjectId,
        ref: "tasks",
        required: true
    },
    workedHr: {
        type: Number,
        required: true,
        default: 0 
    },
    logDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("user_tasks", userTaskSchema);
