const router = require('express').Router();
const User = require('../models/User');

// @route UPDATE api/activation/user/id
// @desc Activate user by ID
// @access Public

router.post('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user)
            return res.status(400).json({message: 'Contul nu poate fi activat.'})
        const {name, email, password} = user
        user.name = name;
        user.email = email;
        user.password = password;
        user.confirmed_email = true;
        await user.save()
        res.json({message: 'Felicitări! Contul a fost activat cu succes.'})
    } catch (err) {
        return res.status(400).json({message: 'Contul nu poate fi activat.'})
    }
});


module.exports = router;