
// Code taken by chatgpt to make connection
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

const config = {
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=localhost\\SQLEXPRESS;Database=Resource Allocation System;Trusted_Connection=Yes;'
};

// POST: User Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE Username = @username');

    const user = result.recordset[0];

    if (!user || user.Password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Optional: return role for future use
    res.json({ message: 'Login successful', user: { id: user.Id, role: user.Role } });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});


// POST: Add new employee
app.post('/api/employees', async (req, res) => {
  const { name, role,phone,email } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('role', sql.NVarChar, role)
      .input('phone', sql.NVarChar, phone)
      .input('email', sql.NVarChar, email)
      .query('INSERT INTO Employee (Name, Role, Phone,Email) VALUES (@name, @role,@phone,@email)');

    res.status(201).json({ message: 'Employee added successfully' });
  } catch (err) {
    console.error(' Error inserting employee:', err);
    res.status(500).json({ error: 'Failed to insert employee' });
  }
});

//Get Employees to fill the data Table 
// GET: Fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT Id,Name, Role,Phone,Email FROM Employee');
    res.json(result.recordset); // return array of employees
  } catch (err) {
    console.error('❌ Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// PUT: Update employee
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, phone, email } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('role', sql.NVarChar, role)
      .input('phone', sql.NVarChar, phone)
      .input('email', sql.NVarChar, email)
      .query(`
        UPDATE Employee
        SET Name = @name, Role = @role, Phone = @phone, Email = @email
        WHERE Id = @id
      `);

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('❌ Error updating employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE: Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Employee WHERE Id = @id');

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});


//Here is the Work for Projects Related Api

// ➕ Add Project
app.post('/api/projects', async (req, res) => {
  const { projectName, client, startDate, endDate, status } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('projectName', sql.NVarChar, projectName)
      .input('client', sql.NVarChar, client)
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .input('status', sql.NVarChar, status)
      .query(`
        INSERT INTO Project (ProjectName, Client, StartDate, EndDate, Status)
        VALUES (@projectName, @client, @startDate, @endDate, @status)
      `);

    res.status(201).json({ message: 'Project added successfully' });
  } catch (err) {
    console.error('Error adding project:', err);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// 📥 Get All Projects
app.get('/api/projects', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM Project');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Update Project
app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { projectName, client, startDate, endDate, status } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .input('projectName', sql.NVarChar, projectName)
      .input('client', sql.NVarChar, client)
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE Project
        SET ProjectName = @projectName, Client = @client,
            StartDate = @startDate, EndDate = @endDate, Status = @status
        WHERE Id = @id
      `);

    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

//  Delete Project
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Project WHERE Id = @id');

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});



// Serve employee.html manually first
app.get('/', (req, res) => {
  console.log('📄 Serving employee.html');
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// Then serve other static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
