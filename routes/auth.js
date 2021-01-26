const router = require('express').Router();
const validators = require('../config/validators');
const bcrypt = require('bcryptjs');
let User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const config = require('../config')
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(config.googleClientId)

// @route POST /api/auth/
// @desc Login
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
                        config.jwtSecret,
                        {expiresIn: '1d'},
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                _id: user.id,
                                name: user.name,
                                email: user.email,
                            })
                        }
                    )
                })
        })
});

// @route POST /api/auth/googlelogin
// @desc Google Login
// @access Public

router.post('/googlelogin', (req, res) => {
    const {tokenId} = req.body;
    client.verifyIdToken({idToken: tokenId, audience: config.googleClientId})
        .then(response => {
            const {email_verified, name, email} = response.payload
            if (!email_verified) return res.status(400).json({message: "Email-ul nu a fost confirmat încă"})
            User.findOne({email})
                .then(user => {
                    if (user) {
                        jwt.sign(
                            {id: user.id},
                            config.jwtSecret,
                            {expiresIn: '1d'},
                            (err, token) => {
                                if (err) throw err;
                                res.json({
                                    token,
                                    _id: user.id,
                                    name: user.name,
                                    email: user.email,
                                })
                            }
                        )
                    } else {
                        let password = email + config.jwtSecret;
                        let newUser = new User({name, email, password, confirmed_email: email_verified})
                        // Create salt & hash
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, async (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                await newUser.save()
                                jwt.sign(
                                    {id: newUser.id},
                                    config.jwtSecret,
                                    {expiresIn: '1d'},
                                    (err, token) => {
                                        if (err) throw err;
                                        res.json({
                                            token,
                                            _id: newUser.id,
                                            name: newUser.name,
                                            email: newUser.email,
                                        })
                                    }
                                )
                            })
                        })
                    }
                })
        })
})


// @route GET /api/auth/user
// @desc Get user data
// @access Private

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
})

module.exports = router;