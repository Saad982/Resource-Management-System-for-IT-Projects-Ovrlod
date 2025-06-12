document.getElementById('employeeForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const role = document.getElementById('role').value.trim();

  try {
    const response = await fetch('http://localhost:3000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role })
    });

    if (!response.ok) throw new Error('Failed to add employee');

    alert('✅ Employee added successfully');
    document.getElementById('employeeForm').reset();
  } catch (err) {
    alert('❌ Error: ' + err.message);
  }
});
