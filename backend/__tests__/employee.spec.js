const request = require('supertest');
const app = require('../index'); // importing from backend/index.js

describe('POST /api/employees', () => {
  it('should add a new employee and return 201', async () => {
    const newEmployee = {
      name: 'Test User',
      role: 'Tester',
      phone: '1234567890',
      email: 'test@example.com'
    };

    const res = await request(app)
      .post('/api/employees')
      .send(newEmployee);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Employee added successfully');
  });
 // New GET test for fetching employees
  describe('GET /api/employees', () => {
    it('should fetch all employees and return 200 with an array', async () => {
      const res = await request(app).get('/api/employees');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty('Id');
        expect(res.body[0]).toHaveProperty('Name');
        expect(res.body[0]).toHaveProperty('Role');
        expect(res.body[0]).toHaveProperty('Phone');
        expect(res.body[0]).toHaveProperty('Email');
      }
    });
  });
});


