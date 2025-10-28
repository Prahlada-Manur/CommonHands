const mongoose = require('mongoose')
const applicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    ngoRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationProfile',
        required: true
    },
    completionStatus: {
        type: String,
        enum: ['Pending', 'HoursPending', 'Rejected'],
        default: 'Pending'
    },
    hoursLogged: {
        type: Number,
        default: 0
    },
    completionDate: {
        type: Date,
        default: null
    },
    certificateUrl: {
        type: String,
        default: null
    }
}, { timestamps: true })
//----------------------------------------------------------------------------------------------
const Application = mongoose.model('Application', applicationSchema)
module.exports = Application