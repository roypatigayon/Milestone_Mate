const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const generateToken = require('./routes/auth');
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get the JWT from request headers
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = decoded; // Attach decoded user data to the request object
    next();
  });
};
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'milestone_mate'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

app.get('/', (req, res) => {
  res.send('Hello, your server is running!');
});

// API endpoints

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT id, name, email FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(500).send('Error querying database');
    } else if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' }); // Change 'your_secret_key' to your actual secret key
      res.status(200).json({ token, user });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;

  const query = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
  db.query(query, [email, password, name], async (err, result) => {
    if (err) {
      res.status(500).send('Error creating account');
    } else {
      const userId = result.insertId; // Get the ID of the newly registered user
      try {
        // Update projects based on userId
        await db.promise().execute('UPDATE projects SET userId = ? WHERE userId IS NULL AND id = ?', [userId, userId]);
        // Update tasks based on userId
        await db.promise().execute('UPDATE tasks SET userId = ? WHERE userId IS NULL AND id = ?', [userId, userId]);
        res.status(201).send('Account created');
      } catch (error) {
        console.error('Error updating projects and tasks:', error);
        res.status(500).send('Error updating projects and tasks');
      }
    }
  });
});

// Create project
app.post('/api/projects', async (req, res) => {
  const { projectName, description, startDate, endDate, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [result] = await db.promise().execute(
      'INSERT INTO projects (projectName, description, startDate, endDate, userId) VALUES (?, ?, ?, ?, ?)',
      [projectName || null, description || null, startDate || null, endDate || null, userId]
    );
    if (result.affectedRows > 0) {
      res.status(201).json({ id: result.insertId, projectName, description, startDate, endDate, userId });
    } else {
      res.status(500).json({ error: 'Error creating project', details: 'No rows affected' });
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Error creating project', details: error.message });
  }
});

// Fetch all projects
app.get('/api/projects', async (req, res) => {
  const { userId } = req.query; // Get the user ID from the query parameters

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [projects] = await db.promise().execute('SELECT * FROM projects WHERE userId = ?', [userId]);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// GET project details by User ID and Project ID
app.get('/api/projects/:userId/:projectId', async (req, res) => {
  const userId = req.params.userId; // Get the user ID from the request parameters
  const projectId = req.params.projectId; // Get the project ID from the request parameters
  try {
    // Query the database to fetch project details using the user ID and project ID
    const [project] = await db.promise().execute('SELECT projectName, description, DATE_FORMAT(startDate, "%Y-%m-%d") as startDate, DATE_FORMAT(endDate, "%Y-%m-%d") as endDate FROM projects WHERE userId = ? AND id = ?', [userId, projectId]);

    if (project.length > 0) {
      // Project found, return it in the response
      res.json(project[0]);
    } else {
      // Project not found or user does not have access
      res.status(404).json({ error: 'Project not found or user does not have access' });
    }
  } catch (error) {
    // Error handling for database query
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Error fetching project details' });
  }
});

// Delete a project
app.delete('/api/projects/:userId/:projectId', async (req, res) => {
  const { userId, projectId } = req.params;

  try {
    // Delete the project from the database
    const [result] = await db.promise().execute(
      'DELETE FROM projects WHERE userId = ? AND id = ?',
      [userId, projectId]
    );

    if (result.affectedRows > 0) {
      // Project deleted successfully
      res.status(200).json({ message: 'Project deleted successfully' });
    } else {
      // Project not found or user does not have access
      res.status(404).json({ error: 'Project not found or user does not have access' });
    }
  } catch (error) {
    // Error handling for database query
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Update a project
app.put('/api/projects/:userId/:projectId', async (req, res) => {
  const { userId, projectId } = req.params; // Get the user ID and project ID from the request parameters
  const { projectName, description, startDate, endDate } = req.body; // Get updated project details from the request body

  try {
    // Update the project in the database based on user ID and project ID
    const [result] = await db.promise().execute(
      'UPDATE projects SET projectName = ?, description = ?, startDate = ?, endDate = ? WHERE userId = ? AND id = ?',
      [projectName, description, startDate, endDate, userId, projectId]
    );

    if (result.affectedRows > 0) {
      // Project updated successfully
      res.status(200).json({ message: 'Project updated successfully' });
    } else {
      // Project not found or user does not have access
      res.status(404).json({ error: 'Project not found or user does not have access' });
    }
  } catch (error) {
    // Error handling for database query
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Error updating project' });
  }
});


// Add Task
app.post('/api/projects/:userId/:projectId/tasks', async (req, res) => {
  // Extract task data from request body
  const { taskName, description, startDate, endDate, priority, status, projectId, userId } = req.body;

  // Check if userId and projectId are provided
  if (!userId || !projectId) {
    return res.status(400).json({ error: 'User ID and Project ID are required' });
  }

  try {
    // Insert the task into the database
    const [result] = await db.promise().execute(
      'INSERT INTO tasks (taskName, description, startDate, endDate, priority, status, projectId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [taskName || null, description || null, startDate || null, endDate || null, priority || null, status || null, projectId, userId]
    );

    // Check if the task was successfully inserted
    if (result.affectedRows > 0) {
      // Respond with the newly created task details
      res.status(201).json({ id: result.insertId, taskName, description, startDate, endDate, priority, status, projectId, userId });
    } else {
      // If no rows were affected, indicate an error
      res.status(500).json({ error: 'Error creating task', details: 'No rows affected' });
    }
  } catch (error) {
    // Handle database or server errors
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task', details: error.message });
  }
});

// Edit Task
app.put('/api/projects/:userId/:projectId/tasks/:taskId', async (req, res) => {
  const { taskName, description, startDate, endDate, priority, status } = req.body;
  const { userId, projectId, taskId } = req.params;

  if (!userId || !projectId || !taskId) {
    return res.status(400).json({ error: 'User ID, Project ID, and Task ID are required' });
  }

  try {
    const [result] = await db.promise().execute(
      'UPDATE tasks SET taskName = ?, description = ?, startDate = ?, endDate = ?, priority = ?, status = ? WHERE id = ? AND projectId = ? AND userId = ?',
      [taskName || null, description || null, startDate || null, endDate || null, priority || null, status || null, taskId, projectId, userId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ error: 'Task not found or user does not have access' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task', details: error.message });
  }
});

// Get Task
app.get('/api/projects/:userId/:projectId/tasks/:taskId', async (req, res) => {
  const { userId, projectId, taskId } = req.params;

  if (!userId || !projectId || !taskId) {
    return res.status(400).json({ error: 'User ID, Project ID, and Task ID are required' });
  }

  try {
    const [task] = await db.promise().execute(
      'SELECT id, taskName, description, startDate, endDate, priority, status FROM tasks WHERE id = ? AND projectId = ? AND userId = ?',
      [taskId, projectId, userId]
    );

    if (task.length > 0) {
      // Format dates to "YYYY-MM-DD" format before sending in the response
      const formattedTask = {
        ...task[0],
        startDate: task[0].startDate ? task[0].startDate.toISOString().split('T')[0] : null,
        endDate: task[0].endDate ? task[0].endDate.toISOString().split('T')[0] : null,
      };
      res.status(200).json(formattedTask);
    } else {
      res.status(404).json({ error: 'Task not found or user does not have access' });
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Error fetching task', details: error.message });
  }
});

// Get All Tasks
app.get('/api/projects/:userId/:projectId/tasks', async (req, res) => {
  const { userId, projectId } = req.params;

  try {
    const [tasks] = await db.promise().execute('SELECT * FROM tasks WHERE projectId = ?', [projectId]);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Backend: Delete Task Endpoint
app.delete('/api/projects/:userId/:projectId/tasks/:taskId', async (req, res) => {
  const { userId, projectId, taskId } = req.params;

  if (!userId || !projectId || !taskId) {
    return res.status(400).json({ error: 'User ID, Project ID, and Task ID are required' });
  }

  try {
    const [result] = await db.promise().execute(
      'DELETE FROM tasks WHERE id = ? AND projectId = ? AND userId = ?',
      [taskId, projectId, userId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ error: 'Task not found or user does not have access' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task', details: error.message });
  }
});

// Backend: Fetch Project Progress
app.get('/api/projects/:userId/:projectId/progress', async (req, res) => {
  const { userId, projectId } = req.params;
  try {
    // Get the total number of tasks
    const [totalTasks] = await db.promise().execute('SELECT COUNT(*) AS total FROM tasks WHERE projectId = ? AND userId = ?', [projectId, userId]);

    // Get the number of completed tasks (assuming status is now "Complete")
    const [completedTasks] = await db.promise().execute('SELECT COUNT(*) AS completed FROM tasks WHERE projectId = ? AND userId = ? AND status = "Completed"', [projectId, userId]);

    if (totalTasks[0].total === 0) {
      res.json({ progress: 0 });
    } else {
      const progress = (completedTasks[0].completed / totalTasks[0].total) * 100;
      res.json({ progress });
    }
  } catch (error) {
    console.error('Error fetching project progress:', error);
    res.status(500).json({ error: 'Error fetching project progress', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
//test 2
