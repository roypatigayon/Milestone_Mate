import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-container">
      <h2>Projects</h2>
      <button className="add-button">
        <Link to="/create-project">+ Add More</Link>
      </button>
      <div className="project-list">
        {projects.map(project => (
          <div className="project-item" key={project.id}>
            <Link to={`/project/${project.id}`}>{project.projectName}</Link>
            <span className="status">In Progress</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
