const router = require('express').Router();
let Job = require('../models/Job');
const auth = require('../middleware/auth')
const validators = require('../config/validators')

// @route GET /api/jobs
// @desc Get the list of jobs
// @access Public

router.get('/', (req, res) => {
    Job.find({reviewed: true}).sort({createdAt: 'desc'})
        .then(jobs => res.json(jobs))
        .catch(err => res.status(400).json('Error:' + err))
});

// @route GET /api/jobs/draft
// @desc Get the list of unreviewed jobs
// @access Admin

router.get('/draft', auth, (req, res) => {
    Job.find({reviewed: false}).sort({createdAt: 'desc'})
        .then(jobs => res.json(jobs))
        .catch(err => res.status(400).json('Error:' + err))
});

// @route GET /api/jobs/id
// @desc Get job by ID
// @access Private

router.get('/:id', auth, (req, res) => {
    Job.findById(req.params.id)
        .then(job => res.json(job))
        .catch(err => res.status(400).json('Error:' + err))
});

// @route DELETE /api/jobs/id
// @desc Delete job by ID
// @access Admin

router.delete('/:id', auth, (req, res) => {
    Job.findByIdAndDelete(req.params.id)
        .then(() => res.json('Job Deleted.'))
        .catch(err => res.status(400).json('Error:' + err))
});

// @route UPDATE /api/jobs/update/id
// @desc Update job by ID
// @access Private

router.post('/update/:id', auth, (req, res) => {
    Job.findById(req.params.id)
        .then(job => {
            job.title = req.body.title;
            job.description = req.body.description;
            job.duration = Number(req.body.duration);
            job.date = Date.parse(req.body.date);
            job.tags = req.body.tags;
            job.location = req.body.location;
            job.reviewed = req.body.reviewed;
            job.postedBy = req.body.postedBy;

            job.save()
                .then(() => res.json('Job updated!'))
                .catch(err => res.status(400).json('Error:' + err));
        })
        .catch(err => res.status(400).json('Error:' + err));
});

// @route POST /api/jobs/add
// @desc Add a new job
// @access Private

router.post('/add', auth, (req, res) => {

    // Stop if request is not valid
    const {error, value} = validators.addJob.validate(req.body)

    if (error) {
        const err = error.message.replace(/"/g, '')
        return res.status(400).json({message: err})
    }

    const title = req.body.title;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const date = Date.parse(req.body.date);
    const tags = req.body.tags;
    const location = req.body.location;
    const reviewed = req.body.reviewed;
    const postedBy = req.body.postedBy;

    const newJob = new Job({title, description, duration, date, tags, location, reviewed, postedBy});
    newJob.save()
        .then(() => res.json('Job added!'))
        .catch(err => res.status(400).json('Error:' + err));
});

module.exports = router;