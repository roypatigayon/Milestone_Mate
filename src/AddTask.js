import React, { useState } from 'react';
import './Auth.css';
import { useParams, useNavigate } from 'react-router-dom';

const AddTask = () => {
  const { userId, projectId } = useParams(); // Get user ID and project ID from URL params
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/projects/${userId}/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskName,
          description,
          startDate,
          endDate,
          priority,
          status,
          projectId, // Ensure projectId is included in the request body
          userId, // Ensure userId is included in the request body
        }),
      });

      if (response.ok) {
        const task = await response.json();
        alert(`Task created: ${JSON.stringify(task)}`);
        navigate(`/projects/${userId}/${projectId}`); // Redirect to the project details page after task creation // Redirect to the project details page after task creation
      } else {
        const error = await response.json();
        alert(`Error creating task: ${error.details}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="add-task">
      <h2>Create new task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
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
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br></br>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Select Status</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <br></br>
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
};

export default AddTask;


