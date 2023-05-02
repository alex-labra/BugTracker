const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
});
app.use(async (req, res, next) => {
  req.db = pool;
  await next();
});

// Set up JWT secret key
const JWT_SECRET = process.env.JWT_KEY;

// Endpoint for user login and token authentication
app.post('/api/authenticate', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  try {
    // Check if user exists in database
    const [results] = await req.db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(401).send('Authentication failed. User not found.');
    }

    const user = results[0];
    if (password !== user.password) {
      return res.status(401).send('Authentication failed. Wrong password.');
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '12h' });

    // Send token to client
    res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

//user registration
app.post('/api/register', async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required.');
  }

  try {
    // Check if user already exists in database
    const [existingUser] = await req.db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).send('User with this email already exists.');
    }

    // Insert the user's data into the database
    const [results] = await req.db.query(
      'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
      [email, password, userType],
    );

    if (results.affectedRows === 1) {
      return res.status(201).json({ registration: true });
    } else {
      throw new Error('Failed to register user.');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

//api to update issues
app.put('/api/issues', async (req, res) => {
  const issue_id = req.body.issue_id;
  const priority = req.body.priority;
  const status = req.body.status;
  console.log('called')
  try {
    // Update status and priority of the issue with the given id
    await req.db.query('UPDATE issues SET status = ?, priority = ? WHERE issue_id = ?', [status, priority, issue_id]);

    res.status(200).send('Issue updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// API endpoint to create a new issue
app.post('/api/issues', async (req, res) => {
  const project_name = req.body.project_name;
  const reportedByEmail = req.body.email;
  const assignedTo = req.body.assignedPersonEMail;
  try {
    // Fetch project id
    const [projectResult] = await req.db.query('SELECT project_id FROM projects WHERE project_name = ?', project_name);
    const projectId = projectResult[0].project_id;
    // Fetch reported by id
    const [reportedResult] = await req.db.query('SELECT user_id FROM users WHERE email = ?', reportedByEmail);
    const reportedById = reportedResult[0].user_id;
    // Fetch assigned to id(s)
    let assignedToIds;
    if (Array.isArray(assignedTo)) {
      const query = `SELECT user_id FROM users WHERE email IN (${assignedTo.map(() => '?').join(',')})`;
      const [assignedResult] = await req.db.query(query, assignedTo);
      assignedToIds = assignedResult.map((row) => row.user_id);
    } else {
      const [assignedResult] = await req.db.query('SELECT user_id FROM users WHERE email = ?', assignedTo);
      assignedToIds = [assignedResult[0].user_id];
    }
    // Fetch created_date (if exists)
    const [dateResult] = await req.db.query('SELECT created_date FROM issues WHERE project_id = ?', projectId);
    const createdDate = dateResult.length > 0 ? dateResult[0].created_date : new Date();
    // Insert new issue into the database
    const issue = {
      project_id: projectId,
      issue_title: req.body.issue_title,
      issue_description: req.body.issue_description,
      reported_by: reportedById,
      assigned_to: assignedToIds.join(','),
      status: req.body.status,
      priority: req.body.priority,
      created_date: createdDate,
      updated_date: new Date(),
    };
    const [result] = await req.db.query('INSERT INTO issues SET ?', issue);
    const issue_id = result.insertId;

    res.status(201).json({ issue_id, msg: 'This is your issue ID' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// API endpoint to create a new project (only for administrators)
app.post('/api/projects', async (req, res) => {
  const userEmail = req.body.email;
  try {
    // Fetch user_id from the database
    const [userResult] = await req.db.query('SELECT user_id FROM users WHERE email = ?', userEmail);
    const userId = userResult[0].user_id;
    // Check if user is an administrator
    const [adminResult] = await req.db.query('SELECT user_type FROM users WHERE user_id = ?', userId);
    const userType = adminResult[0].user_type;
    if (userType !== 'administrator') {
      res.status(401).send('Unauthorized');
      return;
    }
    // Insert new project into the database
    const project = {
      project_name: req.body.project_name,
      project_description: req.body.project_description,
      created_by: userId,
      created_date: new Date()
    };
    const [result] = await req.db.query('INSERT INTO projects SET ?', project);
    const project_id = result.insertId;
    // Assign users to the project (if any)
    if (req.body.users && Array.isArray(req.body.users)) {
      // Get user_ids for the users to be assigned to the project
      const [users] = await req.db.query('SELECT user_id FROM users WHERE email IN (?)', [req.body.users]);
      const user_ids = users.map(user => user.user_id);
      // Insert records into project_users table
      const values = user_ids.map(user_id => [project_id, user_id]);
      await req.db.query('INSERT INTO project_users (project_id, user_id) VALUES ?', [values]);
    }
    res.status(201).json({ project_id, msg: 'This is your project ID' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//Retrieve user type
app.get('/api/user', authenticateToken, async (req, res) => {
  const userEmail = req.query.email;
  try {
    // Fetch user_type from the database
    const [userResult] = await req.db.query('SELECT user_type FROM users WHERE email = ?', userEmail);
    const userType = userResult[0].user_type;
    res.json(userType);
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// API endpoint to get a list of projects (programmers can only see their assigned projects)
app.get('/api/projects', authenticateToken, async (req, res) => {
  const userEmail = req.query.email;
  try {
    // Fetch user_id from the database
    const [userResult] = await req.db.query('SELECT user_id, user_type FROM users WHERE email = ?', userEmail);
    const userId = userResult[0].user_id;
    const userType = userResult[0].user_type;
    if (userType === 'administrator') {
      // Get projects created by or assigned to the administrator and their related issues
      const [results] = await req.db.query('SELECT p.project_id AS project_id, i.issue_id AS issue_id, p.project_name AS project_name, p.project_description AS project_description, p.created_by AS created_by, p.created_date AS created_date, i.issue_title AS issue_title, i.issue_description AS issue_description, i.reported_by AS reported_by, i.status AS status, i.priority AS priority, i.updated_date AS updated_date, i.assigned_to AS assigned_to FROM projects p LEFT JOIN issues i ON p.project_id = i.project_id WHERE p.created_by = ? OR p.project_id IN (SELECT pu.project_id FROM project_users pu WHERE pu.user_id = ?)', [userId, userId]);
      const projects = {};
      results.forEach(row => {
        const projectId = row.project_id;
        if (!projects[projectId]) {
          projects[projectId] = {
            project_id: projectId,
            project_name: row.project_name,
            project_description: row.project_description,
            created_by: row.created_by,
            created_date: row.created_date,
            issues: []
          };
        }
        const issueId = row.issue_id;
        if (issueId) {
          projects[projectId].issues.push({
            issue_id: issueId,
            issue_title: row.issue_title,
            issue_description: row.issue_description,
            reported_by: row.reported_by,
            status: row.status,
            priority: row.priority,
            created_date: row.created_date,
            updated_date: row.updated_date,
            assigned_to: row.assigned_to
          });
        }
      });
      res.json(Object.values(projects));
    } else if (userType === 'programmer') {
      // Get projects assigned to the user and their related issues
      const [results] = await req.db.query('SELECT p.project_id AS project_id, i.issue_id AS issue_id, p.project_name AS project_name, p.project_description AS project_description, p.created_by AS created_by, p.created_date AS created_date, i.issue_title AS issue_title, i.issue_description AS issue_description, i.reported_by AS reported_by, i.status AS status, i.priority AS priority, i.updated_date AS updated_date, i.assigned_to AS assigned_to FROM projects p INNER JOIN project_users pu ON p.project_id = pu.project_id LEFT JOIN issues i ON p.project_id = i.project_id WHERE pu.user_id = ?', userId);
      const projects = {};
      results.forEach(row => {
        const projectId = row.project_id;
        if (!projects[projectId]) {
          projects[projectId] = {
            project_id: projectId,
            project_name: row.project_name,
            project_description: row.project_description,
            created_by: row.created_by,
            created_date: row.created_date,
            issues: []
          };
        }
        const issueId = row.issue_id;
        if (issueId) {
          projects[projectId].issues.push({
            issue_id: issueId,
            issue_title: row.issue_title,
            issue_description: row.issue_description,
            reported_by: row.reported_by,
            status: row.status,
            priority: row.priority,
            created_date: row.created_date,
            updated_date: row.updated_date,
            assigned_to: row.assigned_to
          });
        }
      });
      res.json(Object.values(projects));
    } else {
      res.status(400).send(`Invalid user_type value: ${userType}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.delete('/api/projects', async (req, res) => {
  const userEmail = req.query.email;
  const projectName = req.query.projectName;
  try {
    // Fetch user_id from the database
    const [userResult] = await req.db.query('SELECT user_id FROM users WHERE email = ?', userEmail);
    const userId = userResult[0].user_id;
    // Check if user is an administrator
    const [adminResult] = await req.db.query('SELECT user_type FROM users WHERE user_id = ?', userId);
    const userType = adminResult[0].user_type;
    if (userType !== 'administrator') {
      res.status(401).send('Unauthorized');
      return;
    }
    // Fetch project_id from the database
    const [projectResult] = await req.db.query('SELECT project_id FROM projects WHERE project_name = ?', projectName);
    const projectId = projectResult[0].project_id;
    // Delete project from the database
    await req.db.query('DELETE FROM projects WHERE project_id = ?', projectId);
    // Delete all issues associated with the project from the database   NOTE: fixed with DELETE ON CASCADE
    // await global.db.query('DELETE FROM issues WHERE project_id = ?', projectId);
    res.status(200).json({ msg: 'Project and associated issues have been deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// Endpoint for protected resource
app.get('/api/resource', authenticateToken, (req, res) => {
  res.send('You have access to the protected resource!');
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).send('Authentication token is missing.');
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).send('Authentication token is invalid.');
    }
    req.user = user;
    next();
  });
}

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});