import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Get the JWT token from localStorage
      const userString = localStorage.getItem('user'); // Get the user object from localStorage

      if (!userString) {
        throw new Error('No user data found in localStorage');
      }

      const user = JSON.parse(userString); // Parse the user object
      const userId = user.id; // Get the user ID

      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          projectName: projectName || null,
          description: description || null,
          startDate: startDate || null,
          endDate: endDate || null,
          userId: userId || null,
        }), // Include userId in the request body
      });

      if (response.ok) {
        const project = await response.json();
        alert(`Project created: ${JSON.stringify(project)}`);
        navigate('/dashboard');
      } else {
        const error = await response.json();
        alert(`Error creating project: ${error.details}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="create-project">
      <h2>Create new project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default CreateProject;


