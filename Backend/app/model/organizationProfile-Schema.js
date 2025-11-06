const mongoose = require('mongoose')
const organizationProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    ngoName: {
        type: String,
        required: true
    },
    regNumber: {
        type: String,
        required: true,
        unique: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    coordinatorAadhaarUrl: {
        type: String,
    },
    ngoLicenseUrl: {
        type: String,
    },
    ngoProfilePic: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    reason: {
        type: String,
        default: null
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    premiumExpiryDate: {
        type: Date,
        default: null
    },
    lastFundingDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })
//----------------------------------------------------------------------------------------------
const OrganizationProfile = mongoose.model('OrganizationProfile', organizationProfileSchema)
module.exports = OrganizationProfile
