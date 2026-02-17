// Require authentication
if (!CustomerAuth.requireAuth()) {
    throw new Error('Authentication required');
}

// Load profile information
async function loadProfile() {
    try {
        const user = await CustomerAuth.getCurrentUser();
        const profileDiv = document.getElementById('profileInfo');
        
        profileDiv.innerHTML = `
            <p><strong>Name:</strong> ${user.first_name || ''} ${user.last_name || ''}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
        `;
    } catch (error) {
        document.getElementById('profileInfo').innerHTML = '<p>Failed to load profile</p>';
    }
}

// Load order summary
async function loadOrderSummary() {
    try {
        const { orders } = await CustomerAuth.getOrders();
        const orderDiv = document.getElementById('orderSummary');
        
        if (orders && orders.length > 0) {
            orderDiv.innerHTML = `
                <p><strong>Total Orders:</strong> ${orders.length}</p>
                <p><strong>Recent Order:</strong> ${new Date(orders[0].created_at).toLocaleDateString()}</p>
            `;
        } else {
            orderDiv.innerHTML = '<p>No orders yet</p>';
        }
    } catch (error) {
        document.getElementById('orderSummary').innerHTML = '<p>Failed to load orders</p>';
    }
}

// Initialize
loadProfile();
loadOrderSummary();
