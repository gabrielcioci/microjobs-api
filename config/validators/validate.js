const validate = (req, res, schema) => {
    const {error, value} = schema.validate(req.body)
    if (error) {
        const err = error.message.replace(/"/g, '')
        return res.status(400).json({message: err})
    }
    return true
}

module.exports = validate;