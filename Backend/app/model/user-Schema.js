const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'NGO', 'Contributor'],
        required: false

    },
    loginCount:{
        type: Number,
        default:0
    },
    //----------------------------------------------------------------------------------------------
    location: {
        lat: {
            type: Number,
            required: false
        },
        long: {
            type: Number,
            required: false
        },
        address: {
            type: String,
            required: false
        }

    },
    socketId: {
        type: String,
        default: null
    }
}, { timestamps: true })
//----------------------------------------------------------------------------------------------
const User = mongoose.model('User', userSchema)
module.exports = User