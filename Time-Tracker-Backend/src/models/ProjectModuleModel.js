const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectModuleSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  moduleName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  estimatedHours: {
    type: Number
  },
  statusId: {
    type: Schema.Types.ObjectId,
    ref: "statuses",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("project_modules", projectModuleSchema);
