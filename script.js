document.addEventListener('DOMContentLoaded', () => {
  const copyButtons = document.querySelectorAll('.btn-copy');
  const toast = document.getElementById('toast');
  let toastTimeout;

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const url = button.getAttribute('data-url');
      if (!url) return;

      try {
        // Copy to clipboard
        await navigator.clipboard.writeText(url);

        // Visual feedback on the button
        const originalHtml = button.innerHTML;
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Đã chép!
        `;
        button.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
        button.style.color = '#10b981';

        // Revert button styling after 1.5 seconds
        setTimeout(() => {
          button.innerHTML = originalHtml;
          button.style.backgroundColor = '';
          button.style.color = '';
        }, 1500);

        // Show Toast Notification
        showToast();
      } catch (err) {
        console.error('Không thể sao chép liên kết:', err);
      }
    });
  });

  function showToast() {
    // Clear any active toast timeouts
    clearTimeout(toastTimeout);
    
    // Reset toast state
    toast.classList.remove('show');
    
    // Force a reflow to restart transition
    void toast.offsetWidth;
    
    // Show toast
    toast.classList.add('show');

    // Hide toast after 2.5 seconds
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }
});
