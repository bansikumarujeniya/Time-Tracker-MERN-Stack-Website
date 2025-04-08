const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  hourlyPrice: {
    type: Number,
    required: true
  },
  payment: {
    type: String,
    enum: ["Pending", "Paid"],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("billings", billingSchema);
