// Try to find the issue by checking the localStorage and navigation in RoleDashboard
localStorage.getItem('accessToken') ? console.log('Token exists:', localStorage.getItem('accessToken').substring(0, 10) + '...') : console.log('No token found');

// Check location matching 
const testPaths = ['/rider/history', '/rider/details-history/123'];
console.log('Testing path matching:');
testPaths.forEach(path => {
  const includesHistory = path.includes('history');
  const includesDetails = path.includes('details');
  console.log(Path: , includes history: , includes details: );
});

// Try to fix location detection in RoleDashboard
