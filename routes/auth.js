const router = require('express').Router();
const validators = require('../config/validators');
const bcrypt = require('bcryptjs');
let User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @route POST /api/auth/
// @desc Logins
// @access Public

router.post('/', (req, res) => {
    const {email, password} = req.body;

    // Stop if request is not valid
    const {error, value} = validators.login.validate(req.body)
    if (error) {
        const err = error.message.replace(/"/g, '')
        return res.status(400).json({message: err})
    }

    // Check for existing user
    User.findOne({email})
        .then(user => {
            // User does not exist
            if (!user) return res.status(400).json({message: "Utilizatorul nu există"})
            // Email is not confirmed
            if (!user.confirmed_email) return res.status(400).json({message: "Contul nu a fost activat încă"})

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({message: 'Nume sau parolă incorecte'});
                    jwt.sign(
                        {id: user.id},
                        process.env.jwtSecret,
                        {expiresIn: 3600},
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                _id: user.id,
                                name: user.name,
                                email: user.email,
                                phone: user.phone
                            })
                        }
                    )
                })
        })
});

// @route GET /api/auth/user
// @desc Get user data
// @access Private

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
})

module.exports = router;