let editingId = null;

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

    const url = editingId ? `/api/allocations/${editingId}` : '/api/allocations';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocation)
      });

      const data = await res.json();

      if (res.ok) {
        loadAllocations();
        e.target.reset();
        editingId = null;
        document.getElementById('submitBtn').textContent = 'Add Allocation';
      } else {
        alert(data.error || 'Error saving allocation.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  });
});

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
        <button class="btn btn-sm btn-warning" onclick="editAllocation(${a.Id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteAllocation(${a.Id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteAllocation(id) {
  if (confirm('Are you sure you want to delete this allocation?')) {
    await fetch(`/api/allocations/${id}`, { method: 'DELETE' });
    loadAllocations();
  }
}

async function editAllocation(id) {
  const res = await fetch(`/api/allocations/${id}`);
  const data = await res.json();

  document.getElementById('employee').value = data.EmployeeId;
  document.getElementById('project').value = data.ProjectId;
  document.getElementById('role').value = data.Role;
  document.getElementById('startDate').value = data.StartDate.slice(0, 10);
  document.getElementById('endDate').value = data.EndDate.slice(0, 10);
  document.getElementById('percentage').value = data.AllocationPercentage;

  editingId = id;
  document.getElementById('submitBtn').textContent = 'Update Allocation';
}
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