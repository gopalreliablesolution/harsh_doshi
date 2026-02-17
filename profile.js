// Require authentication
if (!CustomerAuth.requireAuth()) {
    throw new Error('Authentication required');
}

// Load current profile
async function loadProfile() {
    try {
        const user = await CustomerAuth.getCurrentUser();
        document.getElementById('firstName').value = user.first_name || '';
        document.getElementById('lastName').value = user.last_name || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
    } catch (error) {
        document.getElementById('message').className = 'error-message';
        document.getElementById('message').textContent = 'Failed to load profile';
    }
}

// Handle form submission
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('message');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    const profileData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value
    };
    
    try {
        await CustomerAuth.updateProfile(profileData);
        messageDiv.className = 'success-message';
        messageDiv.textContent = 'Profile updated successfully!';
        
        setTimeout(() => {
            window.location.href = 'account.html';
        }, 1500);
    } catch (error) {
        messageDiv.className = 'error-message';
        messageDiv.textContent = 'Failed to update profile';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
    }
});

// Initialize
loadProfile();
