const express = require('express');
const { createJob, getAllJobs, getJob, deleteJob, updateJob } = require('../controllers/jobs');
const { login, register } = require('../controllers/auth');
const router = express.Router()


router.route('/login')
.post(login)

router.route('/register')
.post(register)




module.exports = router

