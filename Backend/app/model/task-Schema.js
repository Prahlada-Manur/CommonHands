const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationProfile',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        long: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    taskType: {
        type: String,
        enum: ['Volunteer', 'funding'],
        required: true
    },
    requiredSkills: {
        type: String,
    },
    requiredHours: {
        type: Number,
        default: 0
    },
    fundingGoal: {
        type: Number,
        default: 0
    },
    currentFund: {
        type: Number,
        default: 0
    },
    deadline: {
        type: Date,
        required: true
    },
    images: [
        {
            url: {
                type: String
            },
            public_id: {
                type: String
            }
        }
    ],
    isFeatured: {
        type: Boolean,
        default: false
    },
    featuredUntil: {
        type: Date,
        default: null
    },
    taskStatus: {
        type: String,
        enum: ['Open', 'Completed', 'Archived'],
        default: 'Open'
    },
    aiVettingScore: {
        type: Number,
        default: null
    }
}, { timestamps: true })
//----------------------------------------------------------------------------------------------
const Task = mongoose.model('Task', taskSchema)
module.exports = Task