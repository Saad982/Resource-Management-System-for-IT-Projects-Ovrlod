document.addEventListener('DOMContentLoaded', () => {
  const checkDateInput = document.getElementById('checkDate');
  const resultDiv = document.getElementById('result');

  checkDateInput.addEventListener('change', async () => {
    const selectedDate = checkDateInput.value;
    if (!selectedDate) return;

    const formattedDate = new Date(selectedDate);
    formattedDate.setHours(0, 0, 0, 0); // Normalize to start of day

    try {
      const [empRes, allocRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/allocations')
      ]);

      const employees = await empRes.json();
      const allocations = await allocRes.json();

      const availability = employees.map(emp => {
        const relevantAllocations = allocations.filter(allocation => {
          const start = new Date(allocation.StartDate);
          const end = new Date(allocation.EndDate);

          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);

          return allocation.EmployeeId === emp.Id &&
                 formattedDate >= start &&
                 formattedDate <= end;
        });

        const totalPercentage = relevantAllocations.reduce((sum, a) => {
          return sum + (parseInt(a.AllocationPercentage) || 0);
        }, 0);

        return {
          name: emp.Name,
          percentage: totalPercentage
        };
      });

      // Grouping
      const free = availability.filter(e => e.percentage === 0);
      const partial = availability.filter(e => e.percentage > 0 && e.percentage < 100);
      const full = availability.filter(e => e.percentage >= 100);

      resultDiv.innerHTML = `
        <h5 class="text-success">Free (0%)</h5>
        <ul>${free.length ? free.map(e => `<li>${e.name} - 0%</li>`).join('') : '<li>None</li>'}</ul>

        <h5 class="text-warning">Partially Allocated (1–99%)</h5>
        <ul>${partial.length ? partial.map(e => `<li>${e.name} - ${e.percentage}%</li>`).join('') : '<li>None</li>'}</ul>

        <h5 class="text-danger">Fully Allocated (100%+)</h5>
        <ul>${full.length ? full.map(e => `<li>${e.name} - ${e.percentage}%</li>`).join('') : '<li>None</li>'}</ul>
      `;
    } catch (err) {
      console.error('Availability fetch error:', err);
      resultDiv.innerHTML = `<div class="alert alert-danger">Error loading availability</div>`;
    }
  });
});
