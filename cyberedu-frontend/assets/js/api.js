// Global API service with automatic token refresh
class ApiService {
    constructor() {
        this.baseURL = "http://localhost:3000/api/v1";
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
        this.isRefreshing = false;
        this.failedQueue = [];
        this.cache = {};
        this.cacheTimers = {};
    }

    // Main request method with automatic token refresh
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authorization if token exists
        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Handle 401 - token expired
            if (response.status === 401 && !options._retry) {
                return this.handleUnauthorized(endpoint, options);
            }

            // Handle other errors
            if (!response.ok) {
                throw await this.handleError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    // Handle 401 Unauthorized with token refresh
    async handleUnauthorized(endpoint, options) {
        if (this.isRefreshing) {
            // Queue the request until token is refreshed
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject, endpoint, options });
            });
        }

        this.isRefreshing = true;

        try {
            // Attempt to refresh token
            const newTokens = await this.refreshAccessToken();
            
            // Update tokens
            this.accessToken = newTokens.accessToken;
            this.refreshToken = newTokens.refreshToken;
            
            localStorage.setItem('accessToken', this.accessToken);
            localStorage.setItem('refreshToken', this.refreshToken);

            // Retry original request
            const retryOptions = {
                ...options,
                _retry: true
            };

            if (this.accessToken) {
                retryOptions.headers = {
                    ...retryOptions.headers,
                    'Authorization': `Bearer ${this.accessToken}`
                };
            }

            const result = await this.request(endpoint, retryOptions);
            
            // Process queued requests
            this.processQueue();
            
            return result;
        } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            this.clearTokens();
            showPage('landing-page');
            throw new Error('Session expired. Please login again.');
        } finally {
            this.isRefreshing = false;
        }
    }

    // Refresh access token
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await fetch(`${this.baseURL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.refreshToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        return data.tokens || data;
    }

    // Process queued requests after token refresh
    processQueue() {
        this.failedQueue.forEach(request => {
            this.request(request.endpoint, request.options)
                .then(request.resolve)
                .catch(request.reject);
        });
        this.failedQueue = [];
    }

    // Handle API errors
    async handleError(response) {
        if (response.status === 0) {
            throw new Error("Network error. Check your connection.");
        }
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Could not parse JSON error
        }
        
        throw new Error(errorMessage);
    }

    // Clear all tokens
    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    // Convenience methods with caching
    get(endpoint) {
        if (this.cache[endpoint]) return Promise.resolve(this.cache[endpoint]);

        return this.request(endpoint, { method: 'GET' }).then(data => {
            this.cache[endpoint] = data;
            this.cacheTimers[endpoint] = setTimeout(() => {
                delete this.cache[endpoint];
            }, 5000); // cache for 5s
            return data;
        });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // File upload with FormData
    async uploadFile(endpoint, formData) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {};
        
        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData
            });

            if (response.status === 401 && !formData._retry) {
                await this.refreshAccessToken();
                return this.uploadFile(endpoint, { ...formData, _retry: true });
            }

            if (!response.ok) {
                throw await this.handleError(response);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    }
}

// Export singleton instance
const api = new ApiService();

// Legacy functions for backward compatibility
function headers(auth = false) {
    const h = { "Content-Type": "application/json" };
    if (auth && api.accessToken) h["Authorization"] = `Bearer ${api.accessToken}`;
    return h;
}

async function loginAPI(email, password) {
    return api.post("/auth/login", { email, password });
}

async function registerAPI(data) {
    return api.post("/auth/register", data);
}

async function meAPI() {
    return api.get("/auth/me");
}

async function fetchAllLabsAPI() {
    return api.get("/labs");
}

async function submitReportAPI(labId, payload) {
    return api.post(`/reports/${labId}`, payload);
}

export default api;