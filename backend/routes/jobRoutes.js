const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware'); // assuming auth middleware for protected routes

router.post('/', protect, jobController.createJob);
router.get('/', jobController.getJobs);

module.exports = router;
