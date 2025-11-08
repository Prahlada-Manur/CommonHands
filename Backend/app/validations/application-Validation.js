const joi = require('joi')


const updateStatusValidation = joi.object({
    status: joi.string().trim().valid('Approved', 'hoursPending', 'Completed', 'Rejected').required(),
    rejectionReason: joi.string().allow('', null)
})
const logHoursValidation = joi.object({
    hours: joi.number().required(),
    note: joi.string().allow('', null)
})

module.exports = {
    updateStatusValidation, logHoursValidation
}