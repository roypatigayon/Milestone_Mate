import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Ensure this line is present

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

const fetchProjects = async () => {
  try {
    const userString = localStorage.getItem('user'); // Get the user object from localStorage

    if (!userString) {
      console.error('No user data found in localStorage');
      return;
    }

    const user = JSON.parse(userString); // Parse the user object
    const userId = user.id; // Get the user ID

    const token = localStorage.getItem('token'); // Get the JWT token from localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    };

    const response = await axios.get(`http://localhost:5000/api/projects?userId=${userId}`, config);
    const projectsWithProgress = await Promise.all(
      response.data.map(async (project) => {
        const progressResponse = await axios.get(`http://localhost:5000/api/projects/${userId}/${project.id}/progress`, config);
        return { ...project, progress: progressResponse.data.progress };
      })
    );
    setProjects(projectsWithProgress);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};


  return (
    <div className="dashboard">
      <h2>Project Dashboard</h2>
      <Link to="/create-project" className="btn-add-project">Add New Project</Link>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-item">
            <h3>Project Name: {project.projectName}</h3>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${project.progress}%` }}>
                {project.progress}%
              </div>
            </div>
            <Link to={`/projects/${project.userId}/${project.id}`} className="btn-view-project">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;




