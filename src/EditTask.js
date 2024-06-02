import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTask = () => {
  const { userId, projectId, taskId } = useParams(); // Include userId in the params
  const navigate = useNavigate();
  const [task, setTask] = useState({
    taskName: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: '',
    status: ''
  });

  useEffect(() => {
    fetchTask();
  }, [userId, projectId, taskId]); // Update the dependencies

  const fetchTask = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${userId}/${projectId}/tasks/${taskId}`); // Include userId in the GET request
      const { startDate, endDate, ...taskData } = response.data;
      setTask({ ...taskData, startDate, endDate });
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format dates to yyyy-MM-dd format
    const formattedStartDate = task.startDate;
    const formattedEndDate = task.endDate;
    
    try {
      await axios.put(`http://localhost:5000/api/projects/${userId}/${projectId}/tasks/${taskId}`, { // Include userId in the PUT request
        ...task,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
      navigate(`/projects/${userId}/${projectId}`); // Navigate to project details page
    } catch (error) {
      console.error('Error updating task:', error);
      // Display error message to the user
      alert('Error updating task. Please try again later.');
    }
  };

  return (
    <div className="edit-task">
      <h2>Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input type="text" name="taskName" value={task.taskName} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={task.description} onChange={handleChange} required />
        </label>
        <label>
          Start Date:
          <input type="date" name="startDate" value={task.startDate} onChange={handleChange} required />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={task.endDate} onChange={handleChange} required />
        </label>
        <label>
          Priority: 
          <select name="priority" value={task.priority} onChange={handleChange} required>
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label>
          Status:
          <select name="status" value={task.status} onChange={handleChange} required>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
