const { required } = require('joi')
const mongoose = require('mongoose')
const applicationSchema = new mongoose.Schema({
    applicant: { //done
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: { //done
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    ngo: { //done
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationProfile',
        required: true
    },
    completionStatus: { //done
        type: String,
        enum: [ 'hoursPending', 'Approved', 'Completed', 'Rejected'],
        default: 'Approved'
    },
    hoursLogged: {
        type: Number,
        default: 0
    },
    hoursRequested: { //done 
        type: Number,
        default: 0
    },
    hoursLog: {
        type: [{
            hours: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                enum: ['Pending', "Approved", 'Rejected'],
                default: 'Pending'
            },
            note: {
                type: String,
                 default: null
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    },
    rejectionReason: {// done
        type: String,
        default: null,
        required: false
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