document.addEventListener('DOMContentLoaded', () => {
  const targetDateInput = document.getElementById('targetDate');
  const freeList = document.getElementById('freeList');
  const partialList = document.getElementById('partialList');
  const fullList = document.getElementById('fullList');

  targetDateInput.addEventListener('change', () => {
    const selectedDate = targetDateInput.value;
    if (selectedDate) {
      console.log('Date Selected');
    }
  });

  
});
