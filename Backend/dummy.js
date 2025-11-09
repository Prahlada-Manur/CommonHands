const mongoose = require('mongoose')
const transactionSchema = new mongoose.Schema({
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrganizationProfile',
        required: true
    },
    //----------------------------------------------------------------------------------------------
    donorDetails: {
        donorName: {
            type: String,
            required: true
        },
        donorEmail: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    },
    //----------------------------------------------------------------------------------------------
    transactionDetails: {
        transactionPurpose: {
            type: String,
            enum: ['Donation'],
            required: true
        },
        // donationType: {
        //     type: String,
        //     enum: ['OneTime', 'Recurring'],
        //     required: function () {
        //         return this.transactionDetails.transactionPurpose === 'Donation'
        //     }
        // },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: function () {
            }
        },
        // gatewaySubscriptionId: {
        //     type: String,
        //     required: function () {
        //         return this.transactionDetails.donationType === 'Donation' && this.transactionDetails.donationType === 'Recurring'
        //     },
        //     unique: true,
        //     sparse: true
        // },
        // nextPaymentDate: {
        //     type: Date,
        //     required: function () {
        //         return this.transactionDetails.donationType === "Donation" && this.transactionDetails.donationType === 'Recurring'
        //     }
        // },
        // tier: {
        //     type: String,
        //     enum: ['PremiumMonthly'],
        //     required: function () {
        //         return this.transactionDetails.transactionPurpose === "Premium"
        //     }
        // },
        // newExpiryDate: {
        //     type: Date,
        //     required: function () {
        //         return this.transactionDetails.transactionPurpose === 'Premium'
        //     }
        // },
        platformFee: {
            type: Number,
            required: true
        }
    },
    //----------------------------------------------------------------------------------------------
    transactionInfo: {
        amount: {
            type: Number,
            required: true
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Success', 'Failed'],
            default: 'Pending',
            required: true
        },
        paymentGateway: {
            type: String,
            enum: ['Razorpay'],
            required: true,
            default: 'Razorpay'
        },
        orderId: {
            type: String,
            required: true,
            unique: true
        },
    }
}, { timestamps: true })
//----------------------------------------------------------------------------------------------
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;