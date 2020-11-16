const router = require('express').Router();
let User = require('../models/User');
const auth = require('../middleware/auth')

// @route GET /api/users
// @desc Get users list
// @access Private

router.get('/', auth, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error:' + err))
});

// @route GET /api/users/id
// @desc Get user by ID
// @access Public

router.get('/:id', (req, res) => {
    User.findById(req.params.id)
        .select('-password')
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error:' + err))
});


module.exports = router;