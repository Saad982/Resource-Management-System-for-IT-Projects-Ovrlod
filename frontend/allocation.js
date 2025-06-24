document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
 

  
});

async function loadEmployees() {
  const res = await fetch('/api/employees');
  const employees = await res.json();
  const employeeSelect = document.getElementById('employee');
  employeeSelect.innerHTML = employees.map(e => `<option value="${e.Id}">${e.Name}</option>`).join('');
}