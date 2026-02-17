document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    
    try {
        await CustomerAuth.login(email, password);
        messageDiv.className = 'success-message';
        messageDiv.textContent = 'Login successful! Redirecting...';
        
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/account.html';
        
        setTimeout(() => {
            window.location.href = redirect;
        }, 1000);
    } catch (error) {
        messageDiv.className = 'error-message';
        messageDiv.textContent = 'Invalid email or password';
    }
});

// Redirect if already logged in
if (CustomerAuth.isAuthenticated()) {
    window.location.href = '/account.html';
}
