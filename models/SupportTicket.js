const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SupportTicketSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    category: {type: Object},
    description: {type: String, required: true},
}, {
    timestamps: true,
});

const SupportTicket = mongoose.model('SupportTicket', SupportTicketSchema);

module.exports = SupportTicket;