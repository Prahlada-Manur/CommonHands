const joi = require('joi')

//------------------------location validation-----------------------------------------------------------------

const locationValidation = joi.object({
    lat: joi.number().optional(),
    long: joi.number().optional(),
    address: joi.string().trim().optional()
})
//------------------------------------Create Validation---------------------------------------------------
const createTaskValidation = joi.object({
    title: joi.string().lowercase().min(3).max(48).required(),
    description: joi.string().lowercase().min(3).max(150).required(),
    location: locationValidation.optional(),
    taskType: joi.string().valid('Volunteer', 'volunteer', 'Funding', 'funding', 'donation', 'Donation').required(),
    requiredSkills: joi.string().allow('', null),
    requiredHours: joi.number().integer().min(0).optional(),
    fundingGoal: joi.when('taskType', {
        is: joi.valid('funding', 'Funding', 'donation', 'Donation'),
        then: joi.number().required()
    }),
    deadline: joi.date().iso().required()
})
//-------------------------------------------Update Validation--------------------------------------
const updateTaskValidation = joi.object({
    title: joi.string().lowercase().min(3).max(48).optional(),
    description: joi.string().lowercase().min(3).max(150).optional(),
    location: locationValidation.optional(),
    requiredSkills: joi.string().allow('', null).optional(),
    requiredHours: joi.number().integer().min(0).optional(),
    fundingGoal: joi.number().min(0).optional(),
    deadline: joi.date().iso().optional(),
    replaceImages: joi.boolean().optional()

})

module.exports = {
    createTaskValidation,
    updateTaskValidation
}