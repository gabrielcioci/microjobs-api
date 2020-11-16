const basicValidators = require('./basicValidators')
const Joi = require('joi')

module.exports = Joi.object({
    name: basicValidators.name,
    email: basicValidators.email,
    password: basicValidators.password
}).unknown()

