document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  loadProjects();
  loadAllocations();

  document.getElementById('allocationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const allocation = {
      employeeId: document.getElementById('employee').value,
      projectId: document.getElementById('project').value,
      role: document.getElementById('role').value,
      startDate: document.getElementById('startDate').value,
      endDate: document.getElementById('endDate').value,
      allocationPercentage: document.getElementById('percentage').value
    };

    try {
      const res = await fetch('/api/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocation)
      });

      const data = await res.json();

      if (res.ok) {
        loadAllocations();
        e.target.reset();
      } else {
        alert(data.error || 'Error allocating resource.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  });
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

async function loadAllocations() {
  const res = await fetch('/api/allocations');
  const allocations = await res.json();
  const tbody = document.getElementById('allocationTableBody');

  tbody.innerHTML = allocations.map(a => `
    <tr>
      <td>${a.EmployeeName}</td>
      <td>${a.ProjectName}</td>
      <td>${a.Role}</td>
      <td>${a.StartDate.slice(0, 10)}</td>
      <td>${a.EndDate.slice(0, 10)}</td>
      <td>${a.AllocationPercentage}%</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteAllocation(${a.Id})">Delete</button>
      </td>
    </tr>
  `).join('');
}


