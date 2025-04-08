const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeLogSchema = new Schema({
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    totalMin: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("time_logs", timeLogSchema);
