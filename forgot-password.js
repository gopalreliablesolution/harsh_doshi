document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        const result = await CustomerAuth.requestPasswordReset(email);
        messageDiv.className = 'success-message';
        messageDiv.textContent = 'If an account exists with this email, you will receive a password reset link shortly.';
        document.getElementById('email').value = '';
    } catch (error) {
        messageDiv.className = 'error-message';
        messageDiv.textContent = 'Failed to send reset link. Please try again.';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
    }
});
