import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import JobPosting from './pages/JobPosting';
import JobList from './pages/JobList';
import Home from './pages/Home';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/post-job" element={<JobPosting />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
