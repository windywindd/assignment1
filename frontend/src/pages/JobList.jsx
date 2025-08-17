import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const JobList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loadingJobId, setLoadingJobId] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axiosInstance.get('/api/jobs');
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (user.role !== 'employee') return;

    setLoadingJobId(jobId);
    try {
      await axiosInstance.post(`/api/jobs/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Applied successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to apply.');
    } finally {
      setLoadingJobId(null);
    }
  };

  const handleDelete = async (jobId) => {
    if (user.role !== 'employer') return;
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    setLoadingJobId(jobId);
    try {
      await axiosInstance.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
      alert('Job deleted successfully!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to delete job.');
    } finally {
      setLoadingJobId(null);
    }
  };
  const handleEditClick = (job) => {
    setEditingJobId(job._id);
    setEditingTitle(job.title);
    setEditingDescription(job.description);
  };
  const handleSaveEdit = async (jobId) => {
    try {
      await axiosInstance.put(`/api/jobs/${jobId}`, {
        title: editingTitle,
        description: editingDescription,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Update job in local state
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, title: editingTitle, description: editingDescription } : job
      ));

      setEditingJobId(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to update job.');
    }
  };


  

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-gray-100">
      <h2 className="text-2xl font-bold p-2 mb-4">Available Jobs</h2>
      {jobs.length === 0 && <p>No jobs available</p>}
      <ul>
        {jobs.map((job) => (
          <li key={job._id} className="border p-4 mb-4 rounded shadow">
            {editingJobId === job._id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(job._id)}
                    className="bg-green-600 text-white p-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingJobId(null)}
                    className="bg-gray-400 text-white p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p>{job.description}</p>
                <small>Posted by: {job.employer?.name || 'Unknown'}</small>

                <div className="mt-2 flex gap-2">
                  {user.role === 'employee' && (
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={loadingJobId === job._id}
                      className="bg-green-600 text-white p-2 rounded"
                    >
                      {loadingJobId === job._id ? 'Applying...' : 'Apply'}
                    </button>
                  )}

                  {user.role === 'employer' && job.employer?._id === user.id && (
                    <>
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={loadingJobId === job._id}
                        className="bg-red-600 text-white p-2 rounded"
                      >
                        {loadingJobId === job._id ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={() => handleEditClick(job)}
                        className="bg-yellow-500 text-white p-2 rounded"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        ))}

      </ul>
    </div>
  );
};

export default JobList;
