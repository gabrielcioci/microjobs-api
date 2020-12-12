const router = require('express').Router();
let SupportTicket = require('../models/SupportTicket');
const validators = require('../config/validators')

// @route POST /api/support/ticket
// @desc Add a new support ticket
// @access Private

router.post('/ticket', (req, res) => {

    // Stop if request is not valid
    const {error, value} = validators.support.validate(req.body)

    if (error) {
        const err = error.message.replace(/"/g, '')
        return res.status(400).json({message: err})
    }

    const name = req.body.name;
    const description = req.body.description;
    const category = req.body.category;
    const email = req.body.email;

    const newTicket = new SupportTicket({name, email, category, description});
    newTicket.save()
        .then(() => res.json('Ticket added!'))
        .catch(err => res.status(400).json('Error:' + err));
});

module.exports = router;