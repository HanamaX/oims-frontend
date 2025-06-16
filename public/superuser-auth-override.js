// Set superuser authentication in localStorage on load
// This script ensures that the superuser button is always visible and functional

(function() {
  if (typeof window !== 'undefined') {
    // Set superuser authentication to true
    localStorage.setItem('superuser_auth', 'true');
    
    // Log the action
    console.log('Superuser authentication override enabled');
  }
})();
