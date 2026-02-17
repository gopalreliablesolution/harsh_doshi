// Customer Authentication Module for Medusa
const CustomerAuth = {
  TOKEN_KEY: 'medusa_customer_token',
  USER_KEY: 'medusa_customer_user',

  // Store token in localStorage
  storeToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  },

  // Get stored token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  // Remove token
  removeToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Store user data
  storeUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  // Get user data
  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Register new customer
  async register(userData) {
    // Use Medusa's built-in registration endpoint directly
    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}/auth/customer/emailpass/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data = await response.json();

    // If we have additional profile data, login and update profile
    if (userData.first_name || userData.last_name || userData.phone) {
      try {
        // Auto-login after registration
        await this.login(userData.email, userData.password);

        // Update profile with additional data
        await this.updateProfile({
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone
        });
      } catch (error) {
        console.warn('Profile update failed:', error);
      }
    }

    return data;
  },

  // Login with email and password
  async login(email, password) {
    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}${MEDUSA_CONFIG.AUTH_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);
    // if (response.ok) {
    //   const data = await response.json();
    //   if (data.token) this.storeToken(data.token);
    //   return data;
    // }
    if (response.ok) {
      if (data.token) {
        this.storeToken(data.token);
      }
      return data;
    }
    throw new Error('Login failed');
  },

  // Logout
  async logout() {
    try {
      const token = this.getToken();
      await fetch(`${MEDUSA_CONFIG.BACKEND_URL}${MEDUSA_CONFIG.AUTH_ENDPOINTS.LOGOUT}`, {
        method: 'DELETE',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
          'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
        } : {
          'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
        },
        credentials: 'include'
      });
    } finally {
      this.removeToken();
      window.location.href = '/login.html';
    }
  },

  // Get current user profile
  async getCurrentUser() {
    const token = this.getToken();
    console.log("Frontend [DEBUG]: getCurrentUser token:", token);
    const headers = token ? {
      'Authorization': `Bearer ${token}`,
      'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
    } : {
      'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
    };
    console.log("Frontend [DEBUG]: Request headers:", headers);

    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}${MEDUSA_CONFIG.AUTH_ENDPOINTS.PROFILE}`, {
      headers: headers,
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      this.storeUser(data.customer);
      return data.customer;
    }
    return null;
  },

  // Update profile
  async updateProfile(profileData) {
    const token = this.getToken();
    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}${MEDUSA_CONFIG.AUTH_ENDPOINTS.PROFILE}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY,
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      credentials: 'include',
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return response.json();
  },

  // Get customer orders
  async getOrders() {
    const token = this.getToken();
    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}${MEDUSA_CONFIG.AUTH_ENDPOINTS.ORDERS}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
      } : {
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
      },
      credentials: 'include'
    });

    if (response.ok) {
      return response.json();
    }
    return { orders: [] };
  },

  // Request password reset
  async requestPasswordReset(email) {
    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}${MEDUSA_CONFIG.AUTH_ENDPOINTS.PASSWORD_RESET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
      },
      body: JSON.stringify({ email })
    });
    return response.json();
  },

  // Confirm password reset
  async confirmPasswordReset(token, password) {
    const response = await fetch(`${MEDUSA_CONFIG.BACKEND_URL}${MEDUSA_CONFIG.AUTH_ENDPOINTS.PASSWORD_RESET_CONFIRM}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': MEDUSA_CONFIG.PUBLISHABLE_KEY
      },
      body: JSON.stringify({ token, password })
    });
    return response.json();
  },

  // Redirect to login if not authenticated
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }
    return true;
  }
};
