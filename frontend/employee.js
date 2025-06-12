document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('employeeForm');
  const nameInput = document.getElementById('name');
  const roleInput = document.getElementById('role');
  const tableBody = document.getElementById('employeeTableBody');

  // Load existing employees on page load
  fetchEmployees();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const role = roleInput.value.trim();

    if (!name || !role) return;

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role })
      });

      const data = await res.json();

      if (res.ok) {
        nameInput.value = '';
        roleInput.value = '';
        fetchEmployees(); // Reload table
      } else {
        alert(data.error || 'Failed to add employee');
      }
    } catch (err) {
      console.error('❌ Error:', err);
    }
  });

  async function fetchEmployees() {
    try {
      const res = await fetch('/api/employees');
      const employees = await res.json();

      tableBody.innerHTML = ''; // Clear existing rows

      employees.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${emp.Name}</td><td>${emp.Role}</td>`;
        tableBody.appendChild(row);
      });
    } catch (err) {
      console.error('❌ Error loading employees:', err);
    }
  }
});
