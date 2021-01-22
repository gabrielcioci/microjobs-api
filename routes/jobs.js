const router = require('express').Router();
let Job = require('../models/Job');
const auth = require('../middleware/auth')
const validators = require('../config/validators')

// @route GET /api/jobs
// @desc Get the list of jobs
// @access Public

router.get('/', (req, res) => {
    Job.find({reviewed: true, completed: false}).sort({createdAt: 'desc'})
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

// @route POST /api/jobs/accept/id
// @desc Accept job by ID
// @access Private


router.post('/accept/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job)
            return res.status(400).json({message: 'Jobul nu exista.'})
        const {title, description, phone, duration, date, tags, location, postedBy, reward} = job
        job.title = title;
        job.description = description;
        job.duration = duration;
        job.date = date;
        job.tags = tags;
        job.phone = phone;
        job.location = location;
        job.reviewed = true;
        job.postedBy = postedBy;
        job.reward = reward;
        await job.save()
        res.json({message: 'Job updated!'})
    } catch (err) {
        return res.status(400).json({message: 'Jobul nu poate fi acceptat.'})
    }
});


// @route POST /api/jobs/complete/id
// @desc Complete job by ID
// @access Private


router.post('/complete/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job)
            return res.status(400).json({message: 'Jobul nu exista.'})
        const {title, description, phone, duration, date, tags, location, reviewed, postedBy, reward} = job
        job.title = title;
        job.description = description;
        job.duration = duration;
        job.date = date;
        job.tags = tags;
        job.phone = phone;
        job.location = location;
        job.reviewed = reviewed;
        job.postedBy = postedBy;
        job.reward = reward;
        job.completed = true;
        await job.save()
        res.json({message: 'Job completat cu success!'})
    } catch (err) {
        return res.status(400).json({message: 'Jobul nu poate fi completat.'})
    }
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
    const phone = req.body.phone;
    const location = req.body.location;
    const reviewed = req.body.reviewed;
    const postedBy = req.body.postedBy;
    const reward = req.body.reward;

    const newJob = new Job({title, description, duration, phone, date, tags, location, reviewed, postedBy, reward});
    newJob.save()
        .then(() => res.json('Job added!'))
        .catch(err => res.status(400).json('Error:' + err));
});

module.exports = router;