const Joi = require('joi')
const passPattern = /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/

const name = Joi.string()
    .min(3)
    .message('Numele trebuie sa aibă minim 3 caractere')
    .required()

const password = Joi.string()
    .pattern(passPattern) // Password Pattern
    .message('Parola trebuie sa conțină minim 8 caractere, litere și cifre.') // Error message when password is not valid
    .required()

const loginPassword = Joi.string()
    .required()

const email = Joi.string()
    .trim()
    .email()
    .message('Email-ul nu este valid')
    .required()

const description = Joi.string()
    .min(10)
    .message('Descrierea trebuie sa aiba minim 10 caractere')
    .required()

const category = Joi.string()
    .min(1)
    .message('Selectează o categorie')
    .required()

const jobTitle = Joi.string()
    .min(3)
    .message('Titlul trebuie sa aiba minim 3 caractere')
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
    description,
    jobTitle,
    jobTags,
    category
}

