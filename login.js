document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Fetch users.json
        fetch('users.json')
            .then(response => response.json())
            .then(data => {
                const users = data.users;
                const foundUser = users.find(user => user.username === username && user.password === password);
                
                if (foundUser) {
                    // If user found, redirect to index.html
                    window.location.href = 'index.html';
                } else {
                    // If user not found or password is incorrect, display an error message
                    alert('Invalid username or password.');
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    });
});
