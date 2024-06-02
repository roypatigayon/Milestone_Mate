import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProject = () => {
  const { userId, projectId } = useParams(); // Get user ID and project ID from URL params
  const navigate = useNavigate();
  const [project, setProject] = useState({
    projectName: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchProject();
  }, [userId, projectId]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token'); // Ensure the token is fetched
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`http://localhost:5000/api/projects/${userId}/${projectId}`, config);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`http://localhost:5000/api/projects/${userId}/${projectId}`, project, config);
      navigate(`/projects/${userId}/${projectId}`); // Navigate to project details page
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <div className="edit-project">
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            name="projectName"
            value={project.projectName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={project.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={project.startDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={project.endDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Update Project</button>
      </form>
    </div>
  );
};

export default EditProject;

