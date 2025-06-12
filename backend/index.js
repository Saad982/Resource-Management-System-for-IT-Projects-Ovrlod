const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
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
    console.error('❌ Error inserting employee:', err);
    res.status(500).json({ error: 'Failed to insert employee' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
