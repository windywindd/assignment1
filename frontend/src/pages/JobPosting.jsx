import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext'; // make sure your AuthContext stores role

const JobPosting = () => {
  const { user } = useAuth(); // get logged-in user (with role from backend)

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // Block employees from posting
  if (!user || user.role !== 'employer') {
    return <h3 style={{ color: 'red', textAlign: 'center' }}>Access Denied: Only employers can post jobs.</h3>;
  }

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
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-center">Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Job Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          className="w-full mb-3 p-2 border rounded"
        />
        <textarea 
          placeholder="Job Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          className="w-full mb-3 p-2 border rounded"
        />
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Post Job
        </button>
      </form>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default JobPosting;
