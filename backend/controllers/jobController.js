const Job = require('../models/jobModel');

exports.createJob = async (req, res) => {
  try {
    const { title, description } = req.body;
    const employer = req.user._id; // assuming user is authenticated and user id is in req.user

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    const newJob = new Job({ title, description, employer });
    await newJob.save();

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('employer', 'name email'); // add fields as needed
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
