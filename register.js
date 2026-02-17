document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message');
    
    if (password !== confirmPassword) {
        messageDiv.className = 'error-message';
        messageDiv.textContent = 'Passwords do not match';
        return;
    }
    
    const userData = {
        email: document.getElementById('email').value,
        password: password,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value || undefined
    };
    
    try {
        await CustomerAuth.register(userData);
        
        messageDiv.className = 'success-message';
        messageDiv.textContent = 'Registration successful! Redirecting to account...';
        
        setTimeout(() => {
            window.location.href = '/account.html';
        }, 1500);
    } catch (error) {
        messageDiv.className = 'error-message';
        messageDiv.textContent = error.message || 'Registration failed. Please try again.';
    }
});

// Redirect if already logged in
if (CustomerAuth.isAuthenticated()) {
    window.location.href = '/account.html';
}
