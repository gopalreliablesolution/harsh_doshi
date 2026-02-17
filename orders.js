// Require authentication
if (!CustomerAuth.requireAuth()) {
    throw new Error('Authentication required');
}

// Format currency
function formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency
    }).format(amount / 100);
}

// Get status class
function getStatusClass(status) {
    return status === 'completed' ? 'status-completed' : 'status-pending';
}

// Load orders
async function loadOrders() {
    try {
        const { orders } = await CustomerAuth.getOrders();
        const ordersDiv = document.getElementById('ordersList');
        
        if (!orders || orders.length === 0) {
            ordersDiv.innerHTML = `
                <div class="no-orders">
                    <h2>No orders yet</h2>
                    <p>Start shopping to see your orders here</p>
                    <a href="shop.html" class="btn-view">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        ordersDiv.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.display_id || order.id.slice(0, 8)}</div>
                        <div style="color: #666; font-size: 14px;">
                            ${new Date(order.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                    <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
                </div>
                
                <div class="order-items">
                    ${order.items?.slice(0, 3).map(item => `
                        <div class="order-item">
                            <span>${item.title} × ${item.quantity}</span>
                            <span>${formatCurrency(item.unit_price * item.quantity, order.currency_code)}</span>
                        </div>
                    `).join('') || '<p>No items</p>'}
                    ${order.items?.length > 3 ? `<p style="color: #666;">+${order.items.length - 3} more items</p>` : ''}
                </div>
                
                <div class="order-total">
                    Total: ${formatCurrency(order.total, order.currency_code)}
                </div>
                
                <button class="btn-view" onclick="viewOrder('${order.id}')">View Details</button>
            </div>
        `).join('');
    } catch (error) {
        document.getElementById('ordersList').innerHTML = '<p>Failed to load orders</p>';
    }
}

// View order details
function viewOrder(orderId) {
    window.location.href = `order-details.html?id=${orderId}`;
}

// Initialize
loadOrders();
