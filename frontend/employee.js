document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('employeeForm');
  const nameInput = document.getElementById('name');
  const roleInput = document.getElementById('role');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const tableBody = document.getElementById('employeeTableBody');

  // Load existing employees on page load
  fetchEmployees();

  form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('employeeId').value;
  const name = nameInput.value.trim();
  const role = roleInput.value.trim();
  const phone = phoneInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !role) return;

  const payload = { name, role, phone, email };

  try {
    let res, data;

    if (id) {
      // 🔁 Update existing employee
      res = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      data = await res.json();
    } else {
      // ➕ Add new employee
      res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      data = await res.json();
    }

    if (res.ok) {
      // Reset form
      form.reset();
      document.getElementById('employeeId').value = '';
      document.getElementById('submitBtn').textContent = 'Add Employee';
      document.getElementById('cancelBtn').style.display = 'none';
      fetchEmployees();
      alert(id ? 'Employee updated successfully' : 'Employee added successfully');
    } else {
      alert(data.error || 'Operation failed');
    }
  } catch (err) {
    console.error('Error:', err);
  }
});


  async function fetchEmployees() {
    try {
      const res = await fetch('/api/employees');
      const employees = await res.json();

      tableBody.innerHTML = ''; // Clear existing rows

      employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${emp.Name}</td><td>${emp.Role}</td><td>${emp.Phone}</td><td>${emp.Email}</td> <td>
      <button class="btn btn-sm btn-warning edit-btn" data-id="${emp.Id}">Edit</button><button class="btn btn-sm btn-danger delete-btn ml-5" data-id="${emp.Id}">Delete</button>
    </td>`;
        tableBody.appendChild(row);
      });
    
    //Adding edit button logic
      document.querySelectorAll('.edit-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const id = button.getAttribute('data-id');

    // Fetch employee by ID (optional if already in JS)
    const employee = employees.find(emp => emp.Id == id);
    if (!employee) return;

    // Populate form
    document.getElementById('employeeId').value = employee.Id;
    nameInput.value = employee.Name;
    roleInput.value = employee.Role;
    phoneInput.value = employee.Phone;
    emailInput.value = employee.Email;

    // Change button to Update
    document.getElementById('submitBtn').textContent = 'Update Employee';
    document.getElementById('cancelBtn').style.display = 'inline-block';
  });
});
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  }
});

//ADding Delete Functionality for employee to delete 
document.querySelectorAll('.delete-btn').forEach(button => {
  button.addEventListener('click', async () => {
    const id = button.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        const res = await fetch(`/api/employees/${id}`, {
          method: 'DELETE'
        });

        if (res.ok) {
          fetchEmployees(); // Refresh table
          alert('Employee deleted successfully');
        } else {
          alert('Failed to delete employee');
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  });
});
