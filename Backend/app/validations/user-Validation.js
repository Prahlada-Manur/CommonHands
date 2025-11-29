const joi = require('joi')
//--------------------------------------------User Registration Validation--------------------------------------------------
const registerValidation = joi.object({
    email: joi.string().required().trim().lowercase().email(),
    password: joi.string().min(8).max(32).required().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$.#!%*?&])[A-Za-z\d@$.#!%*?&]{8,}$/).messages({
        'string.pattern.base': "Password must constain at least 8 characters,one uppercase letter,one lowercase letter,one number and one special character"
    }),
    firstName: joi.string().required().trim().min(2).max(30),
    lastName: joi.string().required().trim().min(2).max(30),
    mobileNumber: joi.string().pattern(/^\+?\d{7,15}$/).messages({
        'string.pattern.base': 'mobileNumber must be digits, optionally starting with + and 7–15 digits'
    }).optional(),
    location: joi.object({
        lat: joi.number().optional(),
        long: joi.number().optional(),
        address: joi.string().optional().trim()
    }).optional()
})
//---------------------------------------------User Login Validation-------------------------------------------------
const loginValidation = joi.object({
    email: joi.string().required().trim().lowercase().email(),
    password: joi.string().min(3).max(32).required().trim(),
    location: joi.object({
        lat: joi.number().optional(),
        long: joi.number().optional(),
        address: joi.string().optional().trim()
    }).optional()
})
//----------------------------------------Ngo Registration Validation------------------------------------------------------
const ngoRegisterationValidation = joi.object({
    email: joi.string().required().trim().lowercase().email(),
    password: joi.string().min(8).max(32).required().trim().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).messages({
        'string.pattern.base': "Password must constain at least 8 characters,one uppercase letter,one lowercase letter,one number and one special character"
    }),
    firstName: joi.string().required().trim().min(2).max(30),
    lastName: joi.string().required().trim().min(2).max(30),
    mobileNumber: joi.string().pattern(/^\+?\d{7,15}$/).messages({
        'string.pattern.base': 'mobileNumber must be digits, optionally starting with + and 7–15 digits'
    }).optional(),
    ngoName: joi.string().required().trim().min(3).max(100),
    regNumber: joi.string().required().trim().min(3).max(50),
    contactEmail: joi.string().required().trim().lowercase().email(),
    location: joi.object({
        lat: joi.number().optional(),
        long: joi.number().optional(),
        address: joi.string().optional().trim()
    }).optional()
})
const userUpdateValidation=joi.object({
    firstName: joi.string().optional().trim().min(2).max(30),
    lastName: joi.string().optional().trim().min(2).max(30),
    email:joi.string().optional().trim().lowercase(),
    mobileNumber: joi.string().pattern(/^\+?\d{7,15}$/).messages({
        'string.pattern.base': 'mobileNumber must be digits, optionally starting with + and 7–15 digits'
    }).optional()
})
const ngoUpdateValidation=joi.object({
    ngoName:joi.string().lowercase().optional().trim(),
    regNumber:joi.string().trim().optional(),
    contactEmail:joi.string().trim().lowercase()

})
//----------------------------------------------------------------------------------------------
module.exports = { registerValidation, loginValidation, ngoRegisterationValidation,userUpdateValidation,ngoUpdateValidation }
