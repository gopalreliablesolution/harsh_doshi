const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (!token) {
    document.getElementById('message').className = 'error-message';
    document.getElementById('message').textContent = 'Invalid or missing reset token';
    document.getElementById('resetPasswordForm').style.display = 'none';
}

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message');
    
    if (password !== confirmPassword) {
        messageDiv.className = 'error-message';
        messageDiv.textContent = 'Passwords do not match';
        return;
    }
    
    try {
        const result = await CustomerAuth.confirmPasswordReset(token, password);
        messageDiv.className = 'success-message';
        messageDiv.textContent = 'Password reset successful! Redirecting to login...';
        
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    } catch (error) {
        messageDiv.className = 'error-message';
        messageDiv.textContent = 'Failed to reset password. The link may have expired.';
    }
});
