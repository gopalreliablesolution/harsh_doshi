// Shopping bag functionality
function removeFromCart(index) {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    items.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(items));
    updateShoppingBag();
}

// function toggleShoppingBag() {
//     const sidebar = document.querySelector('.shopping-bag-sidebar');
//     const overlay = document.querySelector('.shopping-bag-overlay');
//     if (!sidebar || !overlay) return;
//     const willOpen = !sidebar.classList.contains('open');
//     sidebar.classList.toggle('open');
//     if (willOpen) overlay.classList.add('visible'); else overlay.classList.remove('visible');
//     updateShoppingBag();
// }


function toggleShoppingBag() {
    const sidebar = document.querySelector('.shopping-bag-sidebar');
    const overlay = document.querySelector('.shopping-bag-overlay');
    if (!sidebar || !overlay) return;

    const isMobile = window.innerWidth <= 768;
    const willOpen = !sidebar.classList.contains('open');

    sidebar.classList.toggle('open');

    if (willOpen) {
        scrollPosition = window.scrollY || window.pageYOffset;
        overlay.classList.add('visible');

        // ADD THIS - Force override everything
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        if (isMobile) {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPosition}px`;
            document.body.style.width = '100%';
        }

    } else {
        overlay.classList.remove('visible');

        // ADD THIS - Restore only if shopping bag is closed
        if (isMobile) {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollPosition);
        }

        // DON'T restore overflow here - let smooth scroll handle it
        // The smooth scroll script will re-apply its own overflow: hidden
    }

    updateShoppingBag();
}
// function closeShoppingBag() {
//     const sidebar = document.querySelector('.shopping-bag-sidebar');
//     const overlay = document.querySelector('.shopping-bag-overlay');
//     if (!sidebar || !overlay) return;
//     sidebar.classList.remove('open');
//     overlay.classList.remove('visible');
// }
function closeShoppingBag() {
    const sidebar = document.querySelector('.shopping-bag-sidebar');
    const overlay = document.querySelector('.shopping-bag-overlay');
    if (!sidebar || !overlay) return;

    const isMobile = window.innerWidth <= 768;

    sidebar.classList.remove('open');
    overlay.classList.remove('visible');

    // UNLOCK scrolling for ALL devices and ALL pages
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    if (isMobile) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position for mobile
        window.scrollTo(0, scrollPosition);
    }


}

function updateShoppingBag() {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const container = document.querySelector('.cart-items-container');
    const subtotalElement = document.querySelector('.subtotal-amount');
    const bagCountElements = document.querySelectorAll('.bag-count');

    // Update bag count in all headers
    bagCountElements.forEach(element => {
        if (items.length > 0) {
            element.textContent = `(${items.length})`;
        } else {
            element.textContent = '';
        }
    });

    if (!container || !subtotalElement) return;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="cart-empty" style="font-family: 'Lato', sans-serif;">
                <p>Your shopping bag is empty</p>
            </div>
        `;
        subtotalElement.textContent = '\u20B90.00';
        return;
    }

    let subtotal = 0;
    let currencySymbol = '\u20B9';

    container.innerHTML = items.map((item, index) => {
        // Parse price properly - remove currency symbols and commas
        const priceStr = (item.price || '0').toString();
        if (priceStr.includes('\u20B9')) currencySymbol = '\u20B9';
        if (priceStr.includes('$')) currencySymbol = '$';

        const price = parseFloat(priceStr.replace(/[^\d.-]/g, '')) || 0;
        subtotal += price;

        const formattedPrice = currencySymbol === '\u20B9'
            ? price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image || ''}" alt="${item.title || 'Product'}" onerror="this.src='assets/placeholder.jpg'">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.title || 'Product'}</h3>
                    <div class="cart-item-details">
                        <p class="cart-item-description" style="font-family: 'Lato', sans-serif;">${item.description || 'No description available'}</p>
                        <p class="cart-item-meta">Metal: ${item.metal || 'N/A'}</p>
                        <p class="cart-item-meta">Size: ${item.size || 'N/A'}</p>
                    </div>
                    <div class="cart-item-bottom">
                        <p class="cart-item-price">${currencySymbol} ${formattedPrice}</p>
                        <button class="remove-item" onclick="removeFromCart(${index})" aria-label="Remove item">
                            <svg viewBox="0 0 24 24" width="16" height="16">
                                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    const formattedSubtotal = currencySymbol === '\u20B9'
        ? subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    subtotalElement.textContent = `${currencySymbol} ${formattedSubtotal}`;
}

function redirectToCheckout() {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (items.length === 0) {
        if (typeof showCustomAlert === 'function') {
            showCustomAlert("Your shopping bag is empty.");
        } else {
            alert("Your shopping bag is empty.");
        }
    } else {
        window.location.href = 'checkout.html';
    }
}

// Initialize shopping bag when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Add overlay and shopping bag sidebar to the page if not present
    if (!document.querySelector('.shopping-bag-overlay')) {
        document.body.insertAdjacentHTML('beforeend', `<div class="shopping-bag-overlay"></div>`);
    }

    if (!document.querySelector('.shopping-bag-sidebar')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="shopping-bag-sidebar" aria-hidden="true">
                <div class="sidebar-header">
                    <h2>SHOPPING BAG <span class="bag-count">(${JSON.parse(localStorage.getItem('cartItems') || '[]').length})</span></h2>
                    <button class="close-sidebar" onclick="closeShoppingBag()" aria-label="Close shopping bag">×</button>
                </div>
                <div class="cart-items-container" style="max-height: calc(100dvh - 200px); overflow-y: auto;">
                    <!-- Cart items will be inserted here -->
                </div>
                <div class="sidebar-footer" style="margin-top: auto; background: white; border-top: 1px solid #eee; padding: 20px;">
                    <div class="subtotal" style="font-family: 'Lato', sans-serif; margin-bottom: 15px; display: flex; justify-content: space-between;">
                        <span>Subtotal</span>
                        <span class="subtotal-amount">$0.00</span>
                    </div>
                    <button class="checkout-button" style="font-family: 'Lato', sans-serif; width: 100%;" onclick="redirectToCheckout()">VIEW MY SHOPPING BAG</button>
                </div>
            </div>
        `);
    }

    const overlay = document.querySelector('.shopping-bag-overlay');
    overlay.addEventListener('click', () => {
        // closeShoppingBag();
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (items.length === 0) {
            alert("Your shopping bag is empty. Please add items before proceeding to checkout.");
        }
        // if (items.length === 0) {
        // alertCustom("Your shopping bag is empty. Please add items to your bag before proceeding to checkout.", "alert");
        //     closeShoppingBag();
        // } else {
        //     closeShoppingBag();
        // }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeShoppingBag();
        }
    });

    // Ensure the cart display is up-to-date
    updateShoppingBag();
});
