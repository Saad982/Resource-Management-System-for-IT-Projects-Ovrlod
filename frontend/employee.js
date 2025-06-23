document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('projectForm');
  const projectIdInput = document.getElementById('projectId');
  const projectNameInput = document.getElementById('projectName');
  const clientInput = document.getElementById('client');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const statusSelect = document.getElementById('status');
  const cancelBtn = document.getElementById('cancelBtn');
  const tableBody = document.getElementById('projectTableBody');
  const submitBtn = form.querySelector('button[type="submit"]');

  const apiUrl = '/api/projects';

  // Load projects and render
  async function fetchProjects() {
    try {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to load projects');
      const projects = await res.json();

      tableBody.innerHTML = '';

      projects.forEach(project => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${project.ProjectName}</td>
          <td>${project.Client}</td>
          <td>${new Date(project.StartDate).toLocaleDateString()}</td>
          <td>${new Date(project.EndDate).toLocaleDateString()}</td>
          <td>${project.Status}</td>
          <td>
            <button class="btn btn-sm btn-primary edit-btn me-2" data-id="${project.Id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${project.Id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      // Attach event listeners for Edit buttons
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          // Find project from the already fetched list to avoid extra API call
          const project = projects.find(p => p.Id == id);
          if (!project) return;

          projectIdInput.value = project.Id;
          projectNameInput.value = project.ProjectName;
          clientInput.value = project.Client;
          startDateInput.value = project.StartDate.split('T')[0];
          endDateInput.value = project.EndDate.split('T')[0];
          statusSelect.value = project.Status;

          submitBtn.textContent = 'Update Project';
          cancelBtn.style.display = 'inline-block';
        });
      });

      // Attach event listeners for Delete buttons
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-id');
          if (confirm('Are you sure you want to delete this project?')) {
            try {
              const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
              if (!res.ok) throw new Error('Delete failed');
              alert('Project deleted successfully');
              fetchProjects();
            } catch (err) {
              alert(err.message);
              console.error(err);
            }
          }
        });
      });

    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  }

  // Reset form
  function resetForm() {
    projectIdInput.value = '';
    form.reset();
    submitBtn.textContent = 'Add Project';
    cancelBtn.style.display = 'none';
  }

  // Form submit handler (Add or Update)
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const projectData = {
      projectName: projectNameInput.value.trim(),
      client: clientInput.value.trim(),
      startDate: startDateInput.value,
      endDate: endDateInput.value,
      status: statusSelect.value,
    };

    try {
      let res;
      if (projectIdInput.value) {
        // Update existing
        res = await fetch(`${apiUrl}/${projectIdInput.value}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
      } else {
        // Add new
        res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Operation failed');
      }

      alert(projectIdInput.value ? 'Project updated successfully' : 'Project added successfully');
      resetForm();
      fetchProjects();
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  });

  // Cancel button handler
  cancelBtn.addEventListener('click', () => {
    resetForm();
  });

  // Initial fetch
  fetchProjects();
});
