const basicValidators = require('./basicValidators')
const Joi = require('joi')

module.exports = Joi.object({
    email: basicValidators.email,
    password: basicValidators.loginPassword
})

