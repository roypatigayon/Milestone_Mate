import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectDetail = () => {
  const { userId, projectId } = useParams(); // Assuming userId and projectId are included in the URL params
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [userId, projectId]); // Update dependencies

  const fetchProject = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${userId}/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${userId}/${projectId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:5000/api/projects/${userId}/${projectId}`, config);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const editProject = () => {
    navigate(`/edit-project/${userId}/${projectId}`);
  };

  const addTask = () => {
    navigate(`/projects/${userId}/${projectId}/add-task`);
  };

  const editTask = (taskId) => {
    navigate(`/edit-task/${userId}/${projectId}/tasks/${taskId}`);
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${userId}/${projectId}/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="project-detail">
      <h2>Project: {project.projectName}</h2>
      <p>{project.description}</p>
      <p>Start Date: {project.startDate}</p>
      <p>End Date: {project.endDate}</p>
      <button onClick={deleteProject}>Delete Project</button>
      <button onClick={editProject}>Edit Project</button>
      <button onClick={addTask}>Add Task</button>
      <h3>Tasks</h3>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <h4>{task.taskName}</h4>
              <p>{task.description}</p>
              <p>Start Date: {task.startDate}</p>
              <p>End Date: {task.endDate}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => editTask(task.id)}>Edit Task</button>
              <button onClick={() => deleteTask(task.id)}>Delete Task</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available for this project.</p>
      )}
    </div>
  );
};

export default ProjectDetail;
