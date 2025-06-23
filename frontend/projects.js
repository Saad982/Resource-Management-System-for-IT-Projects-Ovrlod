// projects.js

const projectForm = document.getElementById('projectForm');
const projectIdInput = document.getElementById('projectId');
const projectNameInput = document.getElementById('projectName');
const clientInput = document.getElementById('client');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const statusSelect = document.getElementById('status');
const cancelBtn = document.getElementById('cancelBtn');
const projectTableBody = document.getElementById('projectTableBody');

const apiUrl = '/api/projects';

// Fetch and display all projects
async function loadProjects() {
  try {
    const res = await fetch(apiUrl);
    const projects = await res.json();

    projectTableBody.innerHTML = '';

    projects.forEach(project => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${project.ProjectName}</td>
        <td>${project.Client}</td>
        <td>${new Date(project.StartDate).toLocaleDateString()}</td>
        <td>${new Date(project.EndDate).toLocaleDateString()}</td>
        <td>${project.Status}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${project.Id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${project.Id}">Delete</button>
        </td>
      `;

      projectTableBody.appendChild(tr);
    });
  } catch (error) {
    alert('Failed to load projects');
    console.error(error);
  }
}

// Reset form
function resetForm() {
  projectIdInput.value = '';
  projectForm.reset();
  cancelBtn.style.display = 'none';
}

// Handle form submit (add or update)
projectForm.addEventListener('submit', async e => {
  e.preventDefault();

  const projectData = {
    projectName: projectNameInput.value.trim(),
    client: clientInput.value.trim(),
    startDate: startDateInput.value,
    endDate: endDateInput.value,
    status: statusSelect.value,
  };

  try {
    if (projectIdInput.value) {
      // Update existing project
      const id = projectIdInput.value;

      const res = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) throw new Error('Update failed');
      alert('Project updated successfully');
    } else {
      // Add new project
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) throw new Error('Add failed');
      alert('Project added successfully');
    }

    resetForm();
    loadProjects();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

// Handle click events on table for Edit and Delete
projectTableBody.addEventListener('click', async e => {
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.dataset.id;

    try {
      const res = await fetch(`${apiUrl}/${id}`);
      if (!res.ok) throw new Error('Failed to fetch project details');
      const project = await res.json();

      projectIdInput.value = project.Id;
      projectNameInput.value = project.ProjectName;
      clientInput.value = project.Client;
      startDateInput.value = project.StartDate.split('T')[0]; // format YYYY-MM-DD
      endDateInput.value = project.EndDate.split('T')[0];
      statusSelect.value = project.Status;

      cancelBtn.style.display = 'inline-block';
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }

  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.dataset.id;

    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');

        alert('Project deleted successfully');
        loadProjects();
      } catch (error) {
        alert(error.message);
        console.error(error);
      }
    }
  }
});

// Cancel editing
cancelBtn.addEventListener('click', () => {
  resetForm();
});

// Initial load
loadProjects();
