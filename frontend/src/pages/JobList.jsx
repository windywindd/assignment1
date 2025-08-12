import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data } = await axiosInstance.get('/api/jobs');
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.length === 0 && <p>No jobs available</p>}
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <small>Posted by: {job.employer?.name || 'Unknown'}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
