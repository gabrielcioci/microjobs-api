const jwt = require('jsonwebtoken');
const config = require('../config')

function auth(req, res, next) {
    const token = req.header('X-AUTH-TOKEN');

    // Check for token
    if (!token) return res.status(401).json({message: 'No token, authorization denied'});

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({message: 'Invalid Token'})
    }
}

module.exports = auth;