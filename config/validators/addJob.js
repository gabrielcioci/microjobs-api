const basicValidators = require('./basicValidators')
const Joi = require('joi')

module.exports = Joi.object({
    title: basicValidators.jobTitle,
    description: basicValidators.description,
    tags: basicValidators.jobTags,
}).unknown()

