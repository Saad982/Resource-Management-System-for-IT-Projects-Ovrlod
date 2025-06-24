document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  loadProjects();

  
});

async function loadEmployees() {
  const res = await fetch('/api/employees');
  const employees = await res.json();
  const employeeSelect = document.getElementById('employee');
  employeeSelect.innerHTML = employees.map(e => `<option value="${e.Id}">${e.Name}</option>`).join('');
}
async function loadProjects() {
  const res = await fetch('/api/projects');
  const projects = await res.json();
  const projectSelect = document.getElementById('project');
  projectSelect.innerHTML = projects.map(p => `<option value="${p.Id}">${p.ProjectName}</option>`).join('');
}