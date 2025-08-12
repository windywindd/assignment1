import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
// Remove this import if you remove the next line
// import { useAuth } from '../context/AuthContext';

const JobPosting = () => {
  // Remove this line if you don't use user
  // const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/jobs', { title, description });
      setMessage('Job posted successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div>
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Job Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Job Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <button type="submit">Post Job</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JobPosting;
