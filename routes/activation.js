const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
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
        jwt.sign(
            {id: user.id},
            process.env.jwtSecret,
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
    } catch (err) {
        return res.status(400).json({message: 'Contul nu poate fi activat.'})
    }
});


module.exports = router;