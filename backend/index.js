
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

// POST: Add new employee
app.post('/api/employees', async (req, res) => {
  const { name, role } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('role', sql.NVarChar, role)
      .query('INSERT INTO Employee (Name, Role) VALUES (@name, @role)');

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
    const result = await pool.request().query('SELECT Name, Role FROM Employee');
    res.json(result.recordset); // return array of employees
  } catch (err) {
    console.error(' Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});


// Serve employee.html manually first
app.get('/', (req, res) => {
  console.log(' Serving employee.html');
  res.sendFile(path.join(__dirname, '../frontend/employee.html'));
});

// Then serve other static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Start server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
