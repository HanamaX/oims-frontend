// Debug script to check if the sidebar-green-theme class is applied
console.log('Debug script running');window.addEventListener('DOMContentLoaded', () => {setInterval(() => {const sidebar = document.querySelector('.dashboard-sidebar');if (sidebar) {console.log('Sidebar classes:', sidebar.className);console.log('Sidebar style:', sidebar.getAttribute('style'));}}, 2000);});
