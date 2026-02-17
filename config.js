// ==============================================
// CONFIGURATION HOST
// ==============================================

// --- LOCAL DEVELOPMENT (Active) ---
// const BACKEND_URL = "http://localhost:9000";
const BACKEND_URL = "https://harsh-doshi-backend.onrender.com";

// --- LIVE PRODUCTION (Commented Out) ---
// const BACKEND_URL = "https://admin.harsshdoshi.com";

// ==============================================

let MEDUSA_CONFIG = {
    BACKEND_URL: BACKEND_URL,
    PUBLISHABLE_KEY: "pk_f6dfcefde2552a1c991451b1a965b2881375ed4edc83f05c210deb5efd4cdf28",
    DEFAULT_REGION_ID: "reg_01KHC4K9SJFN7Y4P0CBWWQX5EF", // Updated to India
    DEFAULT_SALES_CHANNEL_ID: "sc_01KHBW66YJWSFAJBP1DBJ5JW04",
    MAILCHIMP_URL: "https://dev.us5.list-manage.com/subscribe/post?u=915067af12e9f5066ade68b61&id=29c6b4e206",
    INDIA_REGION_ID: "reg_01KHC4K9SJFN7Y4P0CBWWQX5EF", // Updated
    INTERNATIONAL_REGION_ID: "reg_01KHC4KBHFV8S4PNRYTCW2D02Z", // Updated
    PRODUCTION_URL: "https://harsh.reliablesolution.in/",
    AUTH_ENDPOINTS: {
        LOGIN: "/auth/customer/emailpass",
        LOGOUT: "/auth/customer/emailpass",
        REGISTER: "/auth/customer/emailpass/register",
        PROFILE: "/store/auth/me",
        ORDERS: "/store/auth/me/orders",
        PASSWORD_RESET: "/store/customers/password-reset",
        PASSWORD_RESET_CONFIRM: "/store/customers/password-reset/confirm"
    }
};

// Alias for backward compatibility
const API_BASE_URL = MEDUSA_CONFIG.BACKEND_URL;

(async function loadConfig() {
    try {
        // Fetch email config, but don't log errors aggressively
        const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/email-config`);
        if (res.ok) {
            const data = await res.json();
            MEDUSA_CONFIG.EMAIL_ENABLED = data.emailEnabled;
            // console.log('Email config loaded:', data);
        }
    } catch (error) {
        // console.warn('Email config not loaded (optional):', error);
        MEDUSA_CONFIG.EMAIL_ENABLED = true; // Default to true if fetch fails
    }

    try {
        // Skip loading config from backend for now to avoid CORS issues
        // const res = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/store/config`);
        // const data = await res.json();
        // MEDUSA_CONFIG = { ...MEDUSA_CONFIG, ...data.config };
        console.log('Using local config');
        console.log('Backend URL:', MEDUSA_CONFIG.BACKEND_URL);
    } catch (error) {
        console.warn('Using default config:', error);
    }
})();
