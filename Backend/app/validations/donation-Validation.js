const joi = require('joi')

const donateValidation = joi.object({
    amount: joi.number().min(1).required().positive(),
    donorName: joi.string().lowercase().required(),
    donorEmail: joi.string().lowercase().trim().required()
})
module.exports = {
    donateValidation
}