import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Loginn.js';
import Register from './Register.js';
import Dashboard from './Dashboard.js';
import NavBar from './NavBar.js';
import CreateProject from './CreateProject.js';
import ProjectDetail from './ProjectDetail.js';
import EditProject from './EditProject'; 
import AddTask from './AddTask';
import EditTask from './EditTask';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // Add user state

  return (
    <Router>
      <NavBar user={user} setUser={setUser} /> {/* Pass user and setUser to NavBar */}
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} /> {/* Pass setUser to Login */}
        <Route path="/register" element={<Register setUser={setUser} />} /> {/* Pass setUser to Register */}
        <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} /> {/* Pass user and setUser to Dashboard */}
        <Route path="/projects/:userId/:projectId" element={<ProjectDetail />} />
        <Route path="/edit-project/:userId/:projectId" element={<EditProject />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/projects/:userId/:projectId/add-task" element={<AddTask />} />
        <Route path="/edit-task/:userId/:projectId/tasks/:taskId" element={<EditTask />} />
        <Route path="/" element={<Login setUser={setUser} />} /> {/* Pass setUser to Login */}
      </Routes>
    </Router>
  );
}

export default App;
