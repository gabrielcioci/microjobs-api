const Joi = require('joi')
const passPattern = /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/

const name = Joi.string()
    .min(3)
    .message('Numele trebuie sa aibă minim 3 caractere')
    .required()

const password = Joi.string()
    .pattern(passPattern) // Password Pattern
    .message('Parola nu este validă') // Error message when password is not valid
    .required()

const loginPassword = Joi.string()
    .required()

const email = Joi.string()
    .trim()
    .email()
    .message('Email-ul nu este valid') // Error message when password is not valid
    .required()

const jobDescription = Joi.string()
    .min(20)
    .message('Descrierea trebuie sa aiba minim 20 de caractere')
    .required()

const jobTitle = Joi.string()
    .min(5)
    .message('Titlul trebuie sa aiba minim 5 caractere')
    .required()

const jobTags = Joi.array()
    .min(1)
    .message('Jobul trebuie sa aiba minim 1 eticheta')
    .required()

module.exports = {
    name,
    password,
    loginPassword,
    email,
    jobDescription,
    jobTitle,
    jobTags,
}

