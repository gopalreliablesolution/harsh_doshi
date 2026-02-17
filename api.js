
const MedusaAPI = {
    async createCart(regionId = MEDUSA_CONFIG.DEFAULT_REGION_ID) {
        console.log("Creating cart with region:", regionId);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify({ region_id: regionId })
        });
        const data = await res.json();
        console.log("Cart response:", data);
        if (!res.ok) {
            console.error("Cart creation failed:", data);
            throw new Error(data.message || 'Failed to create cart');
        }
        return data;
    },

    async addLineItem(cartId, variantId, quantity) {
        console.log(`Adding item ${variantId} to cart ${cartId}...`);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}/line-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify({ variant_id: variantId, quantity: quantity })
        });
        const data = await res.json();
        console.log("Line item added:", data);
        if (!res.ok) {
            console.error("Failed to add line item:", data);
            if (data.code === 'insufficient_inventory') {
                throw new Error('Product is out of stock. Please update inventory in Medusa admin.');
            }
            throw new Error(data.message || 'Failed to add item to cart');
        }
        return data;
    },

    async updateCart(cartId, data) {
        console.log(`Updating cart ${cartId}...`, data);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        console.log("Cart updated:", result);
        return result;
    },

    async createPaymentSessions(cartId) {
        console.log(`Creating payment sessions for cart ${cartId}...`);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/custom-payment-sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify({ cart_id: cartId })
        });
        const data = await res.json();
        console.log("Payment sessions result:", data);
        return data;
    },

    async selectPaymentSession(cartId, providerId) {
        console.log(`Proxy Selecting payment session ${providerId} for cart ${cartId}...`);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/custom-payment-sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify({
                cart_id: cartId,
                action: "select",
                provider_id: providerId
            })
        });
        const data = await res.json();
        console.log("Payment session selection result:", data);
        return data;
    },

    async updatePaymentSession(cartId, providerId, data) {
        console.log(`Proxy Updating payment session ${providerId} for cart ${cartId}...`, data);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/custom-payment-sessions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify({
                cart_id: cartId,
                action: "update",
                provider_id: providerId,
                data: data
            })
        });
        return await res.json();
    },

    async completeCart(cartId) {
        console.log(`Completing cart ${cartId}...`);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            }
        });
        return await res.json();
    },

    async getShippingOptions(cartId) {
        console.log(`Fetching shipping options for cart ${cartId}...`);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/shipping-options?cart_id=${cartId}`, {
            headers: {
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            }
        });
        const data = await res.json();
        console.log("Shipping options:", data);
        return data;
    },

    async addShippingMethod(cartId, optionId) {
        console.log(`Adding shipping method ${optionId} to cart ${cartId}...`);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/carts/${cartId}/shipping-methods`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify({ option_id: optionId })
        });
        const data = await res.json();
        console.log("Shipping method added:", data);
        return data;
    },

    async getProducts(regionId = MEDUSA_CONFIG.DEFAULT_REGION_ID) {
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/products?region_id=${regionId}`, {
            headers: {
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            }
        });
        return await res.json();
    },

    async sendOrderConfirmationEmail(orderData) {
        if (MEDUSA_CONFIG.EMAIL_ENABLED === false) {
            console.log('Email sending disabled. Skipping order confirmation email.');
            return { success: true, message: 'Email sending disabled (client-side check)' };
        }

        console.log('Sending order confirmation email...', orderData);
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/send-order-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-publishable-api-key": MEDUSA_CONFIG.PUBLISHABLE_KEY
            },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        console.log('Email sent:', data);
        return data;
    }
};
