const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    description: {
        type: String,
        trim: true
    },
    technology: { 
        type: String,
        trim: true
    },
    estimatedHours: { 
        type: Number,
        min: 0 
    },
    startDate: { 
        type: Date,
        default: Date.now
    },
    completionDate: { 
        type: Date
    },
    statusId: {
        type: Schema.Types.ObjectId,
        ref: "statuses", 
        required: true
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
