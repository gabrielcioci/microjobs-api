const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    tags: {type: Array},
    location: {type: Object},
    duration: {type: Number, required: true},
    reward: {type: Number, required: true},
    phone: {type: String, required: true},
    date: {type: Date, required: true},
    reviewed: {type: Boolean, default: false},
    completed: {type: Boolean, default: false},
    postedBy: {type: String, required: true}
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;