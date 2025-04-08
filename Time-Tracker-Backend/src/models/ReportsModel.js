const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportsSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "tasks",
    required: true,
  },
  totalHour: {
    type: Number, 
  },
  productivity: {
    type: Number, 
  },
  generatedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("reports", reportsSchema);
