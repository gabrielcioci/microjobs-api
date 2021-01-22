const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User');
const validators = require('../config/validators')
const sendConfirmationEmail = require('../config/mailer')

// @route POST /api/register
// @desc Register new user
// @access Public

router.post('/', async (req, res) => {
    const {name, email, password} = req.body;

    // Stop if request is not valid
    const {error, value} = validators.register.validate(req.body)
    if (error) {
        const err = error.message.replace(/"/g, '')
        return res.status(400).json({message: err})
    }
    // Check for existing user
    const user = await User.findOne({email})
    if (user)
        return res.status(400).json({message: 'Utilizatorul există deja'})
    // Create user
    try {
        const newPendingUser = new User({name, email, password});
        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPendingUser.password, salt, async (err, hash) => {
                if (err) throw err;
                newPendingUser.password = hash;
                await newPendingUser.save()
                await sendConfirmationEmail(newPendingUser)
                res.json({message: 'Ai fost înregistrat! Verifică adresa de email pentru activarea contului.'})
            })
        })
    } catch (err) {
        return res.status(400).json({message: err})
    }
});

module.exports = router;