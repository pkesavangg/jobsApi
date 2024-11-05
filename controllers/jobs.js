const { BadRequestError, NotFoundError } = require("../errors");
const notFound = require("../middleware/not-found");
const Job = require("../models/Job");
const User = require("../models/User");
const {StatusCodes} = require('http-status-codes')


const getAllJobs = async (req, res) => {
    req.body.createdBy = req.user.userId
    const jobs = await Job.find({createdBy: req.user.userId})
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
}

const getJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.findOne({_id: req.params.id, createdBy: req.user.userId})
    if (!job) {
        throw new NotFoundError('Job not found')
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const {company, position} = req.body
    if (!company || !position) {
        throw new BadRequestError('Provide valid values')
    }
    
    
    const job = await Job.findByIdAndUpdate({_id: req.params.id, createdBy: req.user.userId}, req.body, {
        new: true,
        runValidators: true
    })
    if (!job) {
        throw new NotFoundError('Job not found')
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.findOneAndDelete({_id: req.params.id, createdBy: req.user.userId})

    res.status(StatusCodes.NO_CONTENT)
    res.send('deleteJob User').send()
}

module.exports = {
    getAllJobs, 
    getJob,
    createJob,
    updateJob,
    deleteJob
}