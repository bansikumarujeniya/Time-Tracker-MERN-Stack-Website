const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model("statuses", statusSchema);
